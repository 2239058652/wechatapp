import Request from '@/common/request/index.js'

export default {
	// 收到的通知
	// 收到的通知列表
	getNoticeReceiveList(query) {
		let r = new Request()
		return r.get('/notify/receive', {
			params: query
		})
	},
	// 获取收到的通知详情
	getNoticeReceiveDetail(id) {
		let r = new Request()
		return r.get('/notify/receive/' + id)
	},
	// 收件箱待查阅数量
	getNoticeReceiveUnopened(query) {
		let r = new Request()
		return r.post('/notify/receive/unopened')
	},
	// 打开收到的通知
	openNotice(id) {
		let r = new Request()
		return r.post('notify/receive/' + id + '/opened')
	},
	//收到的通知 End

	// 发出的通知
	getNoticeSendList(query) {
		let r = new Request()
		return r.get('/notify/send', {
			params: query
		})
	},
	// 获取发出的通知详情
	getNoticeSendDetail(id) {
		let r = new Request()
		return r.get('/notify/send/' + id)
	},
	// 查询打开情况
	getNoticeOpenedList(query) {
		let r = new Request()
		return r.get('/notify/send/' + query.id + '/receives', {
			params: query
		})
	},
	// 查询发通知的机构列表
	getNoticeOrgList(query) {
		let r = new Request()
		return r.get('/notify/send/org', {
			params: query
		})
	},
	// 查询发通知的机构列表父机构
	getNoticeOrgListParent(query) {
		let r = new Request()
		return r.get('/notify/send/org/parent/' + query.id, {
			params: query
		})
	},
	sendNotice(data) {
		let r = new Request()
		return r.post('/notify/send', data)
	}
	//发出的通知 End
}
