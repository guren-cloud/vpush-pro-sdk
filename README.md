## vPush SDK Pro

> 高级版本专用    
> https://mssnn.cn

## 配置SDK
首先下载`vpush.pro.js`文件到小程序目录，然后再在`app.js`中引入并设置为全局变量：

``` js
// app.js
var vPush = require('./libs/vpush.pro.js');

App({
  vPush: new vPush('小程序的appId'),
  onLaunch: function () {}
  // ...
});
```

配置完成之后，我们就可以在页面的js文件中引入该变量了：
``` js
// pages/home/index.js
var { vPush } = getApp();

Page({
  // 在这里加上vPush方法提供组件调用
  vPushAdd: vPush.add.bind(vPush),
  data: {},
  onLoad: function (options) {}
})
```
页面增加了`vPushAdd`方法，就可以在组件中调用这个函数以进行存储推送凭证了：

``` wxml
<!-- pages/home/index.wxml -->
<form report-submit bindsubmit='vPushAdd'>
  <button form-type='submit'>点击我添加formId</button>
</form>
```

## 配置域名
> 目前采用的是国内已备案的`*.mssnn.cn`域名

进入微信开发平台，设置域名里，添加如下`request`域名：

```
https://你的小程序AppId.mssnn.cn
```

同样，这个URL地址，也是小程序推送的管理面板后台地址，你可以直接在浏览器中打开并登陆使用。

## 旧版本迁移
如果你的小程序项目中已经配置过旧版本（目前称之为社区版）的SDK，那么除了重新配置外，还可以通过稍微修改，以达到兼容的目的。

1. 复制新版本`vpush.pro.js`的文件内容；
2. 编辑旧版本`_vpush.js`文件，全选粘贴覆盖旧版本文件内容；
3. 覆盖完毕，在编辑好的`vpush.pro.js`文件底部的`module.exports = vPush;`代码，改成`module.exports = new vPush('你的小程序AppId');`