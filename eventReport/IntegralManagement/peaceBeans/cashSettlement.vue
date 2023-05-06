<template>
	<view style="background-color: #1261d4;min-height: 100vh;">
		<view style="height: 3vh;" />
		<view v-if="scanshow" @click="handleIdentification()">
			<view class="scan-text">
				超市收银
			</view>
			<view class="head-img">
				<view class="scan" />
			</view>
		</view>
		<view v-if="userInfoShow">
			<view class="user-info">
				<view style="margin-left: 8%;width: 100%;display: flex;">
					<view style="width: 8%;"><u-icon name="account" size="35" color="#1261d4" /></view>
					<view style="width: 20%;text-align-last: justify;">姓名</view>
					<view style="width: 72%;">:{{ userInfo.userName}}</view>
				</view>
				<view style="margin-left: 8%;width: 100%;display: flex;">
					<view style="width: 8%;"><u-icon name="phone" size="35" color="#1261d4" /></view>
					<view style="width: 20%;text-align-last: justify;">联系方式</view>
					<view style="width: 72%;">:{{ userInfo.userAccount}}</view>
				</view>
				<view style="margin-left: 8%;width: 100%;display: flex;">
					<view style="width: 8%;"><u-icon name="home" size="35" color="#1261d4" /></view>
					<view style="width: 20%;text-align-last: justify;">所属组织</view>
					<view style="width: 72%;">:{{ userInfo.orgName}}</view>
				</view>
				<view style="margin-left: 8%;width: 100%;display: flex;">
					<view style="width: 8%;"><image src="/eventReport/static/img/pingandou.png" style="height: 35rpx;width: 35rpx;" /></view>
					<view style="width: 20%;text-align-last: justify;">平安豆</view>
					<view style="width: 72%;">:{{ userInfo.reward}}</view>
				</view>
			</view>
			<view class="refresh-user" @click="refreshUser()">
				<u-icon name="reload" color="#FFFFFF" size="35" style="margin-right: 2%;" />重新识别
			</view>
			<view style="margin: 0 5% 0 8%;">
				<u-form :model="dataTempDH" ref="uFormDCJL" :error-type="errorType">
					<u-form-item :border-bottom="false" label="兑换日期:" prop="duihuandate" style="color: #FFFFFF;" label-width="140">
						{{ dataTempDH.duihuandate }}
					</u-form-item>
					<u-form-item :border-bottom="false" label="平安豆值:" prop="pingandou" style="color: #FFFFFF;" label-width="140">
						<view style="background-color: #FFFFFF;width: 100%;">
							<u-input type="number" maxlength=6 v-model="dataTempDH.pingandou" :border="true" style="background-color: #FFFFFF;"/>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="confirmation" @click="handleConfirm()" style="margin-top: 10vh;">
				<u-icon name="integral" color="#FFFFFF" size="45" style="margin-right: 2%;" />确定兑换
			</view>
		</view>
		<view class="store-show">
			@ {{ storeDetail.name }}
		</view>
	</view>
</template>
<script>
	import IntegralApi from '../../../api/integral.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				scanshow: true,
				userInfoShow: false,
				storeDetail: {},
				dataTempDH: {
					duihuandate: '2021-06-03',
					pingandou: 0
				},
				errorType: ['toast', 'border'],
				userInfo: {
					reward: '',
					qrVerification: '',
					type: '',
					userName: '',
					userId: '',
					userAccount: '',
					orgName: ''
				},
				type: ''
			};
		},
		onLoad(option) {
			if (option.type) {
				this.type = option.type
			}
			this.storeDetail = uni.getStorageSync('org')
		},
		methods: {
			handleIdentification() {
				var _this = this
				wx.scanCode({
					success: (res) => {
						if (_this.type == 'business' ) {
							if (JSON.parse(res.result).type == '0' ) {
								uni.showToast({
									title: '识别成功！！',
									icon: 'none'
								})
								_this.userInfo = JSON.parse(res.result)
								_this.userInfoShow = true
								_this.scanshow = false
							} else {
								uni.showToast({
									title: '二维码信息错误！',
									icon: 'none'
								})
							}
						} else if (_this.type == 'manager' ) {
							if (JSON.parse(res.result).type == '1' ) {
								uni.showToast({
									title: '识别成功！！',
									icon: 'none'
								})
								_this.userInfo = JSON.parse(res.result)
								_this.userInfoShow = true
								_this.scanshow = false
							} else {
								uni.showToast({
									title: '二维码信息错误！',
									icon: 'none'
								})
							}
						}
					},
					fail: (res) => {  
						uni.showToast({
							title: '抱歉，识别失败！！',
							icon: 'none'
						})
					}  
				})
			},
			refreshUser() {
				this.userInfoShow = false
				this.scanshow = true
			},
			handleConfirm() {
				var _this = this
				if (_this.type == 'business' ) {
					IntegralApi.handleUserConsumeReward({
						consumeReward: _this.dataTempDH.pingandou,
						consumerUserId: _this.userInfo.userId,
						qrVerification: _this.userInfo.qrVerification
					}).then(res => {
						if (res.data.code === 0) {
							uni.showToast({
								title: '兑换确认操作成功！',
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 2000)
						} else {
							uni.showToast({
								title: '操作失败: 请检查后重试',
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						}
					})
				} else if (_this.type == 'manager' ) {
					IntegralApi.handleMerchantConsumeReward({
						consumeReward: _this.dataTempDH.pingandou,
						consumerUserId: _this.userInfo.userId,
						qrVerification: _this.userInfo.qrVerification
					}).then(res => {
						if (res.data.code === 0) {
							uni.showToast({
								title: '兑换确认操作成功！',
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 2000)
						} else {
							uni.showToast({
								title: '操作失败: 请检查后重试',
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.jifen-head {
		background: url(/eventReport/static/img/jifenBg.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 200rpx;
	}
	.jifen-title {
		margin-top: 2%;
		text-align: center;
		height: 130rpx;
		font-size: 1rem;
	}
	.scan-text {
		height: 5vh;
		line-height: 5vh;
		text-align: center;
		color: #FFFFFF;
		font-size: large;
		font-weight: 900;
	}
	.head-img {
		padding: 20px 25px 20px 25px
	}
	.scan {
		background: url(../../static/img/smqr.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 360rpx;
		width: 100%;
	}
	.user-info {
		border-radius: 10rpx;
		background-color: #FFFFFF;
		margin: 0% 8% 0% 8%;
		line-height: 4vh;
	}
	.refresh-user {
		margin-top: 1vh;
		color: #FFFFFF;
		text-align: center;
		height: 3vh;
		line-height: 3vh;
	}
	.store-show {
		color: #FFFFFF;
		height: 5vh;
		line-height: 5vh;
		text-align: center;
		margin-top: 20%;
	}
	.confirmation {
		width: 86%;
		margin-left: 7%;
		background-color: #007AFF;
		height: 6.5vh;
		line-height: 6.5vh;
		border-radius: 10rpx;
		text-align: center;
		font-size: 1rem;
		color: #FFFFFF;
	}
</style>
