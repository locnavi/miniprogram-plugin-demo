# 内嵌iframe自定义导航首页


用户定制化开发导航首页展示内容，众寻导航将网页用**iframe**嵌入到导航首页中。


<img src='/images/locnavi.png' style='height:360px;max-height:50vh;'>

<br />

嵌入iframe,自定义首页内容

<img src='/images/1.png' style='height:360px;max-height:50vh;'>
<img src='/images/2.png' style='height:360px;max-height:50vh;margin-left:20px;'>


添加方式，跳转小程序时加上参数`custom`，指定小助手的网页地址url，url需做**encodeURIComponent**转码

```
/pages/index?id={mapId}&appKey={key}&custom={url}
```

嵌入iframe页和导航使用postMessage通信，众虎方提供sdk方便用户开发。

插件内调用示例见[pages/index/index.wxml](pages/index/index.wxml)  `iframe嵌入首页demo`，实现导航页面后使用跳转小程序页面的方法


## 开发调试

在浏览器输入<https://m.locnavi.com/?id={id}&custom={url}>，{id}替换为地图id， {url}替换为你开发的url

例如: <https://m.locnavi.com/?id=7WUnoZnkbF&custom=https%3A%2F%2Fm.locnavi.com%2Fcustom-iframe.html>

**注意**: 

- 导航不做用户身份认证，用户认证需要在你的{url}中带入用户身份id/token，在嵌入页面中再获取用户身份信息。

## LocnaviIframeChild 小助手通信SDK

SDK下载地址<https://m.locnavi.com/js/LocnaviIframeChild.umd.js>

嵌入页面demo <https://m.locnavi.com/custom-iframe.html>，可以参考页面源码。

```typescript
// 创建实例
const lic = new LocnaviIframeChild();
lic.debug = true; // debug设为true，在console可以看到父级postMessage传递的数据
```

显示/隐藏事件

```typescript

// iframe显示时出发onShow方法
lic.onShow = () => {
  console.log('iframe showed');
}

// iframe隐藏时出发onHide方法
lic.onHide = () => {
  console.log('iframe hided');
}
```

常用方法如下，下方代码的`lic`特指SDK的实例。

#### ping

```typescript
ping: () => Promise<'pong'>
```

使用ping方法测试父级窗口能否正常响应，调用成功返回`pong`字符串


```typescript
lic.ping()
  .then(d => {
    console.log(d); // "pong"
  });
```

#### 获取当前位置

```typescript
getCurrentLocation: () => Promise<{
  floor: string; // 楼层
  floorDesc: string; // 楼层名
  isInThisMap: boolean; // 是否在地图内
  lon: number; // 经度
  lat: number; // 纬度
}>
```

例如：
```typescript
lic.getCurrentLocation()
  .then(location => {
    console.log(location)
  })
  .catch(err => {
    console.error(err);
  })
```

#### 获取附近的区域

定位成功后，获取定位点附近的区域

```typescript
getAroundRegions: (range?: number, limit?: number) => Promise<Array<{
  distance: number; // 定位点到区域的距离
  floor: string; // 楼层
  uuid: string; // 区域uuid
  name: string; // 区域名称
  lon: number; // 经度
  lat: number; // 纬度
}>>
```

- range: 范围，单位米，默认值为10，获取距离在range米内的区域
- limit: 限制返回的个数，默认值为6

示例:

```typescript
// 获取定位点10米范围内，距离最近的10个区域
lic.getAroundRegions(10, 10)
  .then(regions => {
    console.log('regins', regions)
  })
  .catch(err => {
    console.error(err);
  })
```

#### 导航到POI

```typescript
naviToPOI: (id: string, info?: Record<string, any>) => Promise<undefined>
```

- id: POI id，HIS系统id，需导航方现场工程师关联到导航的POI
- info: POI的额外信息

导航到POI，调用成功后则显示路径规划页面，无返回值；调用失败，返回错误信息

```typescript
lic.naviToPOI('id_xxx', {test: 'xxxx'})
  .catch(err => {
    console.error(err);
  })
```

#### 跳转到小程序的其他页面

```typescript
navigateTo: (url: string) => Promise<Object>;
```
- url: url和[wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)官方文档的url相同

示例:

```typescript 
lic.navigateTo('/pages/page1')
  .then(res => {
    console.log('success', res);
  })
  .catch(err => {
    console.error('error', err);
  })
```

#### 返回到上个小程序页面

```typescript
navigateBack: (delta: number) => Promise<Object>;
```

- delta: 返回的层级，与[wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html)官方文档delta相同，默认值为1

示例：

```typescript
lic.navigateBack()
  .catch(err => {
    console.error('navigateBack: ', err);
  })
```

#### 切换楼层

```typescript
displayFloor: (floor: string) => Promise<void>
```

切换地图显示的楼层

#### 在地图上添加POI标记

```typescript
showPOIs: (pois: Array<{
  poi: string; // poi id
  html: string; // 自定义html文本
}>) => Promise<Array<{
  name: string;
  id: string;
  lon: string; // 经度
  lat: number; // 维度
  floor: string; // 楼层
  coordSystem: 'gcj02'; // 坐标系
}>>
```

返回值为在地图上成功绘制图标的POI位置数据

示例:

```typescript
lic.showPOIs([
  {
    poi: 'id_xxxx',
    html: `<div style='background-color:#A5292A;color:#fff;padding: 4px 8px;border-radius: 4px;'>病理科</div>`
  }
]).then(pois => {
  console.log('draw pois: ', pois);
}).catch(err => {
  console.error('draw pois: ', err);
});
```

#### 清空地图上的POI标记

`showPOIs`方法传入空数组即可清除之前添加的POI

示例:
```typescript
lic.showPOIs([]);
```



