//index.js
const app = getApp()

Page({
  data: {
    logged: false,
    takeSession: false,
    requestResult: '',
    baseImageUrl: '',
    qcodeImageUrl: '',
    imgList: [{
        key: '原版',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/original.jpg'
      },
      {
        key: '长笛',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/changdi.jpg'
      },
      {
        key: '计算器',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/jisuanqi.jpg'
      },
      {
        key: '古筝',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/guzheng.jpg'
      },
      {
        key: '扬琴',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/yangqin.jpg'
      },
      {
        key: '伦敦火车站即兴演奏',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w-1300428022/qc-list-img/lundun.jpg'
      },
      {
        key: '钢琴改编版',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/gangqin.jpg'
      }, {
        key: '双排键',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/shuangpaijian1.jpg'
      },
      {
        key: '[鬼畜]暂七师',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/zqs.jpg'
      },
      {
        key: '中阮',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/zhongruan.jpg'
      },
      {
        key: '低音铜管',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/tongguan.jpg'
      },
      {
        key: '唢呐',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/suona.jpg'
      },
      {
        key: '双排键',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/spj.jpg'
      },
      {
        key: '手风琴',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/sfq.jpg'
      },
      {
        key: '萨克斯',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/sakesi.jpg'
      },
      {
        key: '手机拨号键盘',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/phone.jpg'
      },
      {
        key: '木吉他',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qc-list-img/jita.jpg'
      },
      {
        key: '[纯人声]阿卡贝拉',
        path: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w-1300428022/qc-list-img/akbl.jpg'
      }

    ]
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // preview
  preview(e) {
    let path = e.currentTarget.dataset.path
    wx.previewImage({
      urls: [path]
    })
  }
})