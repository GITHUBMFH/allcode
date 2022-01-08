// https://blog.csdn.net/qq_28779083/article/details/90510307
/**
 * GET请求封装
 */
function get(url, data = {}) {
    return request(url, data, 'GET')
}

/**
 * POST请求封装
 */
function post(url, data = {}) {
    return request(url, data, 'POST')
}
/**
 * 微信的request
 */

function gettoken() {
    return new Promise(function (resolve) {
        wx.getStorageSync({
            key: 'token',
            success(res) {
                resolve(res.data);
            }
        })
    })

}
const eh = wx.getStorage({
    key: 'token'
})

function request(url, data = {}, method = "GET") {
    var contentType = 'application/json';
    var gettoken = wx.getStorageSync('token');
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': contentType,
                'token': gettoken
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    resolve(res.data);
                } else if (res.statusCode == 401) {
                    //此处验证了token的登录失效，如果不需要，可以去掉。
                    //未登录，跳转登录界面
                    reject("登录已过期")
                    wx.showModal({
                        title: '提示',
                        content: '登录已过期，请立即登录，否则无法正常使用',
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.navigateTo({
                                    url: '/pages/login/login?toPageUrl=401',
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    //请求失败
                    reject("请求失败：" + res.statusCode)
                }
            },
            fail: function (err) {
                //服务器连接异常
                console.log('===============================================================================================')
                console.log('==    接口地址：' + url)
                console.log('==    接口参数：' + JSON.stringify(data))
                console.log('==    请求类型：' + method)
                console.log("==    服务器连接异常")
                console.log('===============================================================================================')
                reject("服务器连接异常，请检查网络再试")
            }
        })
    });
}

module.exports = {
    request,
    get,
    post
}