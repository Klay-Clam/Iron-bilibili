//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    baseImageUrl: '',
    qcodeImageUrl: '',
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

    // this.downloadImg()
    this.downloadBaseImage()
      .then(res => {
        return this.downloadQcImage(res)
      })
      .then(res => {
        console.log(res)
        this.drawShareImg(res)
      })
  },

  // 下载文件
  downloadImg: function() {
    Promise.all([wx.cloud.downloadFile({
      fileID: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w-1300428022/timg.jpg',
      success: res => {
        wx.getImageInfo({
          src: res.tempFilePath,
          success: info => {
            console.log(info)
            this.setData({
              baseImageUrl: info.path
            })
          }
        })
      },
      fail: err => reject(err)
    }), wx.cloud.downloadFile({
      fileID: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qcode.jpg',
      success: res => {
        wx.getImageInfo({
          src: res.tempFilePath,
          success: info => {
            // console.log(info)
            this.setData({
              qcodeImageUrl: info.path
            })
          }
        })
      },
      fail: err => console.log(err)
    })]).then(res => {
      console.log(res)
    })
  },

  // download base image
  downloadBaseImage() {
    return new Promise((reslove, reject) => {
      wx.cloud.downloadFile({
        fileID: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w-1300428022/timg.jpg',
        success: res => {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: info => {
              // console.log(info)
              reslove(info.path)
            }
          })
        },
        fail: err => reject(err)
      })
    })
  },

  downloadQcImage(basePath) {
    return new Promise((reslove, reject) => {
      wx.cloud.downloadFile({
        fileID: 'cloud://ironsong-ybo9w.6972-ironsong-ybo9w/qcode.jpg',
        success: res => {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: info => {
              // console.log(info)
              reslove([basePath, info.path])
              // this.setData({
              //   qcodeImageUrl: info.path
              // })
            }
          })
        },
        fail: err => reject(err)
      })
    })
  },

  // 绘制图片
  drawShareImg: function(path) {
    const ctx = wx.createCanvasContext('post-temp', this);
    ctx.setFillStyle('#ffde00')
    ctx.fillRect(0, 0, 355, 550);
    ctx.fill()
    ctx.setFontSize('20')
    ctx.setFillStyle('#de2910')
    ctx.fillText('99A走你脸上了, 还不来看看吗^.^', 30, 380)

    ctx.drawImage(path[0], 30, 30, 300, 300);
    ctx.drawImage(path[1], 250, 450, 80, 80);
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'post-temp',
        fileType: 'png',
        quality: 1,
        success: function(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(res) {
              wx.showToast({
                title: '成功',
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      }, this)
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

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})