import Request from '@/common/request/index.js'

export default {
	// 获取防控日报详情
	fetchdailydetails(query) {
		let r = new Request(query)
		return r.get('/border/point-management-daily/today-daily',
	{params: query})
	}
}
