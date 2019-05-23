## vPush SDK Pro

> 此SDK包含了高级版、专业版、云开发版、黑科技版等核心模块。    
> 你可以根据自己使用的推送平台，引入对应的模块文件。

## 高级版
> 官网：https://mssnn.cn
> 文档：http://doc.mssnn.cn

对应核心文件：`vpush.pro.js`

## 专业版
> 官网：https://vpush.cloud
> 文档：https://www.kancloud.cn/mssnn_cn/vpush/1068329

对应核心文件：
1. `vpush2.basic.js` 专业基础版
2. 更新中..

## 示例
小程序代码片段地址：[https://developers.weixin.qq.com/s/905pzCma704O](https://developers.weixin.qq.com/s/905pzCma704O)    
> 提示：经过测试，测试号appId可进行正常操作，但无法接收模板消息。    
> 导入请务必填写正确的AppId，以及修改`app.js`中`new vPush`定义的AppId

## 配置域名
高级版对应域名为你的开发者控制台地址：
[https://你的小程序AppId.mssnn.cn](https://mssnn.cn)    

专业版对应域名为你搭建好的API服务地址，比如：
[https://vpush2-one.mssnn.cn](https://vpush2-one.mssnn.cn)

前往微信公众号平台，在开发设置里配置request域名为此。

## 配置SDK

### 1. clone本仓库到你的微信小程序目录
``` bash
$ git clone https://github.com/guren-cloud/vpush-pro-sdk
```

### 2. 编辑`app.js`，引入sdk的模块文件（高级版选择`vpush.pro.js`，专业版选择其他对应的模块），并初始化一个全局的`vPush`变量：

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
> 如果是高级版，请传递你的API域名，如`new vPush('https://vpush2-one.mssnn.cn')`

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
