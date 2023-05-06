import Request from '@/common/request/index.js'

export default {
	// 意见建议
	saveOpinionSuggestion(data) {
		let r = new Request()
		return r.post('/suggestion-report',
			data, {
				custom: {
					'publish': true
				}
			}
		)
	},
	// 获取意见建议列表
	getOpinionSuggestionList(query) {
		let r = new Request()
		return r.get('/suggestion-report', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取意见建议列表(公众)
	getOpinionSuggestionPublicList(query){
		let r = new Request()
		return r.get('/suggestion-report/open-id/' + query.reportOpenid, {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 获取意见建议详情（公众）
	getOpinionSuggestionDetail(reportId) {
		let r = new Request()
		return r.get('/suggestion-report/' + reportId, {
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
