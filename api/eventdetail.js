import Request from '@/common/request/index.js'

export default {
	// 获取事件详情
	getEventDetail(eventId) {
		let r = new Request()
		return r.get('/event-report/detail/event-report/' + eventId, {
			params: {
				eventId: eventId
			}
		})
	},
	//获取节点详情
	getEventNodeDetail(nodeId){
		let r = new Request()
		return r.get('/event-report/detail/node/' + nodeId, {
			params: {
				nodeId: nodeId
			}
		})
	},
	// 获取事件处置的时间轴
	getEventTimeline(query) {
		let r = new Request()
		return r.get('/event-report/handle/timeline/' + query.eventId + '/' + query.sort, {
			params: query
		})
	},
	// 获取事件报送相关总数
	getEventReportList(query) {
		let r = new Request()
		return r.get('/dashboard/event/count', {
			params: query
		})
	},
	//防控日报
	getBorderReport(){
		let r = new Request()
		return r.get('/event-report/query/border-report', {
			// params: query
		})
	},
	// 防控日报list
	getBorderReportList(query){
		let r = new Request()
		return r.get('/event-report/query/border-list', {
			params: query
		})
	},
}
