import Request from '@/common/request/index.js'

export default {
	// 场景列表
	getSituationList(query) {
		let r = new Request()
		return r.get('/situation', {
			params: query
		})
	},
	// 场景列表
	getSituationDetailList(data) {
		let r = new Request()
		return r.get('/situation-class/' + data.situationId, {
			data
		})
	},
	// 事件标准分类
	getSceneClsList(query) {
		let r = new Request()
		return r.get('/scene-cls-link/class-tree', {
			params: query
		})
	},
	// 事件标准分类————树
	getSceneClsTree(query) {
		let r = new Request()
		return r.get('/scene-cls-link/all-class-tree', {
			params: query
		})
	},
	// 群众诉求分类一次性树加载——树
	getSceneAppealClsTree(query) {
		let r = new Request()
		return r.get('/scene-cls-link/appeal-class-tree-detail', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 矛盾纠纷分类一次性树加载——树
	getDisputesClsTree(query) {
		let r = new Request()
		return r.get('/scene-cls-link/contradiction-class-tree-detail', {
			params: query
		})
	},
	// 细项List
	getClassDetailList(query) {
		let r = new Request()
		return r.get('/event-cls-criteria/class-detail', {
			params: query
		})
	},
}
