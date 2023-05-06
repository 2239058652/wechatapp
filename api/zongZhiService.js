import Request from '@/common/request/index.js'

export default {
	// 获取服务类型树
	getSituationLeafTree(query) {
		let r = new Request()
		return r.get('/zzfw-query/type-tree', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 综治服务登记:小程序(公众)
	registzzfw(data) {
		let r = new Request()
		return r.post('/zzfw-regist/wechat-regist',
			data,
			{custom: { 'publish': true }}
		)
	},
	
	// 获取申请列表(公众)
	getzzfwList(query){
		let r = new Request()
		return r.get('/zzfw-regist/user-list', {
			params: query,
			custom: { 'publish': true }
		})
	},
	// 查看申报记录详情（公众）
	viewzzfwDetail(registId) {
		let r = new Request()
		return r.get('/zzfw-regist/' + registId, {
			params: { registId: registId },
			custom: { 'publish': true }
		})
	},

	// 查看处理记录
	getRecordHistoryList(registId) {
		let r = new Request()
		return r.get('/zzfw-query/history/' + registId, {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	// 查看处理记录详情
	getRecordHistoryType(query){
		let r = new Request()
		return r.get('/mediate-query/history-type', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 服务评价
	zzfwRegist(data) {
		let r = new Request()
		return r.post('/zzfw-regist/evaluate',
			data,
			{custom: { 'publish': true }}
		)
	},
	// 查看服务评价记录
	viewzzfwRegist(registId) {
		let r = new Request()
		return r.get('/zzfw-regist/evaluate/' + registId, {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	// 查看证据材料记录
	getzzfwFileList(registId) {
		let r = new Request()
		return r.get('/zzfw-handle/evidence-record-file/' + registId, {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	// 查看回复录
	viewzzfwReply(registId) {
		let r = new Request()
		return r.get('/zzfw-handle/reply-record/' + registId, {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	// 微信关联
	linkzzfwOnWechat(data) {
		let r = new Request()
		return r.post('/zzfw-regist/link-wechat',
			data,
			{custom: { 'publish': true }}
		)
	}
}
