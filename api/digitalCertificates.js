import Request from '@/common/request/index.js'
import qs from 'qs'
const Base64 = require('js-base64').Base64
const base64_authorization = 'Basic ' + Base64.encode('wechat:26490d6e-2eec-4a97-8519-0d5975dd6c80')

export default {
	// 居民通过openid登录
	userResidentWechat(OpenId) {
		let r = new Request()
		return r.post('/auth/resident-wechat', {
			openId: OpenId
		}, {
			header: {
				'Authorization': base64_authorization, //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			custom: {
				'login': true
			}
		})
	},
	saveMediateAdvisory(data) {
		let r = new Request()
		return r.post('/wechat/user-info', data, {
			header: {
				// 'Authorization': base64_authorization, //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			custom: {
				'publish': true
			}
		})
	},
	wechatRegist(data) {
		let r = new Request()
		return r.post('/resident-certify/regist',
			data,
			{custom: { 'publish': true }}
		)
	},
	wechatCertify(data) {
		let r = new Request()
		return r.post('/resident-certify/certify',
			data,
			{custom: { 'publish': true }}
		)
	},
	viewWechatUserInfo(data) {
		let r = new Request()
		return r.get('/resident-query/user-info/' + data.residentId + '/' + data.openId,
			{custom: { 'publish': true }}
		)
	},
	// 巡查
	addCheckPass(data) {
		let r = new Request()
		return r.post('/resident-distinguish/check-pass', data)
	},
	// 获取巡查记录
	getWorkerCheckRecord(query) {
		let r = new Request()
		return r.get('/resident-distinguish/worker-check-record', {
			params: query
		})
	},
	// 获取通过记录详情信息
	getPointManagementDaily(id) {
		let r = new Request()
		return r.get('/resident-distinguish/check-pass/' + id)
	},
	// 获取更多用户信息
	getUserInfoMore(residentId) {
		let r = new Request()
		return r.get('/resident-distinguish/user-info-more/' + residentId)
	}
}
