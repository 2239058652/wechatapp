import Request from '@/common/request/index.js'
// import qs from 'qs'

export default {
	// 群众诉求
	saveMassAppeal(data) {
		let r = new Request()
		return r.post('/appeal-report',
			data, {
				custom: {
					'publish': true
				}
			}
		)
	},
	// 获取群众诉求列表
	getMassAppealList(query) {
		let r = new Request()
		return r.get('/appeal-report', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取群众诉求列表(公众)
	getMassAppealPublicList(query){
		let r = new Request()
		return r.get('/appeal-report/open-id/' + query.reportOpenid, {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取群众诉求详情
	getMassAppealDetail(reportId) {
		let r = new Request()
		return r.get('/appeal-report/' + reportId, {
			params: {
				reportId: reportId
			},
			custom: {
				'publish': true
			}
		})
	}
}
