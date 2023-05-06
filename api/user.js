import Request from '@/common/request/index.js'
import qs from 'qs'
const Base64 = require('js-base64').Base64
const base64_authorization = 'Basic ' + Base64.encode('wechat:26490d6e-2eec-4a97-8519-0d5975dd6c80')

export default {
	userBind(data) {
		let r = new Request()
		return r.post('/account/bind-user', data, {
			header: {
				'Authorization': '', //自定义请求头信息
			}
		})
	},
	userOpenIdLogin(OpenId) {
		let r = new Request()
		return r.post('/auth/openid', {
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
	accountlogin(data) {
		let r = new Request()
		return r.post('/auth/account', data, {
			header: {
				'Authorization': base64_authorization, //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			custom: {
				'login': true
			}
		})
	},
	oauthLogin(data) {
		let r = new Request()
		return r.post('/auth/openid', data, {
			header: {
				'Authorization': base64_authorization, //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			custom: {
				'login': true
			}
		})
	},
	getUserBindType(OpenId) {
		let r = new Request()
		return r.get('/account/bind-type/' + OpenId, {
			header: {
				'Authorization': '', //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
	},
	//获取openid
	getWechatOpenId(code) {
		let r = new Request()
		return r.get('/wechat/code2session/' + code, {
			// data: data,
			header: {
				// 'Authorization': '', //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			custom: {
				'publish': true
			}
		})
	},
	// 获取用户信息
	getUserInfo() {
		let r = new Request()
		return r.get('/user-center/info')
	},
	// 修改用户信息
	modifyUserInfo(data) {
		let r = new Request()
		return r.post('/user-center/modify-me', data)
	},
	// 修改用户密码
	modifyUserPassword(data) {
		let r = new Request()
		return r.post('/user-center/modify-password', data)
	},
	// 获取用户列表
	getUserList(query) {
		let r = new Request()
		return r.get('/user', {
			params: query
		})
	},
	// 解绑操作
	unbindUser(openId) {
		// let r = new Request()
		// return r.post('/account/unbind-user/' + openId, {
		// 	params: {
		// 		openId: openId
		// 	}
		// })
		let r = new Request()
		return r.post('/account/unbind-user/' + openId)
	},
	//获取用户列表（公网）
	getUserListPublic(query) {
		let r = new Request()
		return r.get('/user/public', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	//获取网格员职责（公网）
	getUserDutyPublic(query) {
		let r = new Request()
		return r.get('/user/gridMemberDuty', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	getToken(code) {
		var qs = require('qs')
		var postData = qs.stringify(code)
		var base64_authorization = 'Basic YnJvd3Nlci1jbGllbnQ6MTIzNDU2'
		var base_url = '/api/login'
		var requestTask = uni.request({
			url: base_url + '/enterprise-wechat/code',
			method: 'POST',
			data: postData,
			header: {
				'Authorization': base64_authorization, //自定义请求头信息
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		// console.log(typeof requestTask)

		// requestTask.abort();
		return requestTask
	},
	// 获取用户信息————微信统一
	getUserInfoByAccount(account) {
		let r = new Request()
		return r.get('/unify-user-center/info/' + account)
	},
	// 修改用户信息————微信统一
	modifyUserInfoByAccount(data) {
		let r = new Request()
		return r.post('/unify-user-center/modify-me/' + data.account, data)
	},
	// 修改用户密码————微信统一
	modifyUserPasswordByAccount(data) {
		let r = new Request()
		return r.post('/unify-user-center/modify-password', data)
	}
}
