/**
 * vPush/2.0 Basic基础版SDK
 * -------------
 * 独立部署版专用SDK
 * 网址：https://vpush.pro
 * =============
 * https://github.com/guren-cloud/vpush-pro-sdk
 * 更新时间：2019/05/30
 * -------------
 * 使用方法：
 * - app.js中引入此模块文件，然后初始化：App({ vPush: new vPush('你的API服务接口地址'), ..})
 * - 比如：new vPush("https://vpush2-one.mssnn.cn")
 * 其他提示：
 * - 这个SDK需要你配置你的小程序的request域名，为你部署好的API服务器地址。
 */

class vPush {
  constructor(api) {
    if (!api) {
      throw new Error("[vPush.init] 请设置您的API服务接口地址");
    }
    console.log("[*] vPush/2.0 专业、高效、实用的小程序消息推送平台");
    console.log("[+] https://vpush.pro");
    this.HOST = api + '/v1';
    this.STORAGE_KEY = '_VPUSH2_BASIC_OPENID';
    this.OPEN_ID = '';

    this.init();
  }

  // http请求后端
  _request(uri, data) {
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

  // get请求
  _get(uri) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: `${this.HOST}${uri}`,
        success: RES,
        fail: REJ
      })
    })
  }

  /**
   * 初始化
   */
  init() {
    this.initUser().then(openid => {
      console.log('[vpush.init.ok] open_id=', openid);
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
          nickName: userInfo.nickName || "",
          avatarUrl: userInfo.avatarUrl || "",
          gender: userInfo.gender || 0,
          // 系统信息
          system: info.system,
          platform: info.platform,
          version: info.version,
          language: info.language,
          sdk: info.SDKVersion
        }).then(ret => {
          // 如果用户不存在，就刷新
          if (ret.data.errcode === -1) {
            wx.removeStorageSync(this.STORAGE_KEY);
            return this.init();
          }
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
      this._get('/client/push?openid=' + this.OPEN_ID).then(ret => {
        const { data } = ret;
        if (data.errcode !== 0) {
          console.warn('[vpush.isOpenPush.err]', data);
          REJ(data.errmsg);
        }
        console.log('[vpush.isopenPush.ok]', data);
        RES(data.openPush === 1);
      });
    })
  }


  // 兼容社区版SDK
  add(e) {
    return this.addFormId(e);
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
      formId,
      platform: wx.getSystemInfoSync().platform
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

  /**
   * 获取用户的推送凭证统计
   */
  getFormIdCounts(callback) {
    if (!this.OPEN_ID) {
      return setTimeout(() => this.getFormIdCounts(callback), 1000);
    }
    this._get(`/formids/user_counts?openId=${this.OPEN_ID}`).then(ret => {
      callback(ret.data.counts)
    });
  }

  /**
   * 设置用户的tag标签，用于分类推送
   * @param {string} tag 标签名称
   */
  setTag(tag) {
    return this._request("/client/settag?openid=" + this.OPEN_ID, {
      tag
    });
  }
}

module.exports = vPush;