/**
 * vPush/2.0 Cloud云开发版SDK
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
 * - 这个SDK不需要你配置域名，适用于没开启HTTPS访问的vPush服务器。不过需要你开通小程序云开发
 */

const vPushBasic = require('./vpush2.basic.js');

class vPush extends vPushBasic {
  constructor(api) {
    // 引入v-request
    if (!wx.vrequest) {
      require('./v-request.js');
    }
    super(api);
    this.STORAGE_KEY = '_VPUSH2_CLOUD_OPENID';
  }

  // http请求后端
  _request(uri, data) {
    console.log('[vpush._request]', uri, data);
    // 解析data
    let _data = "";
    if (typeof data === 'object') {
      for (let i in data) {
        _data += i;
        _data += "=";
        _data += encodeURIComponent(data[i]);
        _data += "&";
      }
    } else {
      _data = data;
    }
    return new Promise((RES, REJ) => {
      wx.vrequest({
        url: `${this.HOST}${uri}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: _data,
        success: ret => {
          console.log('res.ret=', ret);
          ret.data = JSON.parse(ret.data);
          RES(ret);
        },
        fail: REJ
      })
    });
  }

  // get请求
  _get(uri) {
    return new Promise((RES, REJ) => {
      wx.vrequest({
        url: `${this.HOST}${uri}`,
        success: res => {
          if (typeof res.data === 'string') {
            res.data = JSON.parse(res.data);
          }
          RES(res);
        },
        fail: REJ
      })
    })
  }
}

module.exports = vPush;