// utils/preload.js
const story = require("../data/story.js");
const encyclopedia = require("../data/encyclopedia.js");
const { adaptAudioUrl } = require("./platform.js");

const CONCURRENT_LIMIT = 10;
const MAX_RETRY = 5;
const RETRY_429_DELAY = 0;

/**
 * 从单个 story 节点提取资源，加入对应的 Set
 */
function collectItemResources(item, imageSet, audioSet, videoSet) {
  if (item.bg && typeof item.bg === 'string') imageSet.add(item.bg);
  if (item.bgVideo && typeof item.bgVideo === 'string') videoSet.add(item.bgVideo);
  if (item.bgPoster && typeof item.bgPoster === 'string') imageSet.add(item.bgPoster);
  
  if (item.character) {
    if (Array.isArray(item.character)) {
      item.character.forEach(src => {
        if (src && typeof src === 'string') imageSet.add(src);
      });
    } else if (typeof item.character === 'string') {
      imageSet.add(item.character);
    }
  }
  
  // /stop 和 !stop 是控制指令，不是真实 URL，跳过
  if (item.bgm && item.bgm !== '/stop' && item.bgm !== '!stop') audioSet.add(adaptAudioUrl(item.bgm));
  if (item.bgmIntro) audioSet.add(adaptAudioUrl(item.bgmIntro));
  if (item.bgs && item.bgs !== '/stop' && item.bgs !== '!stop') audioSet.add(adaptAudioUrl(item.bgs));
  if (item.se) audioSet.add(adaptAudioUrl(item.se));
  if (item.voice) audioSet.add(adaptAudioUrl(item.voice));

  if (item.objectionImg && typeof item.objectionImg === 'string') {
    imageSet.add(item.objectionImg);
  }

  if (item.table && typeof item.table === 'string') {
    imageSet.add(item.table);
  }

  // 收集 addEncyclopedia 条目中的图片
  if (item.addEncyclopedia) {
    const entries = Array.isArray(item.addEncyclopedia) ? item.addEncyclopedia : [item.addEncyclopedia];
    entries.forEach(entry => {
      if (entry.profile && typeof entry.profile === 'string') imageSet.add(entry.profile);
      if (entry.img && typeof entry.img === 'string') imageSet.add(entry.img);
      // 收集 details（字符串 URL 或 URL 数组）
      if (entry.details) {
        if (typeof entry.details === 'string' && entry.details.startsWith('http')) {
          imageSet.add(entry.details);
        } else if (Array.isArray(entry.details)) {
          entry.details.forEach(d => {
            if (typeof d === 'string' && d.startsWith('http')) imageSet.add(d);
          });
        }
      }
    });
  }
}

/**
 * 提取图鉴（百科）引用的所有图片资源
 */
function extractEncyclopediaResources() {
  const imageSet = new Set();
  if (!encyclopedia) return { images: [], audios: [], videos: [] };

  for (const key in encyclopedia) {
    const items = encyclopedia[key];
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (item.profile && typeof item.profile === 'string') imageSet.add(item.profile);
        if (item.details) {
          if (typeof item.details === 'string' && item.details.startsWith('http')) {
            imageSet.add(item.details);
          } else if (Array.isArray(item.details)) {
            item.details.forEach(d => {
              if (typeof d === 'string' && d.startsWith('http')) imageSet.add(d);
            });
          }
        }
      });
    }
  }

  return { images: Array.from(imageSet), audios: [], videos: [] };
}

/**
 * 提取某个章节（按 id 前缀）引用的所有资源
 * @param {string} prefix - 章节前缀，如 '1.' 或 '2.'
 */
function extractChapterResources(prefix) {
  const imageSet = new Set();
  const audioSet = new Set();
  const videoSet = new Set();

  story.forEach(item => {
    const idStr = String(item.id);
    if (idStr.startsWith(prefix)) {
      collectItemResources(item, imageSet, audioSet, videoSet);
    }
  });

  return {
    images: Array.from(imageSet),
    audios: Array.from(audioSet),
    videos: Array.from(videoSet)
  };
}

/**
 * 下载单个文件（单次尝试）
 */
function downloadFile(url, type) {
  return new Promise((resolve, reject) => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      console.warn(`跳过无效 URL：${url}`);
      reject(new Error(`invalid url: ${url}`));
      return;
    }
    wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          const fileManager = wx.getFileSystemManager();
          fileManager.saveFile({
            tempFilePath: res.tempFilePath,
            success: (saveRes) => {
              resolve(saveRes.savedFilePath);
            },
            fail: (err) => {
              resolve(res.tempFilePath);
            }
          });
        } else {
          const err = new Error(`HTTP ${res.statusCode}`);
          err.statusCode = res.statusCode;
          reject(err);
        }
      },
      fail: reject
    });
  });
}

/**
 * 带重试的下载
 */
function downloadWithRetry(url, type, retries = MAX_RETRY) {
  return downloadFile(url, type).catch(err => {
    if (err.statusCode === 429) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          downloadWithRetry(url, type, retries).then(resolve).catch(reject);
        }, RETRY_429_DELAY);
      });
    }
    
    if (retries > 0) {
      return downloadWithRetry(url, type, retries - 1);
    }
    
    throw err;
  });
}

/**
 * 并发批量下载资源
 * @param {string[]} urls - 资源 URL 列表
 * @param {string} type - 资源类型（'image'/'audio'/'video'）
 * @param {function} onItemComplete - 每个文件完成时的回调 (completed, total, url)
 * @returns {Promise<Map>} URL → 本地路径 的映射
 */
async function batchDownload(urls, type, onItemComplete) {
  const urlToPath = new Map();
  let completed = 0;
  const total = urls.length;
  if (total === 0) return urlToPath;

  let index = 0;
  const activePromises = [];

  const next = () => {
    if (index >= total) return Promise.resolve();
    const currentUrl = urls[index];
    const promise = downloadWithRetry(currentUrl, type)
      .then(localPath => {
        urlToPath.set(currentUrl, localPath);
      })
      .catch(err => {
        console.error(`下载失败: ${currentUrl}`, err);
      })
      .finally(() => {
        completed++;
        onItemComplete && onItemComplete(completed, total, currentUrl);
      });
    const p = promise.then(() => {
      const idx = activePromises.indexOf(p);
      if (idx > -1) activePromises.splice(idx, 1);
      return next();
    });
    activePromises.push(p);
    index++;
    return p;
  };

  const initialTasks = [];
  for (let i = 0; i < Math.min(CONCURRENT_LIMIT, total); i++) {
    initialTasks.push(next());
  }
  await Promise.all(initialTasks);
  await Promise.all(activePromises);
  return urlToPath;
}

/**
 * 下载指定的资源集合，返回缓存映射
 * @param {string[]} images - 图片 URL 列表
 * @param {string[]} audios - 音频 URL 列表
 * @param {string[]} videos - 视频 URL 列表
 * @param {function} onProgress - 进度回调 (current, total, url, type)
 * @returns {Promise<{imageMap: Map, audioMap: Map, videoMap: Map}>}
 */
async function downloadResources(images, audios, videos, onProgress) {
  const total = images.length + audios.length + videos.length;
  if (total === 0) {
    onProgress && onProgress(1, 1, null, 'none');
    return { imageMap: new Map(), audioMap: new Map(), videoMap: new Map() };
  }

  let currentCount = 0;
  const updateProgress = (type, url) => {
    currentCount++;
    if (onProgress) {
      onProgress(currentCount, total, url, type);
    }
  };

  const imagePromise = batchDownload(images, 'image', (c, t, url) => updateProgress('image', url));
  const audioPromise = batchDownload(audios, 'audio', (c, t, url) => updateProgress('audio', url));
  const videoPromise = batchDownload(videos, 'video', (c, t, url) => updateProgress('video', url));

  const [imageMap, audioMap, videoMap] = await Promise.all([imagePromise, audioPromise, videoPromise]);
  return { imageMap, audioMap, videoMap };
}

/**
 * 预加载全部资源（旧版，保留兼容）
 */
async function preloadAll(onProgress) {
  const { images, audios, videos } = extractChapterResources('');
  const enc = extractEncyclopediaResources();
  const allImages = [...new Set([...images, ...enc.images])];
  return downloadResources(allImages, audios, videos, onProgress);
}

module.exports = {
  preloadAll,
  extractChapterResources,
  extractEncyclopediaResources,
  downloadResources
};
