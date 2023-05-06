import Request from '@/common/request/index.js'

export default {
	// 事件上报
	eventReport(data) {
		let r = new Request()
		return r.post('/event-report/grid', data)
	},
	// 直接办理并结束
	eventReportAndFinish(data) {
		let r = new Request()
		return r.post('/event-report/grid/report-complete', data)
	},
	eventReportAndTransmit(data){
		let r = new Request()
		return r.post('/event-report/grid/report-change-complete', data)
	}
}