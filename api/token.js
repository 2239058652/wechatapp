import Request from '@/common/request/index'

export default {
	// login(data) {
	// 	const base64_authorization = 'Basic YnJvd3Nlci1jbGllbnQ6MTIzNDU2'
	// 	var postData = qs.stringify(data)
	// 	return request({
	// 		url: '/account',
	// 		method: 'post',
	// 		data: postData,
	// 		baseURL: 'http://www.shuwenxianyun.com:9000/api/user-center/login/v1',
	// 		headers: {
	// 			'Authorization': base64_authorization
	// 		}
	// 	})
	// },
	getMockToken(uid){
		return ''
	}
}
