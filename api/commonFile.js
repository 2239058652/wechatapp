import Request from '@/common/request/index.js'

export default {
	// 获取意见建议列表
	getCommonImgList(query) {
		let r = new Request()
		return r.get('/common-file/miniapp-img', {
			params: query,
			custom: {
				'publish': true
			}
		})
	}
}
