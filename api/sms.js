import Request from '@/common/request/index'

export default {
	//获取注册验证码
	getRegisterCode(data) {
		let r = Request()
		return r.post('/sms/register-code/'+data.mobile, {
			data: data
		})
	},
	// 获取注销验证码
	getLogoutAccountCode(data) {
		let r = Request()
		return r.post('/sms/unregister-code/'+data.mobile, {
			data: data
		})
	},
	
}


