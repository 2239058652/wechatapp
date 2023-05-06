// 事件工作处理相关，非启动状态的接口
import Request from '@/common/request/index.js'

export default {
	//获取待办列表
	getEventToDoList(query) {
		let r = new Request()
		return r.get('/event-report/list/daibanli', {
			params: query
		})
	},
	// 获取领导待审批列表
	getEventLeaderToDoList(query) {
		let r = new Request()
		return r.get('/event-report/list/daishenpi', {
			params: query
		})
	},
	//获取已办列表
	getEventDoneList(query) {
		let r = new Request()
		return r.get('/event-report/list/yiban', {
			params: query
		})
	},
	//获取转交件已办列表
	getTransmitEventDoneList(query) {
		let r = new Request()
		return r.get('/event-report/list/zhuanjiao-jianyiban', {
			params: query
		})
	},
	// 获取收到的催办督办件列表
	getPressEventReceiveList(query) {
		let r = new Request()
		return r.get('/event-report/notify/receive', {
			params: query
		})
	},
	// 获取发出的催办督办件列表
	getPressEventSendList(query) {
		let r = new Request()
		return r.get('/event-report/notify/send', {
			params: query
		})
	},
	// 打开催办督办件提醒
	openPressEvent(remindId) {
		let r = new Request()
		return r.post('/event-report/notify/open/' + remindId)
	},
	// 获取领导审批列表
	getEventLeaderApproveList(query) {
		let r = new Request()
		return r.get('/event-report/list/daishenpi', {
			params: query
		})
	},
	// 打开工作节点
	openEventReportWorkOut(id) {
		let r = new Request()
		return r.post('/event-report/handle/propose/open-node/' + id)
	},
	// 办结
	eventFinish(data) {
		let r = new Request()
		return r.post('/event-report/handle/operation/banjie/', data)
	},
	//办理
	eventDealWith(data) {
		let r = new Request()
		return r.post('/event-report/handle/operation/banli/', data)
	},
	//呈报领导
	eventSubmitLeader(data) {
		let r = new Request()
		return r.post('/event-report/handle/control/chengbao', data)
	},
	// 交办
	eventAssign(data) {
		let r = new Request()
		return r.post('/event-report/handle/control/jiaoban', data)
	},
	// 退件
	eventReturn(data) {
		let r = new Request()
		return r.post('/event-report/handle/operation/tuijian', data)
	},
	//上报
	eventSubmitOrg(data) {
		let r = new Request()
		return r.post('/event-report/handle/control/shangbao', data)
	},
	//转交
	eventTransmit(data) {
		let r = new Request()
		return r.post('/event-report/handle/control/zhuanjiao', data)
	},
	// 催办
	eventPress(data) {
		let r = new Request()
		return r.post('/event-report/notify/cuiban', data)
	}
}
