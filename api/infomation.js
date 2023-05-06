import Request from '@/common/request/index.js'

export default {
	// 获取资讯列表
	getInfomationList(query) {
		let r = new Request()
		return r.get('/news', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取资讯详情
	getInfomationDetail(id) {
		let r = new Request()
		return r.get('/news/' + id, {
			custom: {
				'publish': true
			}
		})
	},
	// 轮播图
	getInfomationCarousel(id) {
		let r = new Request()
		return r.get('/news/carousel', {
			custom: {
				'publish': true
			}
		})
	},
}
