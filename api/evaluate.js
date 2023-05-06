import Request from '@/common/request/index.js'

export default {
	// 获取考核详情
	getEvaluateDetail(id) {
		let r = new Request()
		return r.get('/kao-he/' + id)
	},
	//获取考核列表
	getEvaluateList(query) {
		let r = new Request()
		return r.get('/kao-he/personList', {
			params: query
		})
	},
}
