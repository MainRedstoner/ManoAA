// utils/platform.js

let platform = null;

/**
 * 获取当前平台标识
 * 返回值: 'ios', 'android', 'ipad', 'devtools', 'unknown'
 * 使用新的 wx.getDeviceInfo() 替代已废弃的 wx.getSystemInfoSync
 */
function getPlatform() {
  if (platform === null) {
    try {
      // 优先使用新版 API (基础库 2.20.1+)
      if (wx.getDeviceInfo) {
        const deviceInfo = wx.getDeviceInfo();
        platform = deviceInfo.platform;
      } 
      // 降级：仍支持旧版（部分老旧客户端）
      else if (wx.getSystemInfoSync) {
        const systemInfo = wx.getSystemInfoSync();
        platform = systemInfo.platform;
      } 
      else {
        console.warn('无法获取设备信息，使用默认值 unknown');
        platform = 'unknown';
      }
    } catch (e) {
      console.error('获取平台信息失败', e);
      platform = 'unknown';
    }
  }
  return platform;
}

/**
 * 判断是否为 iOS 或 iPadOS
 */
function isIOS() {
  const plat = getPlatform();
  return plat === 'ios' || plat === 'ipad';
  return true;
}

/**
 * 将音频 URL 适配到当前平台
 * - iOS 平台: 将 /ogg/ 替换为 /m4a/，并将 .ogg 扩展名改为 .m4a
 * - 其他平台: 保持原 URL 不变
 */
function adaptAudioUrl(originalUrl) {
  if (!originalUrl || typeof originalUrl !== 'string') return originalUrl;
  if (!isIOS()) return originalUrl;

  // 示例转换规则，请根据实际文件路径调整正则表达式
  let adaptedUrl = originalUrl.replace(/\/ogg\//g, '/m4a/');
  adaptedUrl = adaptedUrl.replace(/\.ogg$/i, '.m4a');
  return adaptedUrl;
}

module.exports = {
  isIOS,
  adaptAudioUrl,
};