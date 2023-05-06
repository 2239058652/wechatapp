/**
 * 默认的全局配置
 */


export default {
	//测试系统
	baseURL: 'https://pajh.jhcaw.gov.cn/test/wechat-api/api/wechat/v1/',
	//正式系统
	// baseURL:'https://pajh.jhcaw.gov.cn/wechat-api/api/wechat/v1/',
	header: {
		'Content-Type': 'application/json;charset=utf-8',
		// 'Authorization': 'bearer ' + uni.getStorageSync('token')
},
method: 'GET',
	dataType: 'json',
	// #ifndef MP-ALIPAY || APP-PLUS
	responseType: 'text',
	// #endif
	custom: {},
	// #ifdef MP-ALIPAY || MP-WEIXIN
	timeout: 30000,
	// #endif
	// #ifdef APP-PLUS
	sslVerify: true,
	// #endif
	// #ifdef H5
	withCredentials: false,
	// #endif
	validateStatus: function validateStatus(status) {
		return status >= 200 && status < 300
	}
}
