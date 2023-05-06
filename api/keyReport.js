import Request from '@/common/request/index.js'
// import qs from 'qs'

export default {
	// 一键举报
	saveKeyReport(data) {
		let r = new Request()
		return r.post('/one-key-report',
			data, {
				custom: {
					'publish': true
				}
			}
		)
	},
	// 获取一键举报列表
	getKeyReportList(query) {
		let r = new Request()
		return r.get('/one-key-report', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取一键举报列表(公众)
	getKeyReportPublicList(query){
		let r = new Request()
		return r.get('/one-key-report/open-id/' + query.reportOpenid, {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取一键举报详情
	getKeyReportDetail(reportId) {
		let r = new Request()
		return r.get('/one-key-report/' + reportId, {
			params: {
				reportId: reportId
			},
			custom: {
				'publish': true
			}
		})
	},
	// 意见建议回复
	appealReportAnswer(data) {
		let r = new Request()
		return r.post('/appeal-report-answer', data)
	}
}
