import Request from '@/common/request/index.js'

export default {
	// 获取个人收文箱
	getDocInListPersonal(query) {
		let r = new Request()
		return r.get('/person-doc-box/receive', {
			params: query
		})
	},
	// 获取个人收文详情
	getDocInDetailPersonal(id) {
		let r = new Request()
		return r.get('/person-doc-box/receive/' + id)
	},
	// 个人收文签收
	signDocPersonal(id) {
		let r = new Request()
		return r.post('/person-doc-box/receive/' + id + '/signed')
	},

	// 获取机构收文箱
	getDocInListOrg(query) {
		let r = new Request()
		return r.get('/org-doc-box/receive', {
			params: query
		})
	},
	// 获取机构收文详情
	getDocInDetailOrg(id) {
		let r = new Request()
		return r.get('/org-doc-box/receive/' + id)
	},
	// 机构收文签收
	signDocOrg(id) {
		let r = new Request()
		return r.post('/org-doc-box/receive/' + id + '/signed')
	},

	// 获取个人发文箱
	getDocSendListPersonal(query) {
		let r = new Request()
		return r.get('/person-doc-box/send', {
			params: query
		})
	},
	// 获取个人发文详情
	getDocSendDetailPersonal(id) {
		let r = new Request()
		return r.get('/person-doc-box/send/' + id)
	},
	// 个人发文
	sendDocPersonal(data) {
		let r = new Request()
		return r.post('/person-doc-box/send', data)
	},
	//个人发文接收情况列表
	getDocReceiveListPersonal(query) {
		let r = new Request()
		return r.get('/person-doc-box/send/' + query.id + '/receives')
	},
	//获取个人发文机构列表
	getDocPersonalSendOrgList(query) {
		let r = new Request()
		return r.get('/person-doc-box/send/org', {
			params: query
		})
	},
	// 获取组织用户
	getUserByOrgId(id) {
		let r = new Request()
		return r.get('/person-doc-box/send/' + id + '/person')
	},
	//根据姓名手机号搜索用户
	getUserByKeyword(query) {
		let r = new Request()
		return r.get('/person-doc-box/send/person', {
			params: query
		})
	},
	//获取机构发件箱
	getDocSendListOrg(query) {
		let r = new Request()
		return r.get('/org-doc-box/send', {
			params: query
		})
	},
	// 获取机构发文详情
	getDocSendDetailOrg(id) {
		let r = new Request()
		return r.get('/org-doc-box/send/' + id)
	},
	// 机构发文
	sendDocOrg(data) {
		let r = new Request()
		return r.post('/org-doc-box/send', data)
	},
	//机构发文接收情况列表
	getDocReceiveListOrg(query) {
		let r = new Request()
		return r.get('/org-doc-box/send/' + query.id + '/receives')
	},
	//获取机构发文的机构列表
	getDocSendOrgList(query) {
		let r = new Request()
		return r.get('/org-doc-box/send/org', {
			params: query
		})
	},
	//获取机构发文的父机构列表
	getDocSendOrgParentList(id) {
		let r = new Request()
		return r.get('/org-doc-box/send/org/parent/' + id, {
			params: id
		})
	},
	// 邮件及公告未读数量提示
	getRemindCount(query) {
		let r = new Request()
		return r.get('/dashboard/remind/count', {
			params: query
		})
	},
}
