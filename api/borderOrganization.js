import Request from '@/common/request/index.js'

export default {
	// 下属防控户列表
	getBorderOrganizationChild(query) {
		let r = new Request()
		return r.get('/border-org/config/border-organization/area-child', {
			params: query
		})
	}
}
