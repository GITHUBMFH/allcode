//测试地址
const ApiRootUrl = 'https://zc.yasfurniture.cn/';

module.exports = {
    imgulr:ApiRootUrl+'storage/',
    IndexOrder: ApiRootUrl + 'order/itemlst', //获取列表
    login: ApiRootUrl + 'people/login', //登录
    msg: ApiRootUrl + 'shop/getmsg', //发送微信通知短信
    getordercount: ApiRootUrl + 'order/getordercount', //获取生产列表
    product: ApiRootUrl + 'product/lst', //获取订单产品列表
    producttitle: ApiRootUrl + 'order/getproducttitle', //获取订单标题
    shoplst: ApiRootUrl + 'shop/lst', //获取采购列表
    getshopcount: ApiRootUrl + 'shop/getshopcount', //获取采购必要数量
    shopimg: ApiRootUrl + 'shop/shopimg', //上传图片
    passshop: ApiRootUrl + 'shop/passshop', //获取采购必要数量
    getshop:ApiRootUrl + 'shop/getshop', //修改采购单
    getallorder: ApiRootUrl + 'order/getallorder', //获取所有的订单
    shopsave: ApiRootUrl + 'shop/save', //修改采购单
    deloneimg: ApiRootUrl + 'shop/deloneimg', //删除图片
    getuser: ApiRootUrl + 'people/getuser', //获取用户信息
    peopelsave: ApiRootUrl + 'people/save', //修改用户数据
    expensesave: ApiRootUrl + 'expense/save', //修改报销单数据
    shopdel: ApiRootUrl + 'shop/delete', //删除采购单
    peoplelst: ApiRootUrl + 'people/lst', //人员列表
    getexpensecount: ApiRootUrl + 'shop/getexpensecount', //未报销总数
    expenselst: ApiRootUrl + 'expense/lst', //报销列表
    supplierlst: ApiRootUrl + 'supplier/lst', //供应商列表
    suppliersave: ApiRootUrl + 'supplier/save', //供应商列表
}