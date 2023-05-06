// 事件处理API
import Request from '@/common/request/index.js'

export default {
	//修改事件
	fixEventReport(data) {
		let r = new Request()
		return r.post('/event-report/handle/propose/fix/' + data.id, data)
	},
	// 打开待分流事件
	openEventReportSplit(data) {
		let r = new Request()
		return r.post('/event-report/handle/propose/open-event/' + data.id, data)
	},
	//获取带分流列表
	getEventSplitList(query) {
		// console.log('---apitoken---',uni.getStorageSync('token'))
		let r = new Request()
		return r.get('/event-report/list/daifengliu', {
			params: query
		})
	},
	// 打开待工作节点
	openEventReportWork(data) {
		let r = new Request()
		return r.post('/event-report/handle/propose/open-node/' + data.id, data)
	},
	//启动并办结
	eventStartAndFinish(data) {
		let r = new Request()
		return r.post('/event-report/handle/task/start/banjie', data)
	},
	//启动并办理
	eventStartAndHandle(data) {
		let r = new Request()
		return r.post('/event-report/handle/task/start/banli', data)
	},
	//启动并呈报
	eventStartAndSubmit(data) {
		let r = new Request()
		return r.post('/event-report/handle/task/start/chengbao', data)
	},
	// 启动并交办
	eventStartAndAssign(data) {
		let r = new Request()
		return r.post('/event-report/handle/task/start/jiaoban', data)
	},
	//启动并上报
	eventStartAndSubmitOrg(data) {
		let r = new Request()
		return r.post('/event-report/handle/task/start/shangbao', data)
	},
	//启动并转交
	eventStartAndTransmitOrg(data) {
		let r = new Request()
		return r.post('/event-report/handle/task/start/zhuanjiao', data)
	},
	//读取领导列表
	getTargetLeader(query) {
		let r = new Request()
		return r.get('/event-report/handle/target/current-org-leader', {
			params: query
		})
	},
	//读取交办机构、协办机构
	getTargetOrgList(query) {
		let r = new Request()
		return r.get('/event-report/handle/target/jiaoxieban-jg', {
			params: query
		})
	},
	//读取上报机构
	getSubmitOrgList(query) {
		let r = new Request()
		return r.get('/event-report/handle/target/shangbao-jg', {
			params: query
		})
	},
	// 读取转交机构
	getTransmitOrgList(query) {
		let r = new Request()
		return r.get('/event-report/handle/target/zhuanjiao-jg', {
			params: query
		})
	}
}
