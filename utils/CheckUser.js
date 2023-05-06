export default {
	// 判断用户是否过期
	// true 过期 false 未过期
	isLoginExpired() {
		let tokenexp = uni.getStorageSync('tokenexp')
		let result = false
		let now = Date.now()
		if (!tokenexp || now > tokenexp) {
			uni.removeStorageSync('token');
			result = true
		}
		return result
	}
}
