import Request from '@/common/request/index.js'

export default {
	// 新增重点数据上报
	addKeyDataReport(data) {
		let r = new Request()
		return r.post('/key-data-report', data)
	},
	// 获取下级上报的重点数据列表（非网格员）
	getKeyDataReportList(query) {
		let r = new Request()
		return r.get('/key-data-report/keyDataSummaryList', {
			params: query
		})
	},
	// 检查网格员当月是否已填报
	getKeyDataReportCheck(query) {
		let r = new Request()
		return r.get('/key-data-report/check', {
			params: query
		})
	},
	// 获取重点数据列表（网格员及非网格员）
	getKeyDataReportGridList(query) {
		let r = new Request()
		return r.get('/key-data-report', {
			params: query
		})
	},
	//查看重点数据详情
	getKeyDataReportDetail(id) {
		let r = new Request()
		return r.get('/key-data-report/' + id)
	},
	// 更新重点数据
	updateKeyDataReport(data) {
		let r = new Request()
		return r.post('/key-data-report/' + data.id, data)
	},
	// 更新重点数据
	deleteKeyDataReport(id) {
		let r = new Request()
		return r.delete('/key-data-report/' + id)
	},
	// 检查网格当月是否已填报
	checkKeyDataReport(month) {
		let r = new Request()
		return r.get('key-data-report/check/' + month)
	},
	// 汇总数据
	summarizeData(data) {
		let r = new Request()
		return r.post('/key-data-report/summary', data)
	},


}
