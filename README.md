## vPush SDK Pro

> 高级版本专用    
> https://mssnn.cn    
> 详细文档：http://doc.mssnn.cn

## 示例
小程序代码片段地址：[https://developers.weixin.qq.com/s/905pzCma704O](https://developers.weixin.qq.com/s/905pzCma704O)    
> 提示：经过测试，测试号appId可进行正常操作，但无法接收模板消息。    
> 导入请务必填写正确的AppId，以及修改`app.js`中`new vPush`定义的AppId

## 配置域名
我们为每一个开发者都配置了独立的子域名，你可以直接在浏览器中输入：
[https://你的小程序AppId.mssnn.cn](https://mssnn.cn)    
进入开发控制台（初次访问需要进行简单注册）    

同时，这个地址也是收集推送凭证等后端API服务地址，所以我们前往微信公众号平台，在开发设置里配置request域名为此。

## 配置SDK

### 1. clone本仓库到你的微信小程序目录
``` bash
$ git clone https://github.com/guren-cloud/vpush-pro-sdk
```

### 2. 编辑`app.js`，引入sdk的`vpush.pro.js`文件，并初始化一个全局的`vPush`变量：

``` js
// app.js
var vPush = require('./libs/vpush-pro-sdk/vpush.pro.js');

App({
  vPush: new vPush('小程序的appId'),
  onLaunch: function () {}
  // ...
});
```

> 初始化vPush类，需要传递你当前的微信小程序AppId

### 3. 使用sdk的组件
> 在sdk的`components`里，我们预置了部分组件，让你只需要经过简单的配置使用即可完成自动收集推送凭证流程。

页面json配置：
``` json
{
  "usingComponents": {
    "vpush-view": "/vpush-pro-sdk/components/view"
  }
}
```

页面wxml引入：
``` wxml
  <vpush-view>点击收集凭证</vpush-view>
```

你可以传递`onClickHandler`以绑定页面定义的方法，以及传递`custom-class`自定义组件样式

### 4. 最简单的sdk集成组件
> 我们提供了一些界面组件提供给开发者，让开发者在无需改动原始界面和代码的情况下快速集成使用。

### 4.1 checkin签到组件
在页面中引入组件后，在wxml文件直接嵌入该组件即可。    
这个组件会每天用户打开小程序的时候，弹出一个签到框，用户点击签到按钮即可自动收集凭证。 无需过多开发。

[**更详细的文档，请移至：http://doc.mssnn.cn**](http://doc.mssnn.cn)


## 旧版本迁移
如果你的小程序项目中已经配置过旧版本（目前称之为社区版）的SDK，那么除了重新配置外，还可以通过稍微修改，以达到兼容的目的。

1. 复制新版本`vpush.pro.js`的文件内容；
2. 编辑旧版本`_vpush.js`文件，全选粘贴覆盖旧版本文件内容；
3. 覆盖完毕，在编辑好的`vpush.pro.js`文件底部的`module.exports = vPush;`代码，改成`module.exports = new vPush('你的小程序AppId');`