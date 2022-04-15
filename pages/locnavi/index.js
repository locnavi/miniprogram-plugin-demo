const app = getApp()

const locnavi = requirePlugin('locnavi').locnavi;  // 引入插件

locnavi.getUserInfo = () => {
  return Promise.resolve({
    nickName: 'xxx',
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/lYEaCt0HwSzWQzXTJtgRichss37y2UGJnOKB7SZPt4hSIOSFRDHVqHqZrOLq7wqja1RHTl7cRYtbhIpiaIKHLmbA/132',
    id: 'test-openid-shq',
  });
}

locnavi.init({
  path: '/pages/locnavi/index',
  sharePath: '/pages/locnavi/share',
  shareGroupPath: '/pages/locnavi/share-group',
  backPath: '/pages/index/index',
}, {
  
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
