import Request from '@/common/request/index.js'

export default {
	// 保存自然人信息(公众)
	addPartiesPeopel(data) {
		let r = new Request()
		return r.post('/mediate-regist/parties_peopel',
			data,
			{custom: { 'publish': true }}
		)
	},
	// 保存法人和非法人组织人信息(公众)
	addPartiesOrg(data) {
		let r = new Request()
		return r.post('/mediate-regist/parties_org',
			data,
			{custom: { 'publish': true }}
		)
	},
	// 纠纷调处登记 x小程序(公众)
	saveMediateRegist(data) {
		let r = new Request()
		return r.post('/mediate-regist/wechat-regist',
			data,
			{custom: { 'publish': true }}
		)
	},
	// 取消纠纷调处登记 x小程序(公众)
	cancelPartiesPeopel(data) {
		let r = new Request()
		return r.post('/mediate-regist/cancel',
			data, {
			params: data,
			custom: {
				'publish': true
			}
		})
	},
	// 获取申请列表(公众)
	getMediateRegistList(query){
		let r = new Request()
		return r.get('/mediate-regist/user-list', {
			params: query,
			custom: { 'publish': true }
		})
	},
	// 查看申报记录详情（公众）
	viewMediateRegistDetail(registId) {
		let r = new Request()
		return r.get('/mediate-regist/' + registId, {
			params: { registId: registId },
			custom: { 'publish': true }
		})
	},
	// 纠纷调处登记暂存(用户)
	tempSaveMediateRegistWorker(data) {
		let r = new Request()
		return r.post('/mediate-regist/temporary-save', data )
	},
	// 纠纷调处登记(用户)
	saveMediateRegistWorker(data) {
		let r = new Request()
		return r.post('/mediate-regist', data)
	},
	// 获取申请列表
	getMediateRegistListWorker(query){
		let r = new Request()
		return r.get('/mediate-regist', {
			params: query
		})
	},
	// 待受理列表
	getMediateRegistAcceptList(query){
		let r = new Request()
		return r.get('/mediate-query/accept-list', {
			params: query
		})
	},
	// 纠纷受理
	acceptMediateDeal(data) {
		let r = new Request()
		return r.post('/mediate-deal/accept', data)
	},
	// 纠纷拒绝受理
	refuseMediateDeal(data) {
		let r = new Request()
		return r.post('/mediate-deal/refuse', data)
	},
	// 待流转列表
	getMediateRegistTransferList(query){
		let r = new Request()
		return r.get('/mediate-query/transfer-list', {
			params: query
		})
	},
	//读取交办机构、协办机构
	getTargetOrgList(query) {
		let r = new Request()
		return r.get('/mediate-deal/transfer-org', {
			params: query
		})
	},
	// 纠纷流转
	transferMediateDeal(data) {
		let r = new Request()
		return r.post('/mediate-deal/transfer', data)
	},
	// 待办理列表
	getMediateList(query){
		let r = new Request()
		return r.get('/mediate-query/mediate-list', {
			params: query
		})
	},
	// 添加证据材料记录
	addEvidenceRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/evidence-record', data)
	},
	// 添加调解记录
	addMediateRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/mediate-record', data)
	},
	// 添加调查记录
	addSurveyRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/survey-record', data)
	},
	// 添加调解协议书记录(成功)
	addAgreementRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/agreement-record', data)
	},
	// 添加调解协议书记录(失败)
	addAgreementFailRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/agreement-fail', data)
	},
	// 纠纷列表（总）使用状态过滤
	getMediateListTotal(query){
		let r = new Request()
		return r.get('/mediate-regist', {
			params: query
		})
	},
	// 添加司法确认记录
	addConfirmRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/confirm-record', data)
	},
	// 添加回访记录
	addReviewRecord(data) {
		let r = new Request()
		return r.post('/mediate-mediate/review-record', data)
	},
	// 查看处理记录
	getRecordHistoryList(registId) {
		let r = new Request()
		return r.get('/mediate-query/history/' + registId, {
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
	// 纠纷催办、督办
	addMediateDealUrge(data) {
		let r = new Request()
		return r.post('/mediate-deal/urge', data)
	},
	// 被督办办列表
	getMediateUnderUrgeHistoryList(query){
		let r = new Request()
		return r.get('/mediate-deal/under-urge-history', {
			params: query
		})
	},
	// 服务评价
	evaluateMediateRegist(data) {
		let r = new Request()
		return r.post('/mediate-regist/evaluate',
			data,
			{custom: { 'publish': true }}
		)
	},
	// 查看服务评价记录
	viewEvaluateMediateRegist(registId) {
		let r = new Request()
		return r.get('/mediate-regist/evaluate/' + registId, {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	// 查看证据材料记录
	getRecordEvidenceList(registId) {
		let r = new Request()
		return r.get('/mediate-mediate/record/' + registId, {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	// 导出调解情况说明
	exportMediateResult(registId) {
		let r = new Request()
		return r.get('/mediate-mediate/' + registId + '/export', {
			params: { registId: registId },
			custom: {
				'publish': true
			}
		})
	},
	getMediateRegionCode(query) {
		let r = new Request()
		return r.get('/mediate-regist/region-code', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	linkMediateOnWechat(data) {
		let r = new Request()
		return r.post('/mediate-regist/link-wechat',
			data,
			{custom: { 'publish': true }}
		)
	}
}
