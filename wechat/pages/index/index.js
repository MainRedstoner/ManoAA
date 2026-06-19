// pages/index/index.js
const { 
  playBgmWithIntro, 
  playSe, 
  playVoice, 
  stopVoice, 
  destroyAllAudio, 
  setCacheMap, 
  fadeOutBgm, 
  playBgs, 
  fadeOutBgs, 
  stopBgs, 
  stopBgm, 
  setBgmVolume, 
  setBgsVolume
} = require("../../utils/audio");

const story = require("../../data/story");
const { saveGame, loadGame, clearGame } = require("../../utils/save");
const { downloadResources, extractChapterResources, extractEncyclopediaResources } = require("../../utils/preload");
const encyclopedia = require("../../data/encyclopedia");

Page({
  data: {
    storyList: [],
    current: {},
    currentIndex: 0,
    state: { favorability: 0 },
    displayText: "",
    isTyping: false,
    showChoices: false,
    autoPlay: false,
    orientation: "portrait",
    historyList: [],
    showHistory: false,
    historyBtnText: "历史",
    historyScrollIntoView: "",
    savePointList: [],
    showSavePoints: false,
    showSavePointWarning: false,
    savePointBtnText: "存档点",
    savePointScrollIntoView: "",
    isLoading: true,
    loadProgress: 0,
    loadText: "正在加载资源...",
    showHint: false,
    showEncyclopedia: false,
    encyActiveTab: "evidence",
    encyData: [],
    encySelectedId: null,
    encySelectedItem: { name: '', desc: '', profileLocal: null, details: null },
    loadError: false,
    presentMode: false,
    presentDefaultIndex: null,
    presentSpecialIndexList: [],
    presentSpecialIDList: [],
    presentForced: false,
    darkMaskOpacity: 0,
    darkMaskTransition: 'transition: opacity 3000ms ease;',
    characterHeightRatio: 1.8,
    windowHeight: 0,
    characterList: [],
    charHeight: 0,
    videoCacheMap: null,
    currentVideoSrc: '',
    currentVideoPoster: '',
    currentVideoLoop: true,
    isVideoReady: false,
    showDetailPopup: false,
    detailPages: [],
    detailCurrentPage: 0,
    detailIsImage: false,
    // 异议特效
    showObjection: false,
    objectionImg: '',
    objectionAnimClass: '',
    // 强制出示交互模式专用
    forcedInteractiveMode: false,      // 是否处于强制出示交互模式
    forcedImageSrc: '',                // 要显示的证物详情图片
    forcedImageRect: { left: 0, top: 0, width: 0, height: 0 }, // 图片在屏幕上的实际位置
    forcedRectStyle: '',               // 矩形边框的 style
    forcedMarkStyle: '',               // 标记点的 style
    forcedSelectedPos: null,           // 当前选中的相对坐标 { x, y }
    presentForcedItemId: null,         // 当前强制出示的证物 ID
    presentForcedRect: null,           // 矩形区域 { x, y, w, h } 相对值
    presentSuccessId: null,            // 点在矩形内跳转的剧情 ID
    presentFailId: null,               // 点在矩形外跳转的剧情 ID
    scrollXEnabled: false,
    scrollYEnabled: false,
    imageMode: 'widthFix',
    imageStyle: '',
    forcedImageMode: 'widthFix',   // 动态模式
    forcedImageStyle: '',          // 动态样式（宽度或高度 100%）
    courtMode: '',                 // 法庭模式：'left' / 'right' / 'mid' / ''
    bgPositionX: 'center',         // 背景图水平对齐位置
    bgPositionY: 'center',         // 背景图垂直对齐位置
    bgSize: 'cover',               // 背景图缩放（cover=aspectFill, contain=aspectFit）
    tableImageSrc: '',
    // BGM / BGS 状态追踪（供存档读档恢复用）
    trackedBgm: '',
    trackedBgmIntro: '',
    trackedBgmVolume: 1,
    trackedBgs: '',
    trackedBgsVolume: 1,
    tableImageStyle: 'width: 100%; height: 100%;'
  },

  typingTimer: null,
  autoTimer: null,
  skipTimer: null,
  presentForcedTimer: null,
  imageCacheMap: null,
  characterSizeCache: new Map(),
  _darkTimer: null,
  _resetTransitionTimer: null,
  _nextCharacterId: 1,
  _characterAnimTimer: null,
  _characterRemoveTimers: [],
  _animationGeneration: 0,
  videoContext: null,
  videoReadyTimer: null,

  doNothing() { },

  buildSavePointList(storyList) {
    return (storyList || []).reduce((nodes, item, storyIndex) => {
      // 只添加有 save: true 的存档点节点，不包含选项分支
      if (item.save !== true) return nodes;

      const idText = String(item.id);
      const rawText = item.text || "";
      const firstLine = rawText.split("\n").find(line => line.trim()) || "";
      const title = item.saveTitle || (item.speaker ? `${item.speaker} 存档` : `存档点 ${nodes.length + 1}`);
      const desc = item.saveDesc || (firstLine.length > 34 ? `${firstLine.slice(0, 34)}...` : (firstLine || `剧情 ID ${idText}`));

      nodes.push({
        id: item.id,
        idText,
        storyIndex,
        domId: `save-point-${storyIndex}`,
        title,
        desc,
        isSavePoint: true
      });
      return nodes;
    }, []);
  },

  async onLoad() {
    console.log("onLoad 开始");
    const savePointList = this.buildSavePointList(story);
    this.setData({ storyList: story, savePointList });
    this.checkOrientation();
    await this.startPreload();
    console.log("预加载完成，准备进入剧情");
    this.setData({ isLoading: false });
    this.jumpToStoryId('1.1');
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const charHeight = systemInfo.windowHeight * this.data.characterHeightRatio;
    this.setData({ windowHeight: systemInfo.windowHeight, charHeight });
  },

  onReady() {
    this.videoContext = wx.createVideoContext('bgVideo', this);
  },

  /**
   * 处理下载完成的图片：获取尺寸信息并缓存
   */
  async processImageMaps(imageMap) {
    const imageEntries = Array.from(imageMap.entries());
    // 合并到全局缓存（后续章节后台下载的也会合并进来）
    for (const [url, localPath] of imageEntries) {
      this.imageCacheMap.set(url, localPath);
    }

    // 仅处理新增的、尚未获取尺寸的图片
    const newEntries = imageEntries.filter(([url]) => !this.characterSizeCache.has(url));
    if (newEntries.length === 0) return;

    await Promise.all(newEntries.map(async ([url, localPath]) => {
      return new Promise((resolve) => {
        wx.getImageInfo({
          src: localPath,
          success: (res) => {
            this.characterSizeCache.set(url, { width: res.width, height: res.height });
            resolve();
          },
          fail: () => {
            this.characterSizeCache.set(url, { width: 300, height: 300 });
            resolve();
          }
        });
      });
    }));
  },

  /**
   * 后台静默下载下一章节资源，并合并到缓存（带去重）
   */
  async _preloadChapterBackground(prefix) {
    // 防止同一章节被重复下载
    if (this._chapterLoadingSet === undefined) this._chapterLoadingSet = new Set();
    if (this._chapterLoadingSet.has(prefix)) return;

    const chapterRes = extractChapterResources(prefix);
    // 如果该章节的所有图片和音频已在缓存中，说明已下载过，跳过
    if (this.imageCacheMap && this.imageCacheMap.size > 0) {
      const allImagesCached = chapterRes.images.every(url => this.imageCacheMap.has(url));
      const allAudiosCached = chapterRes.audios.every(url => this.audioCacheMap?.has(url));
      const allVideosCached = chapterRes.videos.every(url => this.videoCacheMap?.has(url));
      if (allImagesCached && allAudiosCached && allVideosCached &&
          (chapterRes.images.length + chapterRes.audios.length + chapterRes.videos.length > 0)) {
        return;
      }
    }

    this._chapterLoadingSet.add(prefix);
    if (chapterRes.images.length === 0 && chapterRes.audios.length === 0 && chapterRes.videos.length === 0) return;

    try {
      const { imageMap, audioMap, videoMap } = await downloadResources(
        chapterRes.images,
        chapterRes.audios,
        chapterRes.videos
      );
      await this.processImageMaps(imageMap);
      if (this.audioCacheMap) {
        for (const [url, localPath] of audioMap) {
          this.audioCacheMap.set(url, localPath);
        }
      }
      if (this.videoCacheMap) {
        for (const [url, localPath] of videoMap) {
          this.videoCacheMap.set(url, localPath);
        }
      }
    } catch (err) {
      console.error('[后台] 章节', prefix, '下载失败', err);
    }
  },

  /**
   * 跳转到剧情时，自动在后台加载下一章节资源
   */
  preloadNextChapterSilent(storyId) {
    const idStr = String(storyId);
    // 从 ID 推断当前章节数
    const match = idStr.match(/^(\d+)\./);
    if (!match) return;
    const currentChapter = parseInt(match[1], 10);
    const nextChapter = currentChapter + 1;
    this._preloadChapterBackground(nextChapter + '.');
  },

  async startPreload() {
    this.setData({ isLoading: true, loadProgress: 0, loadText: '正在加载资源...', loadError: false });
    try {
      // 第 1 步：只下载图鉴 + 第 1 章资源
      const ch1 = extractChapterResources('1.');
      const enc = extractEncyclopediaResources();

      // 合并去重
      const allImages = [...new Set([...ch1.images, ...enc.images])];
      const allAudios = [...ch1.audios];
      const allVideos = [...ch1.videos];

      const { imageMap, audioMap, videoMap } = await downloadResources(
        allImages, allAudios, allVideos,
        (current, total, url, type) => {
          const percent = Math.floor((current / total) * 100);
          this.setData({
            loadProgress: percent,
            loadText: `正在加载${type === 'image' ? '图片' : type === 'audio' ? '音频' : '视频'} (${current}/${total})`
          });
        }
      );

      this.imageCacheMap = new Map();
      await this.processImageMaps(imageMap);

      this.videoCacheMap = new Map(videoMap);
      // 音频缓存需要一个全局引用给 audio.js 用
      this.audioCacheMap = audioMap;
      setCacheMap(audioMap);

      this.prepareEncyclopediaData();
      this.setData({ isLoading: false });

      // 第 2 步：进入游戏后后台静默下载第 2 章
      this._preloadChapterBackground('2.');
    } catch (err) {
      console.error('[启动] 预加载失败', err);
      this.setData({ loadError: true, loadText: '资源加载失败，请检查网络后重试' });
    }
  },

  retryPreload() {
    this.startPreload();
  },

  getVideoRealPath(originalUrl) {
    if (!originalUrl) return '';
    return this.videoCacheMap?.get(originalUrl) || originalUrl;
  },

  /** 深拷贝图鉴数据（避免修改原始模块） */
  cloneEncyclopedia() {
    const orig = encyclopedia;
    const clone = {};
    for (const key in orig) {
      if (Array.isArray(orig[key])) {
        clone[key] = orig[key].map(item => ({ ...item }));
      } else {
        clone[key] = orig[key];
      }
    }
    return clone;
  },

  /**
   * 根据剧情索引重建图鉴：扫描 storyList[0..storyIndex-1] 中所有 addEncyclopedia
   * 确保无论从哪个入口跳转过来，证物列表都与当前剧情进度一致
   */
  rebuildEncyclopediaUpTo(storyIndex) {
    this.encyclopediaData = this.cloneEncyclopedia();
    let changed = false;
    for (let i = 0; i < storyIndex; i++) {
      const node = this.data.storyList[i];
      if (!node || !node.addEncyclopedia) continue;
      const list = Array.isArray(node.addEncyclopedia) ? node.addEncyclopedia : [node.addEncyclopedia];
      for (const entry of list) {
        if (!entry || !entry.type || !entry.id) continue;
        const { type, ...data } = entry;
        if (!this.encyclopediaData[type]) {
          this.encyclopediaData[type] = [];
        }
        if (this.encyclopediaData[type].some(item => item.id === data.id)) continue;
        this.encyclopediaData[type].push(data);
        changed = true;
      }
    }
    if (changed) this.prepareEncyclopediaData();
  },

  prepareEncyclopediaData() {
    if (!this.encyclopediaData) {
      this.encyclopediaData = this.cloneEncyclopedia();
    }
    const processed = {};
    for (const key in this.encyclopediaData) {
      const items = this.encyclopediaData[key];
      if (Array.isArray(items)) {
        processed[key] = items.map(item => {
          const newItem = { ...item };
          
          // profile 头像
          if (newItem.profile && this.imageCacheMap?.has(newItem.profile)) {
            newItem.profileLocal = this.imageCacheMap.get(newItem.profile);
          } else {
            newItem.profileLocal = newItem.profile || null;
          }
          
          // details：地图大图 / 证物详情（保留原始字段 details_raw，转换后存 details）
          if (newItem.details) {
            newItem.details_raw = newItem.details;
            if (Array.isArray(newItem.details)) {
              newItem.details = newItem.details.map(url => {
                if (typeof url === 'string' && url.startsWith('http')) {
                  return this.imageCacheMap?.has(url) ? this.imageCacheMap.get(url) : url;
                }
                return url;
              });
            } else if (typeof newItem.details === 'string' && newItem.details.startsWith('http')) {
              newItem.details = this.imageCacheMap?.has(newItem.details) 
                ? this.imageCacheMap.get(newItem.details) 
                : newItem.details;
            }
          }
          
          // 底部滚动栏名称：非图标分类每 2-3 字换行
          if (key !== 'evidence' && key !== 'witness' && newItem.name && newItem.name.length > 3) {
            const chars = [...newItem.name];
            const lines = [];
            const step = chars.length === 4 ? 2 : 3;
            for (let i = 0; i < chars.length; i += step) {
              lines.push(chars.slice(i, i + step).join(''));
            }
            newItem.scrollName = lines.join('\n');
          } else {
            newItem.scrollName = newItem.name;
          }

          return newItem;
        });
      } else {
        processed[key] = items;
      }
    }
    
    this.setData({ encyData: processed });
    
    // 重置选中状态
    this.setData({
      encySelectedId: null,
      encySelectedItem: { name: '', desc: '', profileLocal: null, details: null }
    });
    
    // 如果百科已打开，刷新显示
    if (this.data.showEncyclopedia && !this.data.presentMode) {
      setTimeout(() => this.showEncyclopedia(), 50);
    }
  },

  /**
   * 从剧情中动态添加图鉴条目
   * @param {Object|Array} items - 单条或数组，格式 { type: 'evidence'|'witness'|..., id, name, desc, profile, img, ... }
   */
  addEncyclopediaItems(items) {
    const list = Array.isArray(items) ? items : [items];
    let changed = false;

    for (const entry of list) {
      if (!entry || !entry.type || !entry.id) {
        console.warn('[图鉴] 跳过无效条目', entry);
        continue;
      }
      const { type, ...data } = entry;
      // 确保分类存在
      if (!this.encyclopediaData[type]) {
        this.encyclopediaData[type] = [];
      }
      // 检查是否已存在相同 id
      const exists = this.encyclopediaData[type].some(item => item.id === data.id);
      if (exists) {
        continue;
      }
      this.encyclopediaData[type].push(data);
      changed = true;
    }

    if (changed) {
      this.prepareEncyclopediaData();
    }
  },

  replaceImagePath(item) {
    if (!item) return item;
    const newItem = { ...item };
    if (newItem.bg && this.imageCacheMap?.has(newItem.bg)) newItem.bg = this.imageCacheMap.get(newItem.bg);
    if (newItem.bgPoster && this.imageCacheMap?.has(newItem.bgPoster)) newItem.bgPoster = this.imageCacheMap.get(newItem.bgPoster);
    if (newItem.character) {
      if (Array.isArray(newItem.character)) newItem.character = newItem.character.map(src => this.imageCacheMap?.get(src) || src);
      else newItem.character = this.imageCacheMap.get(newItem.character);
    }
    if (newItem.objectionImg && this.imageCacheMap?.has(newItem.objectionImg)) newItem.objectionImg = this.imageCacheMap.get(newItem.objectionImg);
    if (newItem.table && this.imageCacheMap?.has(newItem.table)) newItem.table = this.imageCacheMap.get(newItem.table);
    return newItem;
  },

  getCharacterSizeStyle(src) {
    const sizeInfo = this.characterSizeCache.get(src);
    if (!sizeInfo) return '';
    const { width: origWidth, height: origHeight } = sizeInfo;
    const targetHeight = this.data.charHeight;
    if (!targetHeight) return '';
    const targetWidth = (origWidth / origHeight) * targetHeight;
    return `width: ${targetWidth}px; height: ${targetHeight}px;`;
  },

  onCharacterLoad(e) {
    const index = e.currentTarget.dataset.index;
    const { width: origWidth, height: origHeight } = e.detail;
    const src = this.data.characterList[index]?.src;
    if (src && (!this.characterSizeCache.has(src) || this.characterSizeCache.get(src).width !== origWidth)) {
      this.characterSizeCache.set(src, { width: origWidth, height: origHeight });
      const newSizeStyle = this.getCharacterSizeStyle(src);
      if (newSizeStyle) {
        const newList = [...this.data.characterList];
        newList[index] = { ...newList[index], sizeStyle: newSizeStyle };
        this.setData({ characterList: newList });
      }
    }
    const item = this.data.characterList[index];
    if (item && item.pendingAnim && !item.animClass) {
      let animClass = '';
      if (item.pendingAnim === 1) animClass = 'anim-enter-rotate';
      else if (item.pendingAnim === 2) animClass = 'anim-enter-fade';
      if (animClass) {
        const newList = [...this.data.characterList];
        newList[index] = { ...newList[index], animClass, pendingAnim: null };
        this.setData({ characterList: newList });
      }
    }
  },

  waitForImageLoad(src, callback) {
    if (!src) { callback && callback(); return; }
    if (this.characterSizeCache.has(src)) { callback && callback(); return; }
    wx.getImageInfo({ src, success: () => callback && callback(), fail: () => callback && callback() });
  },

  recalcAllCharacterSizes() {
    const { characterList, charHeight } = this.data;
    if (!charHeight || characterList.length === 0) return;
    let needUpdate = false;
    const newList = characterList.map(item => {
      const sizeInfo = this.characterSizeCache.get(item.src);
      if (sizeInfo) {
        const targetWidth = (sizeInfo.width / sizeInfo.height) * charHeight;
        const sizeStyle = `width: ${targetWidth}px; height: ${charHeight}px;`;
        if (item.sizeStyle !== sizeStyle) { needUpdate = true; return { ...item, sizeStyle }; }
      }
      return item;
    });
    if (needUpdate) this.setData({ characterList: newList });
  },

  onCharacterAnimEnd(e) { },

  removeCharacterById(id) {
    // 检查此移除请求是否已失效（生成号过时或已有新剧情跳转）
    const newList = this.data.characterList.filter(c => c.id !== id);
    if (newList.length !== this.data.characterList.length) this.setData({ characterList: newList });
  },

  calcCharacterLeftPercent(index, total) {
    if (total === 0) return 50;
    return ((index + 0.5) / total) * 100;
  },

  parseCharacterConfig(current) {
    let rawCharacter = current.character;
    let rawEnterAnim = current.characterEnterAnim;
    let rawExitAnim = current.characterExitAnim;
    let charArray = [];
    if (Array.isArray(rawCharacter)) charArray = rawCharacter;
    else if (rawCharacter && rawCharacter !== '') charArray = [rawCharacter];
    let enterArray = [];
    if (Array.isArray(rawEnterAnim)) enterArray = rawEnterAnim;
    else if (rawEnterAnim !== undefined && rawEnterAnim !== '') enterArray = [rawEnterAnim];
    let exitArray = [];
    if (Array.isArray(rawExitAnim)) exitArray = rawExitAnim;
    else if (rawExitAnim !== undefined && rawExitAnim !== '') exitArray = [rawExitAnim];
    const n = charArray.length;
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push({
        src: charArray[i],
        enterAnim: enterArray[i] !== undefined ? enterArray[i] : (enterArray[0] || 0),
        exitAnim: exitArray[i] !== undefined ? exitArray[i] : (exitArray[0] || 0),
      });
    }
    return result;
  },

  updateCharacterList(targetConfig) {
    // 清除上一步的动画定时器，防止交叉干扰
    if (this._characterAnimTimer) {
      clearTimeout(this._characterAnimTimer);
      this._characterAnimTimer = null;
    }
    // 清除所有待执行的移除定时器
    for (const tid of this._characterRemoveTimers) {
      clearTimeout(tid);
    }
    this._characterRemoveTimers = [];

    const gen = this._animationGeneration;
    const currentList = this.data.characterList;
    const total = targetConfig.length;
    const targetMap = new Map();
    for (let i = 0; i < total; i++) {
      const cfg = targetConfig[i];
      if (!cfg.src) continue;
      targetMap.set(cfg.src, {
        left: this.calcCharacterLeftPercent(i, total),
        enterAnim: cfg.enterAnim,
        exitAnim: cfg.exitAnim,
        sizeStyle: this.getCharacterSizeStyle(cfg.src) || '',
      });
    }
    let updatedList = [...currentList];
    let needUpdate = false;
    const ANIM_DURATION = 800;
    for (let i = 0; i < updatedList.length; i++) {
      const item = updatedList[i];
      const target = targetMap.get(item.src);
      if (target) {
        updatedList[i] = { ...item, left: target.left, exitAnim: target.exitAnim, enterAnim: target.enterAnim, sizeStyle: target.sizeStyle };
        needUpdate = true;
        targetMap.delete(item.src);
      } else {
        let exitAnim = item.exitAnim;
        let animClass = '';
        if (exitAnim === 3) animClass = 'anim-exit-rotate';
        else if (exitAnim === 4) animClass = 'anim-exit-fade';
        if (animClass) {
          updatedList[i] = { ...item, animClass, _pendingRemove: true };
          needUpdate = true;
          const charId = item.id;
          const tid = setTimeout(() => this.removeCharacterById(charId), ANIM_DURATION);
          this._characterRemoveTimers.push(tid);
        } else {
          updatedList[i] = { ...item, _pendingRemove: true };
          needUpdate = true;
          const tid = setTimeout(() => this.removeCharacterById(item.id), 0);
          this._characterRemoveTimers.push(tid);
        }
      }
    }
    for (let [src, data] of targetMap.entries()) {
      updatedList.push({
        id: this._nextCharacterId++,
        src: src,
        left: data.left,
        animClass: '',
        pendingAnim: data.enterAnim,
        exitAnim: data.exitAnim,
        sizeStyle: data.sizeStyle,
      });
      needUpdate = true;
    }
    if (needUpdate) this.setData({ characterList: updatedList });
    this._characterAnimTimer = setTimeout(() => {
      this._characterAnimTimer = null;
      // 检查生成号：如果已被新剧情跳转覆盖，直接跳过
      if (gen !== this._animationGeneration) return;
      const curList = this.data.characterList;
      for (let i = 0; i < curList.length; i++) {
        const item = curList[i];
        if (item.pendingAnim && !item.animClass) {
          this.waitForImageLoad(item.src, () => {
            if (gen !== this._animationGeneration) return;
            const idx = this.data.characterList.findIndex(c => c.id === item.id);
            if (idx !== -1 && this.data.characterList[idx].pendingAnim) {
              let animClass = '';
              const animType = this.data.characterList[idx].pendingAnim;
              if (animType === 1) animClass = 'anim-enter-rotate';
              else if (animType === 2) animClass = 'anim-enter-fade';
              if (animClass) {
                const newList = [...this.data.characterList];
                newList[idx] = { ...newList[idx], animClass, pendingAnim: null };
                this.setData({ characterList: newList });
              }
            }
          });
        }
      }
    }, 50);
  },

  computeShowHint(current) {
    if (!current) return false;
    if (this.data.showObjection) return false;
    if (current.choices || current.isEnding) return false;
    if (current.presentForced === true) return false;
    const skip = current.skip;
    if (typeof skip === "number" && !isNaN(skip) && skip > 0) return false;
    return true;
  },

  playVideoIfNeeded() {
    if (!this.data.currentVideoSrc) return;
    if (!this.videoContext) this.videoContext = wx.createVideoContext('bgVideo', this);
    if (!this.data.isVideoReady) {
      return;
    }
    if (this.videoContext && this.data.currentVideoSrc) {
      this.videoContext.play();
    }
  },

  stopCurrentVideo() {
    if (this.videoContext) this.videoContext.stop();
  },

  /**
   * 确保目标章节资源已缓存，若未缓存则显示加载界面等待下载完成
   * @param {string} prefix - 章节前缀，如 '1.' '2.'
   * @returns {Promise<void>}
   */
  /**
   * 后台加固缓存：每次跳转时检查图鉴、当前章节、下一章节的资源是否缺失，缺失则自动下载补充
   * 不阻塞 UI，与跳转并行执行
   * @param {string|number} storyId - 当前跳转的剧情节点 ID
   */
  _backfillMissingCache(storyId) {
    const idStr = String(storyId);
    const chapterMatch = idStr.match(/^(\d+)\./);
    const chapterPrefix = chapterMatch ? chapterMatch[1] + '.' : null;

    (async () => {
      try {
        // 图鉴资源：直接补缺（量小，不会重复触发）
        if (this.imageCacheMap && this.imageCacheMap.size > 0) {
          const enc = extractEncyclopediaResources();
          const missingEncImages = enc.images.filter(url => !this.imageCacheMap.has(url));
          if (missingEncImages.length > 0) {
            const { imageMap } = await downloadResources(missingEncImages, [], []);
            await this.processImageMaps(imageMap);
          }
        }

        // 当前章节资源：委托给 _preloadChapterBackground（有并发守卫和缓存检查）
        if (chapterPrefix) {
          this._preloadChapterBackground(chapterPrefix);

          // 下一章节预载
          const currentChapter = parseInt(chapterMatch[1], 10);
          const nextPrefix = (currentChapter + 1) + '.';
          if (!this._chapterLoadingSet?.has(nextPrefix)) {
            this._preloadChapterBackground(nextPrefix);
          }
        }
      } catch (err) {
        console.error('[缓存加固] 后台下载出错', err);
      }
    })();
  },

  async ensureChapterLoaded(chapterPrefix) {
    const chapterRes = extractChapterResources(chapterPrefix);
    const enc = extractEncyclopediaResources();
    const allImages = [...new Set([...chapterRes.images, ...enc.images])];

    const missingImages = allImages.filter(url => !this.imageCacheMap?.has(url));
    const missingAudios = chapterRes.audios.filter(url => !this.audioCacheMap?.has(url));
    const missingVideos = chapterRes.videos.filter(url => !this.videoCacheMap?.has(url));

    if (missingImages.length === 0 && missingAudios.length === 0 && missingVideos.length === 0) {
      return; // 全部已缓存
    }

    // 显示 loading 界面
    this.setData({ isLoading: true, loadProgress: 0, loadText: '正在加载章节资源...', loadError: false });

    try {
      const { imageMap, audioMap, videoMap } = await downloadResources(
        missingImages, missingAudios, missingVideos,
        (current, total, url, type) => {
          const percent = Math.floor((current / total) * 100);
          this.setData({
            loadProgress: percent,
            loadText: `正在加载${type === 'image' ? '图片' : type === 'audio' ? '音频' : '视频'} (${current}/${total})`
          });
        }
      );
      await this.processImageMaps(imageMap);
      if (this.audioCacheMap) {
        for (const [url, localPath] of audioMap) this.audioCacheMap.set(url, localPath);
      } else {
        this.audioCacheMap = audioMap;
        setCacheMap(audioMap);
      }
      if (this.videoCacheMap) {
        for (const [url, localPath] of videoMap) this.videoCacheMap.set(url, localPath);
      } else {
        this.videoCacheMap = new Map(videoMap);
      }
    } catch (err) {
      console.error('[章节加载] 失败', err);
      this.setData({ loadError: true, loadText: '资源加载失败，请检查网络后重试' });
      throw err;
    }

    this.setData({ isLoading: false });
  },

  async jumpToStoryId(id, preferredIndex = -1) {
    // 检查目标章节资源是否已缓存，未缓存则阻塞等待下载
    const targetIdStr = String(id);
    const chapterMatch = targetIdStr.match(/^(\d+)\./);
    if (chapterMatch && this.imageCacheMap && this.imageCacheMap.size > 0) {
      const targetPrefix = chapterMatch[1] + '.';
      const currentPrefix = this._currentChapter || '';
      if (targetPrefix !== currentPrefix) {
        try {
          await this.ensureChapterLoaded(targetPrefix);
        } catch (e) {
          return; // 下载失败，不继续跳转
        }
        this._currentChapter = targetPrefix;
      }
    }

    // 后台加固缓存（不阻塞跳转）
    this._backfillMissingCache(id);

    this._animationGeneration++;
    this.clearAllTimers();
    this.abortDarkFade();
    if (this.videoReadyTimer) clearTimeout(this.videoReadyTimer);
    this.setData({ isVideoReady: false });

    const targetId = String(id);
    const preferredItem = this.data.storyList[preferredIndex];
    const index = preferredItem && String(preferredItem.id) === targetId
      ? preferredIndex
      : this.data.storyList.findIndex(item => String(item.id) === targetId);
    if (index === -1) { wx.showToast({ title: "剧情ID不存在", icon: "none" }); return; }
    let current = this.data.storyList[index];
    const origObjectionImg = current.objectionImg;  // 保存原始URL用于分支判断
    current = this.replaceImagePath(current);

    // 读档：当剧情节点有 load: true 时，读取存档并跳转到保存的位置
    if (current.load) {
      const savedData = loadGame();
      if (savedData && savedData.currentId) {
        // 读档时还原证物列表
        this.encyclopediaData = this.cloneEncyclopedia();
        this.prepareEncyclopediaData();
        const savedState = savedData.state || { favorability: 0 };
        const savedHistory = savedData.historyList || [];
        this.setData({ state: savedState, historyList: savedHistory });

        // 停止当前音频，跳转后由 jumpToStoryId 按目标节点重新设定
        stopBgm();
        stopBgs();
        this.setData({ trackedBgm: '', trackedBgmIntro: '', trackedBgs: '' });

        this.jumpToStoryId(savedData.currentId);
        return;
      } else {
        console.warn("[读档] 没有找到存档，继续当前剧情");
      }
    }

    const newVideoSrc = current.bgVideo ? this.getVideoRealPath(current.bgVideo) : '';
    const oldVideoSrc = this.data.currentVideoSrc;
    const newVideoLoop = current.bgVideoLoop !== undefined ? current.bgVideoLoop : true;
    const videoPoster = current.bgPoster || current.bg || '';
    if (newVideoSrc !== oldVideoSrc || this.data.currentVideoLoop !== newVideoLoop) {
      this.stopCurrentVideo();
      this.setData({ currentVideoSrc: newVideoSrc, currentVideoPoster: videoPoster, currentVideoLoop: newVideoLoop });
    } else if (newVideoSrc !== '' && this.videoContext) {
      this.setData({ currentVideoPoster: videoPoster });
    }

    // 后台加载下一章节资源
    this.preloadNextChapterSilent(id);

    // 法庭模式处理
    const courtMode = current.court || '';
    if (courtMode === 'mid') {
      const bgSize = current.bgMode === 'aspectFit' ? 'contain' : 'cover';
      this.setData({ courtMode: 'mid', bgPositionX: 'center', bgPositionY: 'center', bgSize, tableImageSrc: current.table || '', tableImageStyle: 'width: 100%; height: 100%;' });
      this.setData({ charHeight: this.data.windowHeight * this.data.characterHeightRatio });
    } else if (courtMode === 'left' || courtMode === 'right') {
      // 根据屏幕宽高比决定垂直对齐：
      // 屏幕长宽比 < 16:9（较窄）：高度 100%，紧贴左/右侧（与原来一样）
      // 屏幕长宽比 > 16:9（较宽）：放大裁切，左下/右下角紧贴屏幕，不留黑边
      const wi = this.getWindowInfoSafe();
      const screenRatio = wi.windowWidth / wi.windowHeight;
      const bgPosY = screenRatio > 16 / 9 ? 'bottom' : 'center';
      this.setData({ courtMode, bgPositionX: courtMode, bgPositionY: bgPosY, bgSize: 'cover', tableImageSrc: current.table || '', tableImageStyle: 'height: 100%; width: auto;' });
      this.setData({ charHeight: this.data.windowHeight });
    } else {
      const bgSize = current.bgMode === 'aspectFit' ? 'contain' : 'cover';
      this.setData({ courtMode: '', bgPositionX: 'center', bgPositionY: 'center', bgSize, tableImageStyle: 'width: 100%; height: 100%;' });
      this.setData({ charHeight: this.data.windowHeight * this.data.characterHeightRatio });
    }
    this.recalcAllCharacterSizes();

    this.handleDarkFade(current.dark, current.darkDuration);
    this.applyEffect(current.effect || {});
    this.applyEffectOnce(current.effectOnce || {});
    const showChoices = !!current.choices;
    const showHint = this.computeShowHint(current);
    this.setData({ currentIndex: index, current, showChoices, showHint });

    // 处理 BGM（支持音量）
    if (current.bgm === "!stop") {
      stopBgm();
      this.setData({ trackedBgm: '', trackedBgmIntro: '' });
    } else if (current.bgm === "/stop") {
      fadeOutBgm(2000);
      this.setData({ trackedBgm: '', trackedBgmIntro: '' });
    } else if (current.bgm || current.bgmIntro) {
      const bgmVolume = current.bgmVolume !== undefined ? current.bgmVolume : 1;
      playBgmWithIntro(current.bgm, current.bgmIntro, bgmVolume);
      this.setData({ trackedBgm: current.bgm || '', trackedBgmIntro: current.bgmIntro || '', trackedBgmVolume: bgmVolume });
    } else if (current.bgmVolume !== undefined) {
      setBgmVolume(current.bgmVolume);
      this.setData({ trackedBgmVolume: current.bgmVolume });
    }

    // 处理 BGS（支持音量）
    if (current.bgs === "!stop") {
      stopBgs();
      this.setData({ trackedBgs: '' });
    } else if (current.bgs === "/stop") {
      fadeOutBgs();
      this.setData({ trackedBgs: '' });
    } else if (current.bgs) {
      const bgsVolume = current.bgsVolume !== undefined ? current.bgsVolume : 1;
      playBgs(current.bgs, bgsVolume);
      this.setData({ trackedBgs: current.bgs, trackedBgsVolume: bgsVolume });
    } else if (current.bgsVolume !== undefined) {
      setBgsVolume(current.bgsVolume);
      this.setData({ trackedBgsVolume: current.bgsVolume });
    }

    const isTestimonyEffect = origObjectionImg && (origObjectionImg.includes('testimony_start') || origObjectionImg.includes('testimony_end') || origObjectionImg.includes('cross_examination_start'));
    if (current.se && !isTestimonyEffect) playSe(current.se);
    if (current.voice) playVoice(current.voice);
    else stopVoice();

    // 存档：当剧情节点有 save: true 时，保存当前游戏进度（在 BGM/BGS 设置之后）
    if (current.save) {
      const savedState = {
        currentId: current.id,
        state: this.data.state,
        historyList: this.data.historyList,
        savedBgm: this.data.trackedBgm,
        savedBgmIntro: this.data.trackedBgmIntro,
        savedBgmVolume: this.data.trackedBgmVolume,
        savedBgs: this.data.trackedBgs,
        savedBgsVolume: this.data.trackedBgsVolume
      };
      saveGame(savedState);
      console.log("[存档] 已保存:", savedState.currentId);
    }

    if (current.endingCheck) { this.handleEndingCheck(); return; }

    // 条件分支：检查多个 state key 是否全部满足
    if (current.conditionKeys && current.conditionKeys.length > 0) {
      const allMet = current.conditionKeys.every(key => (this.data.state[key] || 0) >= 1);
      const target = allMet ? current.nextIfTrue : current.nextIfFalse;
      if (target) {
        this.jumpToStoryId(target);
        return;
      }
    }

    this.setData({ characterList: [] });
    const targetConfig = this.parseCharacterConfig(current);
    this.updateCharacterList(targetConfig);

    // 非法庭模式下延迟清除桌子
    if (!current.court) {
      this.setData({ tableImageSrc: '' });
    }

    // 重建图鉴
    this.rebuildEncyclopediaUpTo(index);

    // 动态添加图鉴条目（支持单条或数组）
    if (current.addEncyclopedia) {
      this.addEncyclopediaItems(current.addEncyclopedia);
    }

    if (current.objectionImg) {
      this.setData({ isTyping: false, displayText: "" });
      if (isTestimonyEffect) {
        await this.showTestimonyEffect(current.objectionImg, current.se);
      } else {
        await this.showObjectionAnimation(current.objectionImg);
      }
    }

    if (current.text && current.text.trim().length > 0) {
      this.startTyping(current.text);
    } else {
      this.setData({ isTyping: false, displayText: "" });
      this.handleAfterTyping();
    }
  },

  showObjectionAnimation(imgPath) {
    return new Promise((resolve) => {
      this.setData({ showObjection: true, objectionImg: imgPath, objectionAnimClass: 'anim-show' });
      setTimeout(() => {
        this.setData({ objectionAnimClass: 'anim-hide' });
        setTimeout(() => {
          this.setData({ showObjection: false, objectionImg: '', objectionAnimClass: '' });
          resolve();
        }, 150);
      }, 900);
    });
  },

  showTestimonyEffect(imgPath, seUrl) {
    return new Promise((resolve) => {
      if (seUrl) playSe(seUrl);
      this.setData({ showObjection: true, objectionImg: imgPath, objectionAnimClass: 'testimony-show' });
      setTimeout(() => {
        this.setData({ objectionAnimClass: 'testimony-hide' });
        setTimeout(() => {
          this.setData({ showObjection: false, objectionImg: '', objectionAnimClass: '' });
          resolve();
        }, 500);
      }, 2000);
    });
  },

  startTyping(fullText) {
    this.clearTypingTimer();
    let i = 0;
    this.setData({ displayText: "", isTyping: true, showHint: false });
    this.typingTimer = setInterval(() => {
      if (i >= fullText.length) {
        this.clearTypingTimer();
        const newShowHint = this.computeShowHint(this.data.current);
        this.setData({ isTyping: false, showHint: newShowHint });
        this.recordHistory(this.data.current.speaker, fullText);
        this.handleAfterTyping();
        return;
      }
      this.setData({ displayText: fullText.slice(0, i + 1) });
      i++;
    }, 45);
  },

  handleAfterTyping() {
    const { current, showChoices, autoPlay } = this.data;
    if (showChoices || current.isEnding) return;
    if (current.presentForced === true) {
      if (this.presentForcedTimer) clearTimeout(this.presentForcedTimer);
      this.presentForcedTimer = setTimeout(() => { this.showPresentPanel(true); this.presentForcedTimer = null; }, 1000);
      return;
    }
    const skip = current.skip;
    if (skip === "click") return;
    if (typeof skip === "number" && !isNaN(skip) && skip > 0) {
      this.clearSkipTimer();
      this.skipTimer = setTimeout(() => {
        if (!this.data.isTyping && !this.data.showChoices && !this.data.current.isEnding) this.goNext();
        this.skipTimer = null;
      }, skip * 1000);
      return;
    }
    if (autoPlay) {
      this.scheduleAutoNext();
      this.playVideoIfNeeded();
    }
  },

  recordHistory(speaker, content) {
    if (!content || content.trim() === "") return;
    const newRecord = { speaker: speaker || "", content: content };
    this.setData({ historyList: [...this.data.historyList, newRecord] }, () => {
      if (this.data.showHistory) this.scrollHistoryToBottom();
    });
  },

  scrollHistoryToBottom() {
    const len = this.data.historyList.length;
    if (len === 0) return;
    const lastId = `history-item-${len - 1}`;
    this.setData({ historyScrollIntoView: lastId });
    setTimeout(() => { if (this.data.historyScrollIntoView === lastId) this.setData({ historyScrollIntoView: "" }); }, 300);
  },

  onDialogTap() {
    if (this.data.showObjection) return;
    const { current, isTyping, showChoices } = this.data;
    if (showChoices) return;
    if (current.presentForced === true) return;
    const skip = current.skip;
    if (typeof skip === "number" && !isNaN(skip) && skip > 0) return;
    if (!current.text || current.text === '') {
      this.goNext();
      return;
    }
    if (isTyping) {
      this.clearTypingTimer();
      const fullText = current.text;
      this.setData({ displayText: fullText, isTyping: false });
      this.recordHistory(current.speaker, fullText);
      const newShowHint = this.computeShowHint(current);
      this.setData({ showHint: newShowHint });
      this.handleAfterTyping();
      return;
    }
    if (current.isEnding) return;
    this.playVideoIfNeeded();
    this.goNext();
  },

  goNext() {
    const { current, storyList, currentIndex } = this.data;
    if (current.next) { this.jumpToStoryId(current.next); return; }
    const nextItem = storyList[currentIndex + 1];
    if (nextItem) this.jumpToStoryId(nextItem.id);
  },

  onChoose(e) {
    const next = e.currentTarget.dataset.next;
    const effect = e.currentTarget.dataset.effect || {};
    const choiceText = e.currentTarget.dataset.text || "";
    this.applyEffect(effect);
    if (choiceText) this.recordHistory("选项", choiceText);
    this.setData({ showChoices: false });
    this.jumpToStoryId(next);
  },

  applyEffect(effect) {
    if (!effect) return;
    const newState = { ...this.data.state };
    Object.keys(effect).forEach(key => {
      const change = Number(effect[key]) || 0;
      if (typeof newState[key] !== "number") newState[key] = 0;
      newState[key] += change;
    });
    this.setData({ state: newState });
  },

  applyEffectOnce(effectOnce) {
    if (!effectOnce) return;
    const newState = { ...this.data.state };
    let changed = false;
    Object.keys(effectOnce).forEach(key => {
      if (!newState[key]) {
        newState[key] = effectOnce[key] || 0;
        changed = true;
      }
    });
    if (changed) this.setData({ state: newState });
  },

  handleEndingCheck() {
    const favor = this.data.state.favorability;
    if (favor >= 5) this.jumpToStoryId(102);
    else if (favor >= 3) this.jumpToStoryId(101);
    else this.jumpToStoryId(100);
  },

  showHistory() {
    // 强制出示模式下禁止打开历史
    if (this.data.forcedInteractiveMode) {
      wx.showToast({ title: "请先完成出示", icon: "none" });
      return;
    }
    const isShowing = this.data.showHistory;
    if (isShowing) this.hideHistory();
    else {
      this.setData({ showHistory: true, historyBtnText: "关闭", showSavePoints: false, savePointBtnText: "存档点" }, () => {
        this.scrollHistoryToBottom();
      });
    }
  },

  hideHistory() {
    this.setData({ showHistory: false, historyBtnText: "历史" });
  },

  showSavePoints() {
    if (this.data.forcedInteractiveMode) {
      wx.showToast({ title: "请先完成出示", icon: "none" });
      return;
    }

    const isShowing = this.data.showSavePoints;
    if (isShowing) {
      this.hideSavePoints();
      return;
    }

    this.setData({ showSavePointWarning: true });
  },

  hideSavePoints() {
    this.setData({ showSavePoints: false, savePointBtnText: "存档点", savePointScrollIntoView: "" });
  },

  confirmSavePointWarning() {
    this.setData({ showSavePointWarning: false });
    const currentNode = this.data.savePointList.find(item => item.storyIndex === this.data.currentIndex);
    this.setData({
      showSavePoints: true,
      savePointBtnText: "关闭",
      showHistory: false,
      historyBtnText: "历史",
      savePointScrollIntoView: currentNode ? currentNode.domId : ""
    });
  },

  cancelSavePointWarning() {
    this.setData({ showSavePointWarning: false });
  },

  onSavePointTap(e) {
    const storyIndex = Number(e.currentTarget.dataset.index);
    const target = this.data.storyList[storyIndex];
    if (!target) {
      wx.showToast({ title: "存档点不存在", icon: "none" });
      return;
    }

    this.setData({ showSavePoints: false, savePointBtnText: "存档点", savePointScrollIntoView: "" });

    // 加载存档数据，恢复游戏状态和图鉴
    const savedData = loadGame();
    if (savedData && savedData.currentId) {
      const savedState = savedData.state || { favorability: 0 };
      const savedHistory = savedData.historyList || [];
      this.setData({ state: savedState, historyList: savedHistory });

      // 恢复图鉴数据
      this.encyclopediaData = this.cloneEncyclopedia();
      this.prepareEncyclopediaData();
    } else {
      // 没有存档数据时，仅初始化图鉴
      this.encyclopediaData = this.cloneEncyclopedia();
      this.prepareEncyclopediaData();
    }

    // 跳转前找到目标节点对应的正确 BGM（不依赖存档中的 BGM 记录）
    // 从目标节点开始向前扫描，找到最近的 BGM 设置节点
    let foundBgm = null;
    let foundBgmIntro = null;
    let foundBgmVolume = undefined;
    for (let i = storyIndex; i >= 0; i--) {
      const node = this.data.storyList[i];
      if (node.bgm && node.bgm !== "/stop" && node.bgm !== "!stop") {
        foundBgm = node.bgm;
        foundBgmIntro = node.bgmIntro || null;
        foundBgmVolume = node.bgmVolume;
        break;
      }
      if (node.bgm === "/stop" || node.bgm === "!stop") {
        break;  // 之前停过 BGM，说明前面没有 BGM
      }
    }
    if (foundBgm) {
      const vol = foundBgmVolume !== undefined ? foundBgmVolume : 1;
      playBgmWithIntro(foundBgm, foundBgmIntro, vol);
      this.setData({ trackedBgm: foundBgm, trackedBgmIntro: foundBgmIntro || '', trackedBgmVolume: vol });
    } else {
      stopBgm();
      this.setData({ trackedBgm: '', trackedBgmIntro: '' });
    }

    this.jumpToStoryId(target.id, storyIndex);
  },

  showEncyclopedia() {
    // 强制出示模式下禁止打开图鉴
    if (this.data.forcedInteractiveMode) {
      wx.showToast({ title: "请先完成出示", icon: "none" });
      return;
    }
    if (!this.data.encyData || Object.keys(this.data.encyData).length === 0) {
      this.prepareEncyclopediaData();
    }
    this.setData({
      showEncyclopedia: true,
      presentMode: false,
      presentForced: false,
      encyActiveTab: "evidence",
      encySelectedId: null,
      encySelectedItem: { name: '', desc: '', profileLocal: null, details: null }
    }, () => {
      // 自动选中第一个条目...
      const { encyActiveTab, encyData } = this.data;
      const list = encyData[encyActiveTab] || [];
      if (list.length > 0) this.setSelectedItem(list[0]);
    });
  },
  onMaskTap() {
    if (this.data.presentMode && this.data.presentForced === true) {
      wx.showToast({ title: '请出示相关物品', icon: 'none', duration: 1500 });
      return;
    }
    this.hideEncyclopedia();
  },

  /**
   * 出示面板入口
   * @param {boolean|object} forced - 是否为强制出示（true/false）或事件对象
   */
  showPresentPanel(forced = false) {
    // 如果 forced 是事件对象（例如 tap 事件），则视为普通出示
    if (forced && typeof forced === 'object' && (forced.type === 'tap' || forced.detail !== undefined)) {
      forced = false;
    }
    
    const { current } = this.data;

    // ================== 情况1：强制图片出示
    if (forced && current.presentForcedItemId) {
      if (!this.data.encyData || !this.data.encyData.evidence) {
        wx.showToast({ title: "百科数据加载中", icon: "none" });
        setTimeout(() => this.showPresentPanel(true), 300);
        return;
      }
      const forcedItemId = current.presentForcedItemId;
      const evidenceList = this.data.encyData.evidence;
      const targetItem = evidenceList.find(item => String(item.id) == String(forcedItemId));
      if (!targetItem) {
        wx.showToast({ title: `证物 ID ${forcedItemId} 不存在`, icon: "none" });
        return;
      }
      let imageSrc = targetItem.details || targetItem.profileLocal;
      if (Array.isArray(imageSrc)) imageSrc = imageSrc[0];
      if (!imageSrc) {
        imageSrc = targetItem.details_raw || targetItem.img_raw || targetItem.profile_raw;
        if (Array.isArray(imageSrc)) imageSrc = imageSrc[0];
        console.warn("[强制图片出示] 使用原始URL:", imageSrc);
      }
      if (!imageSrc) {
        wx.showToast({ title: "证物图片缺失", icon: "none" });
        return;
      }
      if (!current.presentRect || !current.presentSuccessId || !current.presentFailId) {
        wx.showToast({ title: "强制出示配置不完整 (缺少 rect/successId/failId)", icon: "none" });
        console.error("强制出示配置缺失", current);
        return;
      }
      this.setData({
        showEncyclopedia: true,
        presentMode: true,
        presentForced: true,
        forcedInteractiveMode: true,
        forcedImageSrc: imageSrc,
        presentForcedItemId: forcedItemId,
        presentForcedRect: current.presentRect,
        presentSuccessId: current.presentSuccessId,
        presentFailId: current.presentFailId,
        forcedSelectedPos: { x: 0.5, y: 0.5 },  // 🔧 默认设为图片中心
        forcedRectStyle: '',
        forcedMarkStyle: '',
        forcedImageMode: 'widthFix',
        forcedImageStyle: ''
      }, () => {
        setTimeout(() => this.updateForcedRectPosition(0, true), 200);
      });
      return;
    }

    // ================== 情况2：强制图鉴出示（无具体证物ID，但仍为强制模式） ==================
    if (forced && !current.presentForcedItemId) {
      const defaultIndex = current.presentDefaultIndex;
      const specialIndexList = current.presentSpecialIndexList;
      const specialIDList = current.presentSpecialIDList;
      if (!defaultIndex || !Array.isArray(specialIndexList) || !Array.isArray(specialIDList)) {
        wx.showToast({ title: "此场景无法出示任何物品", icon: "none" });
        console.error("强制图鉴出示配置缺失", current);
        return;
      }
      if (!this.data.encyData || Object.keys(this.data.encyData).length === 0) {
        this.prepareEncyclopediaData();
      }
      this.setData({
        showEncyclopedia: true,
        presentMode: true,
        presentForced: true,          // 🔒 强制模式：不可关闭，无返回按钮
        forcedInteractiveMode: false,
        presentDefaultIndex: defaultIndex,
        presentSpecialIndexList: specialIndexList,
        presentSpecialIDList: specialIDList,
        encyActiveTab: "evidence"
      }, () => {
        const list = this.data.encyData.evidence || [];
        if (list.length > 0) this.setSelectedItem(list[0]);
      });
      return;
    }

    // ================== 情况3：普通出示（非强制，可关闭） ==================
    const defaultIndex = current.presentDefaultIndex;
    const specialIndexList = current.presentSpecialIndexList;
    const specialIDList = current.presentSpecialIDList;
    if (!defaultIndex || !Array.isArray(specialIndexList) || !Array.isArray(specialIDList)) {
      wx.showToast({ title: "此场景无法出示任何物品", icon: "none" });
      console.error("普通出示配置缺失", current);
      return;
    }
    if (!this.data.encyData || Object.keys(this.data.encyData).length === 0) {
      this.prepareEncyclopediaData();
    }
    this.setData({
      showEncyclopedia: true,
      presentMode: true,
      presentForced: false,           // ✅ 允许关闭，显示返回按钮
      forcedInteractiveMode: false,
      presentDefaultIndex: defaultIndex,
      presentSpecialIndexList: specialIndexList,
      presentSpecialIDList: specialIDList,
      encyActiveTab: "evidence"
    }, () => {
      const list = this.data.encyData.evidence || [];
      if (list.length > 0) this.setSelectedItem(list[0]);
    });
  },
  updateForcedRectPosition(retryCount = 0, force = false) {
    if (!force && this.data.forcedImageRect && this.data.forcedImageRect.width > 0) {
      return; // 已有有效尺寸
    }
    const query = wx.createSelectorQuery().in(this);
    query.select('#forcedImage').boundingClientRect(rect => {
      if (!rect || rect.width === 0 || rect.height === 0) {
        if (retryCount < 10) {
          setTimeout(() => this.updateForcedRectPosition(retryCount + 1, force), 200);
        } else {
          console.error("[强制出示] 无法获取图片尺寸，请检查图片是否渲染");
        }
        return;
      }
      this.setData({ forcedImageRect: rect });

      const { presentForcedRect } = this.data;
      if (presentForcedRect && rect.width > 0) {
        const left = rect.left + presentForcedRect.x * rect.width;
        const top = rect.top + presentForcedRect.y * rect.height;
        const width = presentForcedRect.w * rect.width;
        const height = presentForcedRect.h * rect.height;
        const style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px;`;
        this.setData({ forcedRectStyle: style });
      }

      if (this.data.forcedSelectedPos) {
        this.updateForcedMarkPosition();
      }
    }).exec();
  },

  // 更新标记点位置
  updateForcedMarkPosition() {
    const { forcedSelectedPos, forcedImageRect } = this.data;
    if (!forcedSelectedPos || !forcedImageRect.width) return;
    const left = forcedImageRect.left + forcedSelectedPos.x * forcedImageRect.width;
    const top = forcedImageRect.top + forcedSelectedPos.y * forcedImageRect.height;
    const style = `left: ${left}px; top: ${top}px;`;
    this.setData({ forcedMarkStyle: style });
  },
  // 处理点击
  onForcedImageTap(e) {
    const { x, y } = e.detail;
    this.updateSelectedPosition(x, y);
  },
  onForcedImageLoad(e) {
    const { width: imgWidth, height: imgHeight } = e.detail;
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const screenWidth = windowInfo.windowWidth;
    const screenHeight = windowInfo.windowHeight;

    const imgRatio = imgWidth / imgHeight;
    const screenRatio = screenWidth / screenHeight;

    let mode = 'widthFix';
    let style = '';

    if (imgRatio > screenRatio) {
      mode = 'widthFix';
      style = 'width: 100%;';
    } else {
      mode = 'heightFix';
      style = `height: ${screenHeight}px;`;
    }

    this.setData({ forcedImageMode: mode, forcedImageStyle: style }, () => {
      setTimeout(() => this.updateForcedRectPosition(0, true), 200);
    });
  },

  onForcedImageError(e) {
    console.error("[强制出示] 图片加载失败", this.data.forcedImageSrc);
    wx.showToast({ title: "图片加载失败", icon: "none" });
  },

  // 处理拖拽
  onForcedImageTouchMove(e) {
    const touch = e.touches[0];
    if (touch) this.updateSelectedPosition(touch.clientX, touch.clientY);
  },

  updateSelectedPosition(clientX, clientY) {
    let { forcedImageRect } = this.data;
    if (!forcedImageRect || forcedImageRect.width === 0) {
      // 尝试强制获取一次图片位置
      this.updateForcedRectPosition(0, true);
      forcedImageRect = this.data.forcedImageRect;
      if (!forcedImageRect || forcedImageRect.width === 0) {
        console.warn("[强制出示] 未获取到图片区域，延迟重试");
        setTimeout(() => this.updateSelectedPosition(clientX, clientY), 100);
        return;
      }
    }
    let relativeX = (clientX - forcedImageRect.left) / forcedImageRect.width;
    let relativeY = (clientY - forcedImageRect.top) / forcedImageRect.height;
    relativeX = Math.max(0, Math.min(1, relativeX));
    relativeY = Math.max(0, Math.min(1, relativeY));
    this.setData({ forcedSelectedPos: { x: relativeX, y: relativeY } });
    this.updateForcedMarkPosition();
  },

  presentSubmitForced() {
    const { forcedSelectedPos, presentForcedRect, presentSuccessId, presentFailId, presentForcedItemId } = this.data;
    
    
    if (!forcedSelectedPos) {
      wx.showToast({ title: "请点击图片选择位置", icon: "none" });
      return;
    }
    
    let isInside = false;
    if (forcedSelectedPos && presentForcedRect) {
      const { x, y } = forcedSelectedPos;
      const { x: rx, y: ry, w, h } = presentForcedRect;
      isInside = (x >= rx && x <= rx + w && y >= ry && y <= ry + h);
    }
    
    const targetId = isInside ? presentSuccessId : presentFailId;
    
    if (!targetId) {
      wx.showToast({ title: "跳转配置错误", icon: "none" });
      return;
    }
    
    // 记录历史
    const evidenceList = this.data.encyData.evidence || [];
    const item = evidenceList.find(i => String(i.id) == String(presentForcedItemId));
    const itemName = item?.name || "证物";
    this.recordHistory("【强制出示】", `你出示了“${itemName}”，点击位置${isInside ? "在关键区域" : "在无关区域"}`);
    
    // 关闭浮层并重置状态
    this.setData({
      showEncyclopedia: false,
      presentMode: false,
      presentForced: false,
      forcedInteractiveMode: false,
      forcedSelectedPos: null,
      forcedRectStyle: '',
      forcedMarkStyle: '',
      forcedImageRect: { left: 0, top: 0, width: 0, height: 0 }
    });
    
    this.clearAllTimers();
    this.jumpToStoryId(targetId);
  },

  hideEncyclopedia() {
    // 强制模式（presentForced === true）禁止关闭
    if (this.data.presentMode && this.data.presentForced === true) {
      wx.showToast({ title: '请出示物品继续剧情', icon: 'none', duration: 1500 });
      return;
    }
    // 普通模式或非出示状态直接关闭
    this.setData({
      showEncyclopedia: false,
      presentMode: false,
      presentForced: false,
      presentDefaultIndex: null,
      presentSpecialIndexList: [],
      presentSpecialIDList: [],
      forcedInteractiveMode: false
    });
  },

  switchEncyTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (this.data.presentMode && tab !== 'evidence' && tab !== 'witness' && tab !== 'rule' && tab !== 'record' && tab !== 'map') return;
    const list = this.data.encyData[tab] || [];
    let newSelectedId = null;
    let newSelectedItem = { name: '', desc: '', profileLocal: null, details: null };
    if (list.length > 0) { newSelectedId = list[0].id; newSelectedItem = list[0]; }
    this.setData({ encyActiveTab: tab, encySelectedId: newSelectedId, encySelectedItem: newSelectedItem });
  },

  selectEncyItem(e) {
    const id = e.currentTarget.dataset.id;
    const { encyActiveTab, encyData } = this.data;
    const list = encyData[encyActiveTab] || [];
    const target = list.find(item => item.id == id);
    if (target) this.setSelectedItem(target);
  },

  setSelectedItem(item) {
    if (!item) return;
    const selected = {
      id: item.id, name: item.name || '', desc: item.desc || '',
      profileLocal: item.profileLocal || null,
      details: item.details || null
    };
    this.setData({ encySelectedId: item.id, encySelectedItem: selected });
  },

  onProfileImageTap() {
    const item = this.data.encySelectedItem;
    if (item.desc && item.desc.includes('点击图标查看详情') && item.details) {
      const isImage = typeof item.details === 'string' && !Array.isArray(item.details);
      this.setData({ showDetailPopup: true, detailPages: item.details, detailCurrentPage: 0, detailIsImage: isImage });
    }
  },

  closeDetailPopup() { this.setData({ showDetailPopup: false }); },
  onDetailPrev() { if (this.data.detailCurrentPage > 0) this.setData({ detailCurrentPage: this.data.detailCurrentPage - 1 }); },
  onDetailNext() { if (this.data.detailCurrentPage < this.data.detailPages.length - 1) this.setData({ detailCurrentPage: this.data.detailCurrentPage + 1 }); },

  presentSubmit() {
    const { encySelectedItem, presentDefaultIndex, presentSpecialIndexList, presentSpecialIDList } = this.data;
    if (!encySelectedItem || !encySelectedItem.id) { wx.showToast({ title: "请先选择一个证物或证人", icon: "none" }); return; }
    const itemId = encySelectedItem.id;
    let targetId = presentDefaultIndex;
    for (let i = 0; i < presentSpecialIDList.length; i++) {
      const idList = presentSpecialIDList[i];
      if (Array.isArray(idList) && idList.includes(itemId)) {
        if (presentSpecialIndexList && i < presentSpecialIndexList.length) { targetId = presentSpecialIndexList[i]; break; }
      }
    }
    if (!targetId) { wx.showToast({ title: "出示失败，未知错误", icon: "none" }); return; }
    this.recordHistory("【出示】", `你出示了“${encySelectedItem.name}”`);
    this.setData({ showEncyclopedia: false, presentMode: false, presentForced: false, presentDefaultIndex: null, presentSpecialIndexList: [], presentSpecialIDList: [] });
    this.clearAllTimers();
    this.jumpToStoryId(targetId);
  },

  onMapImageLoad(e) {}, onMapImageError(e) {},

  toggleAuto() {
    const nextStatus = !this.data.autoPlay;
    this.setData({ autoPlay: nextStatus });
    if (!nextStatus) this.clearAutoTimer();
    else if (!this.data.isTyping && !this.data.showChoices && !this.data.current.isEnding) this.scheduleAutoNext();
  },

  scheduleAutoNext() {
    this.clearAutoTimer();
    this.autoTimer = setTimeout(() => {
      if (this.data.autoPlay && !this.data.isTyping && !this.data.showChoices && !this.data.current.isEnding) this.goNext();
    }, 1800);
  },

  onRestart() {
    this.stopDarkFade();
    this.clearAllTimers();
    clearGame();
    stopBgs();
    stopBgm();
    this.stopCurrentVideo();
    this.setData({
      state: { favorability: 0 }, displayText: "", isTyping: false, showChoices: false, autoPlay: false,
      historyList: [], showHistory: false, historyBtnText: "历史", historyScrollIntoView: "", isLoading: false,
      loadProgress: 0, loadText: "正在加载资源...", showHint: false, showEncyclopedia: false,
      encySelectedId: null, encySelectedItem: { name: '', desc: '', profileLocal: null, details: null },
      presentMode: false, presentDefaultIndex: null, presentSpecialIndexList: [], presentSpecialIDList: [],
      darkMaskOpacity: 0, darkMaskTransition: 'transition: opacity 3000ms ease;', characterList: [],
      currentVideoSrc: '', currentVideoPoster: '', currentVideoLoop: true, isVideoReady: false,
      showDetailPopup: false, detailPages: [], detailCurrentPage: 0, detailIsImage: false,
      showSavePoints: false, savePointBtnText: "存档点", savePointScrollIntoView: "",
      showObjection: false, objectionImg: '', objectionAnimClass: ''
    });
    // 还原图鉴数据
    this.encyclopediaData = this.cloneEncyclopedia();
    this.prepareEncyclopediaData();
    this._animationGeneration = 0;
    this._nextCharacterId = 1;
    this.jumpToStoryId('1.1');
  },

  /**
   * 从结局面板读档：恢复到上次存档的位置
   */
  onLoadGame() {
    const savedData = loadGame();
    if (savedData && savedData.currentId) {
      const savedState = savedData.state || { favorability: 0 };
      const savedHistory = savedData.historyList || [];
      this.setData({ state: savedState, historyList: savedHistory });

      // 还原图鉴数据
      this.encyclopediaData = this.cloneEncyclopedia();
      this.prepareEncyclopediaData();

      // 从目标节点向前扫描，找到正确的 BGM（不用存档中的 BGM 记录）
      const targetId = String(savedData.currentId);
      const storyIndex = this.data.storyList.findIndex(item => String(item.id) === targetId);
      let foundBgm = null, foundBgmIntro = null, foundBgmVolume = undefined;
      if (storyIndex >= 0) {
        for (let i = storyIndex; i >= 0; i--) {
          const node = this.data.storyList[i];
          if (node.bgm && node.bgm !== "/stop" && node.bgm !== "!stop") {
            foundBgm = node.bgm;
            foundBgmIntro = node.bgmIntro || null;
            foundBgmVolume = node.bgmVolume;
            break;
          }
          if (node.bgm === "/stop" || node.bgm === "!stop") break;
        }
      }
      if (foundBgm) {
        const vol = foundBgmVolume !== undefined ? foundBgmVolume : 1;
        playBgmWithIntro(foundBgm, foundBgmIntro, vol);
        this.setData({ trackedBgm: foundBgm, trackedBgmIntro: foundBgmIntro || '', trackedBgmVolume: vol });
      } else {
        stopBgm();
        this.setData({ trackedBgm: '', trackedBgmIntro: '' });
      }
      stopBgs();
      this.setData({ trackedBgs: '' });

      this.jumpToStoryId(savedData.currentId);
    } else {
      wx.showToast({ title: '没有存档', icon: 'none' });
    }
  },

  getWindowInfoSafe() {
    if (wx.getWindowInfo) try { return wx.getWindowInfo(); } catch(e) { console.warn(e); }
    // 旧版 fallback
    try { return wx.getSystemInfoSync(); } catch(e) {}
    return { windowWidth: 375, windowHeight: 667 };
  },

  getDeviceInfoSafe() {
    if (wx.getDeviceInfo) try { return wx.getDeviceInfo(); } catch(e) {}
    // 旧版 fallback
    try { return wx.getSystemInfoSync(); } catch(e) {}
    return { platform: 'devtools', model: 'Unknown' };
  },

  checkOrientation(res) {
    const windowInfo = this.getWindowInfoSafe();
    const width = windowInfo.windowWidth, height = windowInfo.windowHeight;
    const orientation = width > height ? "landscape" : "portrait";
    const charHeight = height * this.data.characterHeightRatio;
    const deviceInfo = this.getDeviceInfoSafe();
    this.setData({ orientation, charHeight }, () => this.recalcAllCharacterSizes());
  },

  onResize(res) {
    this.checkOrientation(res);
    // 法庭模式下重新计算背景垂直对齐
    if (this.data.courtMode === 'left' || this.data.courtMode === 'right') {
      const wi = this.getWindowInfoSafe();
      const screenRatio = wi.windowWidth / wi.windowHeight;
      const bgPosY = screenRatio > 16 / 9 ? 'bottom' : 'center';
      this.setData({ bgPositionY: bgPosY });
    }
    if (this.data.forcedInteractiveMode) {
      // 屏幕旋转时重新获取图片实际位置
      setTimeout(() => this.updateForcedRectPosition(0, true), 200);
    }
  },

  clearTypingTimer() { if (this.typingTimer) { clearInterval(this.typingTimer); this.typingTimer = null; } },
  clearAutoTimer() { if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; } },
  clearSkipTimer() { if (this.skipTimer) { clearTimeout(this.skipTimer); this.skipTimer = null; } },
  clearAllTimers() {
    this.clearTypingTimer(); this.clearAutoTimer(); this.clearSkipTimer();
    if (this.presentForcedTimer) { clearTimeout(this.presentForcedTimer); this.presentForcedTimer = null; }
    if (this._darkTimer) { clearTimeout(this._darkTimer); this._darkTimer = null; }
    if (this._resetTransitionTimer) { clearTimeout(this._resetTransitionTimer); this._resetTransitionTimer = null; }
    if (this.videoReadyTimer) { clearTimeout(this.videoReadyTimer); this.videoReadyTimer = null; }
    if (this._characterAnimTimer) { clearTimeout(this._characterAnimTimer); this._characterAnimTimer = null; }
    for (const tid of this._characterRemoveTimers) { clearTimeout(tid); }
    this._characterRemoveTimers = [];
  },

  stopPropagation() { },

  onUnload() {
    this.clearAllTimers();
    this.abortDarkFade();
    if (this.videoContext) {
      this.videoContext.destroy();
      this.videoContext = null;
    }
    destroyAllAudio();

    // 清理强制出示模式
    this.setData({
      forcedInteractiveMode: false
    });
  },

  askQuestion() {
    const { current } = this.data;
    if (!current.judge || !current.ask) { console.warn("追问条件不满足"); return; }
    this.clearAllTimers();
    this.jumpToStoryId(current.ask);
  },

  startDarkFade(type, duration) {
    this.abortDarkFade();
    if (type !== '01' && type !== '10') return;
    const dur = (typeof duration === 'number' && duration > 0) ? duration : 1000;
    if (type === '01') {
      this.setData({ darkMaskTransition: 'transition: none;', darkMaskOpacity: 1 });
      wx.nextTick(() => {
        this.setData({ darkMaskTransition: `transition: opacity ${dur}ms ease;`, darkMaskOpacity: 0 });
        this._darkTimer = setTimeout(() => { this._darkTimer = null; }, dur);
      });
    } else if (type === '10') {
      this.setData({ darkMaskTransition: 'transition: none;', darkMaskOpacity: 0 });
      wx.nextTick(() => {
        this.setData({ darkMaskTransition: `transition: opacity ${dur}ms ease;`, darkMaskOpacity: 1 });
        this._darkTimer = setTimeout(() => { this._darkTimer = null; }, dur);
      });
    }
  },

  abortDarkFade() {
    if (this._darkTimer) { clearTimeout(this._darkTimer); this._darkTimer = null; }
    if (this._resetTransitionTimer) { clearTimeout(this._resetTransitionTimer); this._resetTransitionTimer = null; }
    this.setData({ darkMaskTransition: 'transition: none;', darkMaskOpacity: 0 });
    this._resetTransitionTimer = setTimeout(() => { this.setData({ darkMaskTransition: 'transition: opacity 1000ms ease;' }); this._resetTransitionTimer = null; }, 50);
  },

  stopDarkFade() { this.resetDarkMask(); },
  handleDarkFade(darkValue, duration) { if (darkValue === '01' || darkValue === '10') this.startDarkFade(darkValue, duration); else this.resetDarkMask(); },
  resetDarkMask() { this.abortDarkFade(); },

  onVideoLoaded(e) {
    this.setData({ isVideoReady: true });
    if (this.videoReadyTimer) clearTimeout(this.videoReadyTimer);
    const { autoPlay, current, isTyping, showChoices } = this.data;
    const shouldPlay = autoPlay || (current.skip !== 'click' && !showChoices && !current.isEnding);
    if (shouldPlay) {
      setTimeout(() => {
        if (this.videoContext) this.videoContext.play();
        else { this.videoContext = wx.createVideoContext('bgVideo', this); this.videoContext.play(); }
      }, 100);
    }
  },

  onVideoError(e) {
    console.error('[视频] 加载失败', e);
    this.setData({ isVideoReady: false });
    if (this.videoReadyTimer) clearTimeout(this.videoReadyTimer);
    const { current, isTyping, showChoices } = this.data;
    if (!current.text && !showChoices && !current.isEnding && !isTyping) setTimeout(() => this.goNext(), 500);
    else if (current && current.bg) this.setData({ 'current.bgVideo': null, currentVideoSrc: '' });
  },

  onVideoEnded() {
    const { currentVideoLoop, current, isTyping, showChoices } = this.data;
    if (!currentVideoLoop && !isTyping && !showChoices && !current.isEnding) this.goNext();
  },

  onVideoTap(e) { this.onDialogTap(); },
  preventTap() { return false; }
});