Component({
	data: {
		tagactive: 0,
		list: [
			{
				icon: 'home-o',
				text: '订单',
				url: "/pages/index/index"
			},
			{
				icon: 'search',
				text: '采购',
				url: "/pages/shop/index"
			},
			{
				icon: 'search',
				text: '我的',
				url: "/pages/user/index"
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ tagactive: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				tagactive: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});