import Request from '@/common/request/index.js'

export default {
	// 新增户长日报
	addHouseholderReport(data) {
		let r = new Request()
		return r.post('/border/area-daily', data)
	},
	// 获取户长个人日报列表
	getHouseholderOwnerReport(query) {
		let r = new Request()
		return r.get('/border/area-daily/owner-record', {
			params: query
		})
	},
	//查看填报数据详情
	viewHouseholderReportDetail(id) {
		let r = new Request()
		return r.get('/border/area-daily/' + id)
	},
	// 获取最近一次户长日报填报数据
	getRecentlyHouseholderReport(houseId) {
		let r = new Request()
		return r.get('/border/area-daily/recent-house-record/' + houseId)
	},
	
	// 新增户长案件上报
	addBorderAreaEvent(data) {
		let r = new Request()
		return r.post('/border/area-event', data)
	},
	// 获取户长案件上报列表
	getBorderAreaEventReportList(query) {
		let r = new Request()
		return r.get('/border/area-event/owner-record', {
			params: query
		})
	},
	// 查看户长案件上报详情
	viewBorderAreaEventReportDetail(reportId) {
		let r = new Request()
		return r.get('/border/area-event/' + reportId, {
			params: {
				reportId: reportId
			}
		})
	},
	
	// 新增村民动态监测上报
	addBorderAreaMonitor(data) {
		let r = new Request()
		return r.post('/border/area-monitor', data)
	},
	// 获取村民动态监测上报列表
	getBorderAreaMonitorReportList(query) {
		let r = new Request()
		return r.get('/border/area-monitor/owner-record', {
			params: query
		})
	},
	// 查看村民动态监测上报详情
	viewBorderAreaMonitorReportDetail(reportId) {
		let r = new Request()
		return r.get('/border/area-monitor/' + reportId, {
			params: {
				reportId: reportId
			}
		})
	},
	
	// 新增爱国卫生检查
	addBorderAreaSanitation(data) {
		let r = new Request()
		return r.post('/border/area-sanitation', data)
	},
	// 获取爱国卫生列表
	getBorderSanitationReportList(query) {
		let r = new Request()
		return r.get('/border/area-sanitation/owner-record', {
			params: query
		})
	},
	// 查看爱国卫生
	viewBorderSanitationReportDetail(reportId) {
		let r = new Request()
		return r.get('/border/area-sanitation/' + reportId, {
			params: {
				reportId: reportId
			}
		})
	},
	// 获取四级片长汇总数据：用于填报三级片长日报
	getLevelThreeAreaLeaderReport() {
		let r = new Request()
		return r.get('/border/height-level-area-report')
	},
	// 保存三级片长汇总数据
	saveLevelThreeAreaLeaderReport(data) {
		let r = new Request()
		return r.post('/border/height-level-area-report', data)
	},
	//查看三级片长填报数据详情
	viewLevelThreeAreaLeaderReportDetail(id) {
		let r = new Request()
		return r.get('/border/height-level-area-report/' + id)
	},
	// 三级片长本人报送数据
	getLevelThreeAreaLeaderReportOwnerList(query) {
		let r = new Request()
		return r.get('/border/height-level-area-report/owner-list', {
			params: query
		})
	},
	// 获取四级户长汇总数据：用于填报四级户长日报
	getLevelFourAreaLeaderReport() {
		let r = new Request()
		return r.get('/border/area-leader-report')
	},
	// 保存四级户长汇总数据
	saveLevelFourAreaLeaderReport(data) {
		let r = new Request()
		return r.post('/border/area-leader-report', data)
	},
	//查看填报数据详情
	viewLevelFourAreaLeaderReportDetail(id) {
		let r = new Request()
		return r.get('/border/area-leader-report/' + id)
	},
	// 四级片长本人报送数据
	getLevelFourAreaLeaderReportOwnerList(query) {
		let r = new Request()
		return r.get('/border/area-leader-report/owner-list', {
			params: query
		})
	},
	// 所辖片区案件类别汇总
	getLevelAreaLeaderEventReportSummary(query) {
		let r = new Request()
		return r.get('/border/area-leader-report/area-event-summary', {
			params: query
		})
	},
	// 所辖片汇总日报，查看每日工作情况
	getLevelAreaLeaderDailyReportSummary(query) {
		let r = new Request()
		return r.get('/border/area-leader-report/area-report', {
			params: query
		})
	},
	// 三级片长查看四级片长日报列表
	getAreaLeaderReportList(query) {
		let r = new Request()
		return r.get('/border/height-level-area-report/area-leader-report-list', {
			params: query
		})
	},
	// 一级、二级片长 获取三级户长汇总数据
	getHeightLevel(query) {
		let r = new Request()
		return r.get('/border/height-level-area-report/height-level', {
			params: query
		})
	},
	// 所辖片区案件类别汇总
	getAreaEventSummary(query) {
		let r = new Request()
		return r.get('/border/height-level-area-report/area-event-summary', {
			params: query
		})
	}
}
