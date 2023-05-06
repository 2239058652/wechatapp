import Request from '@/common/request/index.js'
import qs from 'qs'

export default {
	//查询交易记录
	getArrearsList(query) {
		let r = Request()
		return r.get('/arrears', {
			params: query
		})

	},
	// 查询历史交易记录[年+月]
	payArrearsOrder(data) {
		let r = Request()
		return r.post('/arrears/' + data.tradeNo, {
			data: data
		})
	}
}
