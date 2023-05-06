import Request from '@/common/request/index.js'

export default {
	// 新增工作情况上报
	addWorkReport(data) {
		let r = new Request()
		return r.post('/work-report', data)
	},
	getWorkReportList(query) {
		let r = new Request()
		return r.get('/work-report', {
			params: query
		})
	},
	getPublicWorkReportList(query) {
		let r = new Request()
		return r.get('/work-report/public-list', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	//查看工作情况详情
	getWorkReportDetail(id) {
		let r = new Request()
		return r.get('/work-report/' + id)
	},
	//查看工作情况详情(带openId)
	getWorkReportDetailByOpenId(data) {
		let r = new Request()
		return r.get('/work-report/wechart-view/' + data.id + '/' + data.openId,{
			custom: {
				'publish': true
			}
		})
	},
	// 更新工作情况
	updateWorkReport(data) {
		let r = new Request()
		return r.post('/work-report/' + data.id, data)
	},
	// 更新工作情况
	deleteWorkReport(id) {
		let r = new Request()
		return r.delete('/work-report/' + id)
	},
	// 获取各角色工作上报占比
	getWorkReportListOnRoles(query) {
		let r = new Request()
		return r.get('/dashboard/role-work/rate', {
			params: query
		})
	},
}
