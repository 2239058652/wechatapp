import Request from '@/common/request/index.js'

export default {
	// 问题隐患报送处理状态
	getTroubleReportStatistics(query) {
		let r = new Request()
		return r.get('/report-statistics/trouble-report', {
			params: query
		})
	},
	// 用户登陆统计报表
	getUserLoginStatistics(query) {
		let r = new Request()
		return r.get('/report-statistics/user-login', {
			params: query
		})
	},
	// 工作类型上报统计报表
	getWorkReportStatistics(query) {
		let r = new Request()
		return r.get('/report-statistics/work-report', {
			params: query
		})
	}
}
