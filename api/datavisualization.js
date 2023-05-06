import Request from '@/common/request/index.js'
// import qs from 'qs'
//测试环境
const baseUrl="https://pajh.jhcaw.gov.cn/test/data-analysis-api/v1/"
//正式环境
// const baseUrl="https://pajh.jhcaw.gov.cn/data-analysis-api/v1/"
let r = new Request({baseURL: baseUrl})

export default {
	// 获取组织数据
	getOrgSummary(query) {
		// let r = new Request({baseURL: baseUrl})
		return r.get('/org_team/org_summary', {
			params: query,
		})
	},
	// 获取成员数据
	getTeamSummary(query) {
		// let r = new Request()
		return r.get('/org_team/team_summary', {
			params: query
		})
	},
	// 获取事件报送情况数据（已办结事件数、报送事件总数、本月报送事件数量、今日报送事件数量）
	getEventSummary(query) {
		// let r = new Request()
		return r.get('/event_summary/event_summary', {
			params: query
		})
	},
	// 获取事件报送分类饼图数据
	getEventTypeSummary(data) {
		let request = new Request({
			baseURL: baseUrl,
			dataType: 'raw',
		})
		return request.post('/event_summary/event_type',
			data
		)
	}

}
