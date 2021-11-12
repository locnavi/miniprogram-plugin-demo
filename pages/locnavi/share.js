const app = getApp();

const locnavi = requirePlugin('locnavi').locnavi;  // 引入插件

Page({
  data: {
    msg: ''
  },

  onLoad(query){
    locnavi.share(query)
      .then(msg => {
        this.setData({
          msg
        })
      });
  },

  onShareAppMessage(){
    return locnavi.shareMessage;
  }
})