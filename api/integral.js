import Request from '@/common/request/index.js'

export default {
	// 获取个人积分信息
	getIntegralPersonInfo() {
		let r = new Request()
		return r.get('/jifen-dh/personInfo')
	},
	//我的积分来源明细列表
	getEvaluateList(query) {
		let r = new Request()
		return r.get('/jifen-dh/jiFenMxList', {
			params: query
		})
	},
	// 登录获取积分
	getIntegralByLoad() {
		let r = new Request()
		return r.post('/pinganjf/login-reward')
	},
	// 获取总积分
	getPersonIntegralTotalReward() {
		let r = new Request()
		return r.get('/pinganjf/total-reward')
	},
	// 获取年度总积分
	getPersonIntegralYearTotalReward() {
		let r = new Request()
		return r.get('/pinganjf/year-total-reward')
	},
	// 获取月度总积分
	getPersonIntegralMonthTotalReward() {
		let r = new Request()
		return r.get('/pinganjf/month-total-reward')
	},
	// 获取单日总积分
	getPersonIntegralDayTotalReward() {
		let r = new Request()
		return r.get('/pinganjf/day-total-reward')
	},
	// 获取单日总积分列表
	getPersonIntegralDayTotalRewardList() {
		let r = new Request()
		return r.get('/pinganjf/day-total-reward-list')
	},
	//查看单日积分列表详情
	getDayTotalRewardDetail(rewardDay) {
		let r = new Request()
		return r.get('/pinganjf/day-reward-list/' + rewardDay)
	},
	// 登录注册（2021年4月15日新加）
	getLoginRegistWechat() {
		let r = new Request()
		return r.get('/unify-user-center/login-regist-wechat')
	},
	// 获取总平安豆
	getPersonTotalBean() {
		let r = new Request()
		return r.get('/pinganjf/total-bean')
	},
	// 【积分兑换】展示系统用户平安豆
	getPinganJFCode() {
		let r = new Request()
		return r.get('/pinganjf/qr-code')
	},
	// 【积分兑换】商家扫码扣平安豆
	handleUserConsumeReward(data) {
		let r = new Request()
		return r.post('/pinganjf/user-consume-reward', data)
	},
	// 【积分兑换】商家中心扫码扣平安豆
	handleCenterConsumeReward(data) {
		let r = new Request()
		return r.post('/pinganjf/center-consume-reward', data)
	},
	// 【积分兑换】政法委扫码扣平安豆
	handleMerchantConsumeReward(data) {
		let r = new Request()
		return r.post('/pinganjf/merchant-consume-reward', data)
	},
	// 平安豆历史记录流水
	handleUserPingandHistory(query) {
		let r = new Request()
		return r.get('/pinganjf/pingand-history', {
			params: query
		})
	}
}
