import Request from '@/common/request/index.js'

export default {
	// 新增点长上报
	addBorderReport(data) {
		let r = new Request()
		return r.post('/border/point-management-daily', data)
	},
	// 获取填报列表
	getBorderReportList(query) {
		let r = new Request()
		return r.get('/border/point-management-daily', {
			params: query
		})
	},
	// 未填报点位及人员列表（乡镇和段长）
	getBorderUnReportList(query) {
		let r = new Request()
		return r.get('/border/point-management-daily/underreporting-point', {
			params: query
		})
	},
	// 获取填报列表根据pointId
	getBorderReportListBypointId(query) {
		let r = new Request()
		return r.get('/border/point-management-daily/point-record', {
			params: query
		})
	},
	//查看填报数据详情
	getBorderReportDetail(id) {
		let r = new Request()
		return r.get('/border/point-management-daily/' + id)
	},
	// 新增点长事件上报
	addBorderEventReport(data) {
		let r = new Request()
		return r.post('/border/point-management-event', data)
	},
	// 获取最近一次填报数据
	getRecentlyReport(pointId) {
		let r = new Request()
		return r.get('/border/point-management-daily/recent-point-record/' + pointId)
	},
	// 获取事件填报列表
	getBorderEventReportList(query) {
		let r = new Request()
		return r.get('/border/point-management-event', {
			params: query
		})
	},
	// 获取事件填报列表根据pointId
	getBorderEventReportListBypointId(query) {
		let r = new Request()
		return r.get('/border/point-management-event/point-record', {
			params: query
		})
	},
	// 获取事件填报记录详情
	getBorderEventReportDetail(reportId) {
		let r = new Request()
		return r.get('/border/point-management-event/' + reportId, {
			params: {
				reportId: reportId
			}
		})
	},
	// 获取点长日报统计列表
	getDailyReportCountList(query) {
		let r = new Request()
		return r.get('/border/point-management-daily/count-list', {
			params: query
		})
	},
	// 获取事件报送统计列表
	getEventReportCountList(query) {
		let r = new Request()
		return r.get('/border/point-management-event/count-list', {
			params: query
		})
	},
	// 获取后勤保障物资类别表单列表
	getLogisticsMaterialTypeList(query) {
		let r = new Request()
		return r.get('/logistics-material-type/form-logistics-material-type', {
			params: query
		})
	},
	// 新增后勤保障物资报送
	addLogisticsMaterialReport(data) {
		let r = new Request()
		return r.post('/logistics-material-report', data)
	},
	// 获取后勤保障物资报送记录列表
	getLogisticsMaterialReportList(query) {
		let r = new Request()
		return r.get('/logistics-material-report', {
			params: query
		})
	},
	// 查看后勤保障物资报送记录
	getMaterialReportDetail(reportId) {
		let r = new Request()
		return r.get('/logistics-material-report/' + reportId, {
			params: {
				reportId: reportId
			}
		})
	},
	// 新增点长巡逻日报
	addPatrolLogReport(data) {
		let r = new Request()
		return r.post('/patrol-log/patrol-log', data)
	},
	// 获取巡逻日报填报列表
	getPatrolLogList(query) {
		let r = new Request()
		return r.get('/patrol-log/patrol-log', {
			params: query
		})
	},
	//查看巡逻日报填报记录数据详情
	getPatrolLogDetail(id) {
		let r = new Request()
		return r.get('/patrol-log/patrol-log/' + id)
	},
	// 新增无人机日报
	addDronePatrolLogReport(data) {
		let r = new Request()
		return r.post('/patrol-log/drone-patrol-log', data)
	},
	// 获取无人机日报填报列表
	getDronePatrolLogList(query) {
		let r = new Request()
		return r.get('/patrol-log/drone-patrol-log', {
			params: query
		})
	},
	//查看无人机日报填报记录数据详情
	getDronePatrolLogDetail(id) {
		let r = new Request()
		return r.get('/patrol-log/drone-patrol-log/' + id)
	},
	// 获取防控机构信息
	getBorderOrganization(orgId) {
		let r = new Request()
		return r.get('/border-org/config/border-organization/' + orgId)
	},
	// 修改本单位的经纬度信息【防控点位、防控段置信息】,目前修改防控点
	fitBorderOrganization(data) {
		let r = new Request()
		return r.post('/border-org/config/border-organization/' + data.orgId, data)
	}
}
