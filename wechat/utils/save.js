// utils/save.js
/**
 * 游戏存档工具
 * 使用微信小程序本地存储保存/读取游戏进度
 */

const SAVE_KEY = 'visual_novel_save';  // 存储键名

/**
 * 保存游戏
 * @param {Object} data - 要保存的游戏数据，通常包含 state 和 currentId 等信息
 */
function saveGame(data) {
  try {
    if (!data) {
      console.warn('saveGame: 没有提供存档数据');
      return false;
    }
    wx.setStorageSync(SAVE_KEY, data);
    console.log('游戏已保存', data);
    return true;
  } catch (err) {
    console.error('保存游戏失败', err);
    return false;
  }
}

/**
 * 读取游戏存档
 * @returns {Object|null} 返回存档数据，如果没有存档则返回 null
 */
function loadGame() {
  try {
    const data = wx.getStorageSync(SAVE_KEY);
    if (data) {
      console.log('读取存档成功', data);
      return data;
    } else {
      console.log('没有找到存档');
      return null;
    }
  } catch (err) {
    console.error('读取存档失败', err);
    return null;
  }
}

/**
 * 清除游戏存档（重新开始游戏时调用）
 */
function clearGame() {
  try {
    wx.removeStorageSync(SAVE_KEY);
    console.log('已清除存档');
    return true;
  } catch (err) {
    console.error('清除存档失败', err);
    return false;
  }
}

module.exports = {
  saveGame,
  loadGame,
  clearGame
};