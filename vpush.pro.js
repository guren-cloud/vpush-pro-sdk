/**
 * vPush Pro SDK
 * -------------
 * 高级版本专用SDK
 * 高级版网址：https://mssnn.cn
 * 社区版网址：https://guren.cloud
 * =============
 * https://github.com/guren-cloud/vpush-pro-sdk
 * 更新时间：20190107
 * -------------
 * 使用方法：
 * app.js中引入此模块，然后初始化：App({ vPush: new vPush('你的小程序appId'), ..})
 */

class vPush {
  constructor(appId) {
    if (!appId) {
      throw new Error("[vPush.init] 请传递appId参数");
    }
    this.HOST = `https://${appId}.mssnn.cn/v2`;
    this.STORAGE_KEY = '_VPUSH_PRO_OPENID';
    this.OPEN_ID = '';

    this.init();
  }

  // http请求后端
  _request (uri, data) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: `${this.HOST}${uri}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data,
        success: RES,
        fail: REJ
      })
    });
  }

  /**
   * 初始化
   */
  init() {
    this.initUser().then(openid => {
      console.log('[vpush.init.ok]', openid);
      this.OPEN_ID = openid;
      // 登陆，获取用户头像等信息
      new Promise(RES => {
        wx.getUserInfo({
          success: ret => {
            RES(ret.userInfo);
          },
          fail: err => {
            RES({});
          }
        })
      }).then(userInfo => {
        // 获取当前操作系统等信息
        var info = wx.getSystemInfoSync();
        // 更新用户数据
        this._request('/client/update?openid=' + this.OPEN_ID, {
          // 用户昵称、头像、性别
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender,
          // 系统信息
          system: info.system,
          platform: info.platform,
          version: info.version,
          language: info.language,
          sdk: info.SDKVersion
        }).then(ret => {
          console.log('[vpush.update.ok]', ret);
        });
      });
    }).catch(err => {
      console.log('[vpush.init.err]', err);
    })
  }

  /**
   * 初始化用户
   * 根据code获取openId
   */
  initUser() {
    return new Promise((RES, REJ) => {
      // 如果有缓存，返回
      let cache = wx.getStorageSync(this.STORAGE_KEY);
      if (cache && cache.length > 10) return RES(cache);
      // 没有，就初始化
      wx.login({
        success: res => {
          this._request('/client/init', {
            code: res.code
          }).then(ret => {
            const { data } = ret;
            console.log('[vpush.init.ret]', data);
            if (data.errcode !== 0) {
              return REJ(data.errmsg);
            }
            RES(data.openid);
            // 存储到缓存
            wx.setStorageSync(this.STORAGE_KEY, data.openid);
          }).catch(REJ);
        },
        fail: REJ
      })
    });
  }

  /**
   * 打开推送
   */
  openPush() {
    return this.togglePush();
  }

  /**
   * 关闭推送
   */
  closePush() {
    return this.togglePush(false);
  }

  /**
   * 开/关推送
   */
  togglePush(openPush = true) {
    return new Promise((RES, REJ) => {
      this._request('/client/push?openid=' + this.OPEN_ID, {
        open: openPush ? 1 : 0
      }).then(ret => {
        console.log('[vpush.togglePush.ret]', ret);
        let { data } = ret;
        if (data.errcode === 0) {
          console.log('[vpush.togglePush.ok]', data.message);
          RES();
        } else {
          console.warn('[vpush.togglePush.fail]', data.errmsg);
          REJ(data.errmsg);
        }
      })
    })
  }

  /**
   * 检查是否开启了推送
   */
  isOpenPush() {
    if (!this.OPEN_ID) return console.warn('[vPush.isOpenPush] 尚未初始化完毕');
    return new Promise((RES, REJ) => {
      this._request('/client/push?openid=' + this.OPEN_ID, {})
        .then(ret => {
          console.log('[vpush.isopenpush.ret]', ret);
          const { data } = ret;
          if (data.errcode !== 0) {
            console.warn('[vpush.isOpenPush.err]', data);
            REJ(data.errmsg);
          }
          console.log('[vpush.isopenPush.ok]', data);
          RES(data.openPush === 1);
        })
        .catch(REJ);
    })
  }

  // 兼容社区版SDK
  add(e) {
    return this.addFormId(e);
  }
  setTags() {
    console.warn('[vPush.setTags.warn] 此方法已弃用，请移除');
  }
  setAlias() {
    console.warn('[vPush.setAlias.warn] 此方法已弃用，请移除');
  }
  pushToMe() {
    console.warn('[vPush.pushToMe.warn] 此方法已弃用，请移除');
  }


  /**
   * 添加推送凭证
   */
  addFormId(e, callback) {
    var formId = '';
    if (typeof e === 'object') {
      formId = e.detail.formId;
    } else {
      formId = String(e);
    }
    // 判断formId是否为测试的
    if (formId.startsWith('the formId') || formId.startsWith('[') || formId === 'undefined') {
      callback && callback();
      return console.warn('[vpush] 调试的无效formId：', formId);
    }

    // 获取当前页面地址
    let page = getCurrentPages()[0].route;
    this._request('/client/formid?openid=' + this.OPEN_ID, {
      page,
      formId
    }).then(ret => {
      callback && callback();
      console.log('[vpush.addFormId.ret]', ret);
      const { data } = ret;
      if (data.errcode !== 0) {
        return console.warn('[vpush.addForm.fail]', data.errmsg);
      }
      console.log('[vpush.addFormId.ok]', data.message);
    });
  }
}

module.exports = vPush;