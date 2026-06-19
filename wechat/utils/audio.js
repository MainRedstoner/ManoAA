// utils/audio.js
/**
 * 音频工具（iPad/ iOS 兼容优化版）
 * - 根据平台自动切换 OGG / M4A 格式
 * - 强制使用 WebAudio 实现（useWebAudioImplement）
 * - 全局覆盖静音开关（obeyMuteSwitch: false）
 * - 修复预加载导致的 iOS 自动播放拦截
 * - 增加背景音效 BGS（循环播放）及淡出功能
 * - 增加音量控制功能（BGM/BGS 独立调节）
 */

const { adaptAudioUrl } = require('./platform.js');

let bgmIntroAudio = null;   // 片头音乐实例（单次播放）
let bgmLoopAudio = null;    // 循环音乐实例（无限循环）
let bgsAudio = null;        // 背景音效实例（循环）
let se = null;              // 音效实例（复用）
let voice = null;

// 全局缓存映射：原始URL（适配后） => 本地缓存路径
let audioCacheMap = new Map();

// 渐弱定时器
let fadeOutInterval = null;
let bgsFadeOutInterval = null;   // BGS 专用淡出定时器

// ---- 全局初始化：覆盖静音开关（必须在任何音频创建前调用）----
if (typeof wx !== 'undefined' && wx.setInnerAudioOption) {
  wx.setInnerAudioOption({
    obeyMuteSwitch: false   // iPad / iPhone 静音键不再影响小程序内部音频
  });
}

/**
 * 设置缓存映射（由预加载模块调用）
 */
function setCacheMap(map) {
  audioCacheMap = map;
}

/**
 * 获取实际播放路径（优先使用本地缓存，否则使用适配后的网络地址）
 * @param {string} url - 原始剧情中配置的 URL（如 OGG 地址）
 */
function getRealPath(url) {
  if (!url) return url;
  const adaptedUrl = adaptAudioUrl(url);               // 平台适配
  return audioCacheMap.get(adaptedUrl) || adaptedUrl;  // 缓存命中则返回本地路径
}

/**
 * 创建并配置一个音频实例（强制 WebAudio 实现）
 * @param {string} src - 原始 URL
 * @param {boolean} loop - 是否循环
 */
function createAudio(src, loop = false) {
  const realSrc = getRealPath(src);
  const audio = wx.createInnerAudioContext({
    useWebAudioImplement: true
  });
  audio.src = realSrc;
  audio.loop = loop;
  audio.autoplay = false;
  audio.onError((err) => {
    console.error('[音频错误]', err);
    console.error('[错误音频 src]', audio.src);
  });
  return audio;
}

/**
 * 设置背景音乐音量（包括 intro 和 loop）
 * @param {number} volume - 0~1 之间的浮点数
 */
function setBgmVolume(volume) {
  const vol = Math.max(0, Math.min(1, volume));
  if (bgmIntroAudio) {
    bgmIntroAudio.volume = vol;
  }
  if (bgmLoopAudio) {
    bgmLoopAudio.volume = vol;
  }
}

/**
 * 设置背景音效音量
 * @param {number} volume - 0~1 之间的浮点数
 */
function setBgsVolume(volume) {
  const vol = Math.max(0, Math.min(1, volume));
  if (bgsAudio) {
    bgsAudio.volume = vol;
  }
}

/**
 * 播放背景音乐（支持片头 intro，无缝衔接循环，支持初始音量）
 * @param {string} bgmSrc - 循环音乐地址
 * @param {string} introSrc - 片头音乐地址（可选）
 * @param {number} bgmVolume - 音量，默认 1
 */
function playBgmWithIntro(bgmSrc, introSrc, bgmVolume = 1) {
  stopBgm();  // 停止当前并清理渐弱
  const volume = Math.max(0, Math.min(1, bgmVolume));

  if (!introSrc) {
    if (!bgmSrc) return;
    bgmLoopAudio = createAudio(bgmSrc, true);
    bgmLoopAudio.volume = volume;
    bgmLoopAudio.play();
    return;
  }

  if (bgmSrc) {
    bgmLoopAudio = createAudio(bgmSrc, true);
    bgmLoopAudio.volume = volume;
  }

  bgmIntroAudio = createAudio(introSrc, false);
  bgmIntroAudio.volume = volume;

  bgmIntroAudio.onEnded(() => {
    if (bgmIntroAudio) {
      bgmIntroAudio.destroy();
      bgmIntroAudio = null;
    }
    if (bgmLoopAudio) {
      if (bgmLoopAudio.duration > 0) bgmLoopAudio.seek(0);
      bgmLoopAudio.play();
    }
  });

  bgmIntroAudio.play();
}

/**
 * 播放背景音乐（仅循环，支持音量）
 * @param {string} src - 音乐地址
 * @param {number} volume - 音量，默认 1
 */
function playBgm(src, volume = 1) {
  if (!src) return;
  playBgmWithIntro(src, null, volume);
}

/**
 * 停止背景音乐
 */
function stopBgm() {
  if (fadeOutInterval) {
    clearInterval(fadeOutInterval);
    fadeOutInterval = null;
  }
  if (bgmIntroAudio) {
    bgmIntroAudio.stop();
    bgmIntroAudio.destroy();
    bgmIntroAudio = null;
  }
  if (bgmLoopAudio) {
    bgmLoopAudio.stop();
    bgmLoopAudio.destroy();
    bgmLoopAudio = null;
  }
}

/**
 * 暂停背景音乐
 */
function pauseBgm() {
  if (bgmLoopAudio && !bgmLoopAudio.paused) bgmLoopAudio.pause();
  if (bgmIntroAudio && !bgmIntroAudio.paused) bgmIntroAudio.pause();
}

/**
 * 淡出背景音乐（从当前实际音量开始递减）
 * @param {number} duration - 淡出时长（毫秒），默认 2000
 */
function fadeOutBgm(duration = 2000) {
  if (fadeOutInterval) clearInterval(fadeOutInterval);

  const bgmAudioList = [];
  const initialVolumes = [];
  
  if (bgmIntroAudio && !bgmIntroAudio.paused) {
    bgmAudioList.push(bgmIntroAudio);
    initialVolumes.push(bgmIntroAudio.volume);
  }
  if (bgmLoopAudio && !bgmLoopAudio.paused) {
    bgmAudioList.push(bgmLoopAudio);
    initialVolumes.push(bgmLoopAudio.volume);
  }
  
  if (bgmAudioList.length === 0) return;

  const stepTime = 50;
  const steps = Math.ceil(duration / stepTime);
  let currentStep = 0;

  fadeOutInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps; // 0 -> 1
    bgmAudioList.forEach((audio, idx) => {
      const initialVol = initialVolumes[idx];
      const newVolume = Math.max(0, initialVol * (1 - progress));
      if (audio && !audio.paused) audio.volume = newVolume;
    });
    
    if (currentStep >= steps) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = null;
      stopBgm(); // 停止并销毁实例
    }
  }, stepTime);
}

/**
 * 播放音效（每次独立实例）
 * @param {string} src - 音效地址
 */
function playSe(src) {
  if (!src) return;
  const realSrc = getRealPath(src);
  const seAudio = wx.createInnerAudioContext({ useWebAudioImplement: true });
  seAudio.src = realSrc;
  seAudio.play();
  seAudio.onEnded(() => seAudio.destroy());
  seAudio.onError((err) => {
    console.error('[SE 错误]', err, 'src:', realSrc);
    seAudio.destroy();
  });
}

/**
 * 初始化语音实例
 */
function initVoice() {
  if (!voice) {
    voice = wx.createInnerAudioContext({ useWebAudioImplement: true });
    voice.loop = false;
    voice.autoplay = false;
    voice.onError((err) => console.error('[语音错误]', err, 'src:', voice.src));
  }
  return voice;
}

/**
 * 播放语音
 * @param {string} src - 语音地址
 */
function playVoice(src) {
  if (!src) return;
  const audio = initVoice();
  const realSrc = getRealPath(src);
  try {
    audio.stop();
    audio.src = realSrc;
    audio.play();
  } catch (e) {
    console.error('playVoice 异常：', e);
  }
}

/**
 * 停止语音
 */
function stopVoice() {
  if (voice) {
    try {
      voice.stop();
    } catch (e) {}
  }
}

/**
 * 播放背景音效（循环，支持音量）
 * @param {string} src - 音频地址
 * @param {number} bgsVolume - 音量，默认 1
 */
function playBgs(src, bgsVolume = 1) {
  if (!src) return;
  const realSrc = getRealPath(src);
  const volume = Math.max(0, Math.min(1, bgsVolume));
  
  // 清除正在进行的淡出
  if (bgsFadeOutInterval) {
    clearInterval(bgsFadeOutInterval);
    bgsFadeOutInterval = null;
  }
  
  // 已有实例且地址相同
  if (bgsAudio && bgsAudio.src === realSrc) {
    if (bgsAudio.volume !== 1) bgsAudio.volume = 1;
    if (bgsAudio.paused) {
      bgsAudio.play();
    }
    bgsAudio.volume = volume;
    return;
  }
  
  // 不同地址则停止旧的并播放新的
  stopBgs();
  
  bgsAudio = createAudio(src, true);
  bgsAudio.volume = volume;
  bgsAudio.play();
}

/**
 * 淡出并停止背景音效（从当前实际音量开始递减）
 * @param {number} duration - 淡出时长（毫秒），默认 2000
 */
function fadeOutBgs(duration = 2000) {
  if (!bgsAudio || bgsAudio.paused) {
    return;
  }
  
  if (bgsFadeOutInterval) {
    clearInterval(bgsFadeOutInterval);
    bgsFadeOutInterval = null;
  }
  
  const initialVolume = bgsAudio.volume;
  const stepTime = 50;
  const steps = Math.ceil(duration / stepTime);
  let currentStep = 0;
  
  bgsFadeOutInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const newVolume = Math.max(0, initialVolume * (1 - progress));
    if (bgsAudio) bgsAudio.volume = newVolume;
    
    if (currentStep >= steps) {
      clearInterval(bgsFadeOutInterval);
      bgsFadeOutInterval = null;
      stopBgs();
    }
  }, stepTime);
}

/**
 * 立即停止并销毁背景音效（无淡出）
 */
function stopBgs() {
  if (bgsFadeOutInterval) {
    clearInterval(bgsFadeOutInterval);
    bgsFadeOutInterval = null;
  }
  if (bgsAudio) {
    try {
      bgsAudio.stop();
      bgsAudio.destroy();
    } catch (e) {
      console.error('[BGS] 停止失败', e);
    }
    bgsAudio = null;
  }
}

/**
 * 销毁所有音频实例
 */
function destroyAllAudio() {
  stopBgm();
  stopBgs();
  if (voice) {
    voice.destroy();
    voice = null;
  }
  if (se) {
    se.destroy();
    se = null;
  }
}

module.exports = {
  playBgm,
  playBgmWithIntro,
  stopBgm,
  pauseBgm,
  playSe,
  playVoice,
  stopVoice,
  destroyAllAudio,
  setCacheMap,
  fadeOutBgm,
  playBgs,
  stopBgs,
  fadeOutBgs,
  setBgmVolume,
  setBgsVolume
};
