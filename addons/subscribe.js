// 订阅消息扩展插件

class Subscribe {
  constructor(opts, openId, request) {
    const tmplIds = Array.isArray(opts) ? opts : opts['tmplIds'];
    wx.requestSubscribeMessage({
      tmplIds,
      success: e => {
        // 成功的订阅消息列表
        const oks = [];
        tmplIds.map(id => {
          if (e[id] === 'accept') {
            oks.push(id)
          }
        });
        // 回传给服务器
        if (oks.length > 0) {
          request('/subscribe/add_tmplIds', {
            openId,
            tmplIds: oks
          });
        }
        // 回调
        opts['success'] && opts['success'](oks);
      },
      fail: opts['fail'],
      complete: opts['complete']
    });
  }
}

module.exports = Subscribe;