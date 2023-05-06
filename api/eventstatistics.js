import Request from '@/common/request/index.js'

export default {
	// 统计图表获取事件列表
	fetchEventList(data) {
		let r = new Request()
		return r.get('/statistics/details/'+data.orgId+'/'+data.value)
	},
}