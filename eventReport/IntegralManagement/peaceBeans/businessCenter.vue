<template>
	<view class="head-show">
		<view class="user-info">
			<view style="font-size: 1.3rem;padding: 50rpx 0 0 0;">
				<u-icon name="home" size="35" color="#FFFFFF" />
				{{ userInfo.orgName}}
			</view>
			<view class="u-flex u-row-between" style="padding: 50rpx;">
				<view>
					<u-icon name="account" size="35" color="#FFFFFF" />
					{{ userInfo.userName}}
				</view>
				<view>
					<image
						src="/eventReport/static/img/pingandou.png"
						style="height: 35rpx;width: 35rpx;"
					/>{{ userInfo.reward}}
				</view>
			</view>
		</view>
		<view class="handle-body">
			<view style="height: 5vh;" />
			<view style="padding: 38rpx;">
				<u-grid :col="2">
					<u-grid-item v-if="merchantCenterStatus === 0" @click="handleGoTo('超市收银')">
						<view>
							<image src="/eventReport/static/img/zhongXinSY.png" class="show-image" />
						</view>
						<view class="grid-text">超市收银</view>
					</u-grid-item>
					<u-grid-item v-if="merchantCenterStatus === 1" @click="handleGoTo('中心收银')">
						<view>
							<image src="/eventReport/static/img/chaoShiSY.png" class="show-image" />
						</view>
						<view class="grid-text">中心收银</view>
					</u-grid-item>
					<u-grid-item @click="handleGoTo('收银记录')">
						<view>
							<image src="/eventReport/static/img/shouYinJL.png" class="show-image" />
						</view>
						<view class="grid-text">收银记录</view>
					</u-grid-item>
					<u-grid-item @click="handleGoTo('现金结算')">
						<view>
							<image src="/eventReport/static/img/xianJinJX.png" class="show-image" />
						</view>
						<view class="grid-text">现金结算</view>
					</u-grid-item>
					<u-grid-item @click="handleGoTo('结算记录')">
						<view>
							<image src="/eventReport/static/img/jieSuanJL.png" class="show-image" />
						</view>
						<view class="grid-text">结算记录</view>
					</u-grid-item>
					<u-grid-item @click="handleGoTo('密码修改')">
						<view>
							<u-icon name="edit-pen" :size="68" color="#32c5e9"></u-icon>
						</view>
						<view class="grid-text">密码修改</view>
					</u-grid-item>
					<u-grid-item @click="logout()">
						<view>
							<u-icon name="lock-open" :size="68"></u-icon>
						</view>
						<view class="grid-text">退出系统</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
	</view>
</template>
<script>
	import IntegralApi from '@/api/integral.js'
	import UserApi from '@/api/user.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				merchantCenterStatus: 0,
				userInfo: {
					userName: '',
					userId: '',
					userAccount: '',
					orgName: '',
					reward: 0
				},
				type: 'business'
			};
		},
		onLoad() {
			this.fechLoad()
			this.fetchIntegral()
			this.userInfo = {
				userName: uni.getStorageSync('username'),
				userId: uni.getStorageSync('userid'),
				userAccount: uni.getStorageSync('account'),
				orgName: uni.getStorageSync('org').name,
				reward: 0
			}
		},
		methods: {
			fechLoad() {
				let userRolesList = uni.getStorageSync('roles');
				userRolesList.forEach(item => {
					if (item.id == 'merchant_center') {
						this.merchantCenterStatus = 1
					} else {
						this.merchantCenterStatus = 0
					}
				})
			},
			// 获取平安豆
			fetchIntegral() {
				var _this = this
				IntegralApi.getPersonTotalBean().then(res => {
					_this.userInfo.reward = res.data.data
				})
			},
			// 跳转
			handleGoTo(e) {
				if (e == '超市收银') {
					uni.navigateTo({
						url: './identification?type=' + this.type
					})
				}
				if (e == '中心收银') {
					uni.navigateTo({
						url: './identificationCenter?type=' + this.type
					})
				}
				if (e == '收银记录') {
					uni.navigateTo({
						url: './identificationList'
					})
				}
				if (e == '现金结算') {
					uni.navigateTo({
						url: './businessExchange'
					})
				}
				if (e == '结算记录') {
					uni.navigateTo({
						url: './busineseExchangeList'
					})
				}
				if (e == '密码修改') {
					uni.navigateTo({
						url: '../../user/modifypassword/modifypassword'
					})
				}
			},
			logout() {
				this.openId = uni.getStorageSync('openId')
				if(this.openId != '') {
					UserApi.unbindUser(this.openId).then(res => {
						if (res.data.code === 0) {
							uni.clearStorageSync()
							uni.redirectTo({
								url: '/pages/login/login'
							})
						} else {
							uni.showToast({
								title: '退出登录失败' + res.data.desc,
								icon: 'none'
							})
						}
					})
				} else {
					uni.clearStorageSync()
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.head-show {
		background: url(../../../eventReport/static/img/bianjingTY.png);
	}
	.user-info {
		background-size: 100% 100%;
		width: 100%;
		border-radius: 10rpx;
		font-size: 1.1rem;
		text-align: center;
		height: 20vh;
		line-height: 6vh;
		color: #FFFFFF;
	}
	.handle-body {
		height: 72vh;
		border-radius: 60rpx 60rpx 0rpx 0rpx;
		background-color: #FFFFFF;
		.handle-button {
			margin: 5% 8% 0% 8%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;
			color: #000000;
			font-weight: 900;
		}
	}
	.show-image {
		height: 100rpx;
		width: 100rpx;
	}
	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: #000000;
		font-weight: 800;
	}
</style>
