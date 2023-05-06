import Request from '@/common/request/index.js'
// 段长日报数据
export default {
	// 获取段长日报总数据
	fetchTotalData(query) {
		let r = new Request()
		return r.get('/line/level-three-report',{
			params: query
		})
	},
	// 提交数据三级段长
	saveDate(data) {
		let r = new Request()
		return r.post('/line/level-tree-report', data)
	},
	// 获取填报详情
	fetchDetail(query){
		let r = new Request()
		return r.get('/line/level-three-report-user',{
			params: query
		})
	},
	// 日常工作汇总
	fetchdailyTotal(query){
		let r = new Request()
		return r.get('/line/daily-sum',{
			params: query
		})
	},
	// 案件汇总
	fetchEventTotal(query){
		let r = new Request()
		return r.get('/line/event-sum',{
			params: query
		})
	}
}