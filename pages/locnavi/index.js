const app = getApp()

const locnavi = requirePlugin('locnavi').locnavi;  // 引入插件

locnavi.init({
  path: '/pages/locnavi/index',
  sharePath: '/pages/locnavi/share',
  home: 'https://mo.locnavi.com',
});

Page({
  data: {
    url: ''
  },
  onLoad(query){
    locnavi.bindWebview({
      ...query
    }, url => {
      this.setData({
        url
      })
    })
  }
});
