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
1. 基础版：`vpush2.basic.js` （需要配置域名）    
2. 云开发版：`vpush2.cloud.js` （无需配置域名，可支持未配置https的vPush服务）    
3. 黑科技版：开发中啦！

## 3分钟快速集成SDK

第1步：
下载sdk到小程序目录，解压后在`app.js`中引入你需要的核心模块，比如用专业版的基础版SDK：
``` js
const vPush = require('./vpush-pro-sdk/vpush2.cloud.js');

App({
  vPush: new vPush('https://vpush2-one.mssnn.cn'),
  ...
});
```

第2步：
在首页json配置文件中引入组件，比如`pages/index/index.json`：
``` json
{
  "usingComponents": {
    "vpush-checkin": "/vpush-pro-sdk/components/checkin"
  }
}
```

第3步：
在首页wxml文件中加载组件，比如`pages/index/index.wxml`：
``` wxml
<vpush-checkin />
```


刷新小程序，如果出现弹框签到提示，那么就代表集成OK了！ 

## 快速体验
快速体验小程序推送：
![](https://box.kancloud.cn/16e25a0fd4af82e382dd1940c5de4e7c_430x430.png)

官方一键部署平台地址：[https://bigse.cn](https://bigse.cn)

- - -

更多内容，请查阅开发文档，或者关注古人云公众号：    

![](https://mssnn.cn/img/qr_gurenyun.jpg)
