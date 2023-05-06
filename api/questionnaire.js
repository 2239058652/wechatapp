import Request from '@/common/request/index.js'
// import qs from 'qs'

export default {
	// 获取已发布问卷
	getQuestionnaireList(query) {
		let r = new Request()
		return r.get('/survey/publishedList', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	getQuestionnaireDetail(id) {
		let r = new Request()
		return r.get('/survey/' + id, {
			params: id,
			custom: {
				'publish': true
			}
		})
	},
	// 批量保存问卷回答
	saveAnswer(data) {
		let r = new Request()
		return r.post('/survey/answer',
			data, {
				custom: {
					'publish': true
				}
			}
		)
	},
	// 判断是否作过问卷
	isAnswered(data) {
		let r = new Request()
		return r.put('/survey/' + data.questionnaireId + '/' + data.openid,
			data, {
				custom: {
					'publish': true
				}
			}
		)
	},

}
