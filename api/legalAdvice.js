import Request from '@/common/request/index.js'

export default {
	// 新增咨询
	saveMediateAdvisory(data) {
		let r = new Request()
		return r.post('/mediate-advisory',
			data,
			{custom: { 'publish': true }}
		)
	},
	// 获取咨询填报记录（公众）
	getoWnerList(query) {
		let r = new Request()
		return r.get('/mediate-advisory/owner-list/' + query.openId, {
			params: query,
			custom: { 'publish': true }
		})
	},
	// 查看咨询记录详情（公众）
	viewMediateAdvisory(id) {
		let r = new Request()
		return r.get('/mediate-advisory/' + id, {
			params: { id: id },
			custom: { 'publish': true }
		})
	},
	// 咨询评价
	evaluateMediateAdvisory(data) {
		let r = new Request()
		return r.post('/mediate-advisory/evaluate',
			data,
			{custom: { 'publish': true }}
		)
	},
}
