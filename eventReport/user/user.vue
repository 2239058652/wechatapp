<template>
	<view>
		<view class="user-head">
			<div style="text-align: center;">
				<img src="../../eventReport/static/img/user.svg" mode="widthFix" style="width: 55px;height: 55px;">
				<view class="user-title" style="font-size: 35upx;">
					{{username}}
				</view>
			</div>
		</view>
		<view v-if="userType != 1">
			<view v-if="isPAD" class="jifenMain">
				<view style="width: 48%;" @click="handleGoTo('总积分')">
					<view>
						<image src="/eventReport/static/img/jifen.png" style="height: 35rpx;width: 35rpx;"></image>
						总积分：{{ zongjifen }} 分</view>
					</view>
				<view style="width: 4%;font-size: large;">|</view>
				<view style="width: 48%;" @click="handleGoTo('平安豆')">
					<image src="/eventReport/static/img/pingandou.png" style="height: 35rpx;width: 35rpx;"></image>
					平安豆：{{ pingandou }} 个
				</view>
			</view>
			<view v-if="!isPAD" class="jifenMain">
				<view style="width: 100%;" @click="handleGoTo('总积分')">
					<view>
						<image src="/eventReport/static/img/jifen.png" style="height: 35rpx;width: 35rpx;"></image>
						总积分：{{ zongjifen }} 分</view>
					</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list">
				<view v-if="isBJDZ == true" class="li" @click="handleGoTo('防控点位置信息')">
					<view class="icon">
						<image class="to" src="/eventReport/static/userImage/dbsx.png"></image>
					</view>
					<view class="text">防控点位置信息</view>
					<image class="to" src="/eventReport/static/userImage/to.png"></image>
				</view>
				<view class="li" @click="handleGoTo('个人信息')">
					<view class="icon">
						<image class="to" src="/eventReport/static/userImage/gryj.png"></image>
					</view>
					<view class="text">个人信息</view>
					<image class="to" src="/eventReport/static/userImage/to.png"></image>
				</view>
				<view class="li" @click="handleGoTo('修改密码')">
					<view class="icon">
						<image class="to" src="/eventReport/static/userImage/xgmm.png"></image>
					</view>
					<view class="text">修改密码</view>
					<image class="to" src="/eventReport/static/userImage/to.png"></image>
				</view>
				<view class="li" @click="logout()">
					<view class="icon">
						<image class="to" src="/eventReport/static/userImage/tcdl.png"></image>
					</view>
					<view class="text">退出登录</view>
					<image class="to" src="/eventReport/static/userImage/to.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import IntegralApi from '../../api/integral.js'
	import UserApi from '../../api/user.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				isPAD: false,
				isBJDZ: false,
				userType: '',
				username: '',
				openId: '',
				roles: {},
				zongjifen: 0,
				pingandou: 0
			};
		},
		onLoad() {
			this.username = uni.getStorageSync('username')
			this.userType = uni.getStorageSync('userType');
			this.fechLoad()
			this.fetchIntegral()
		},
		methods: {
			fechLoad() {
				this.isBJDZ = false;
				let userRolesList = uni.getStorageSync('roles');
				userRolesList.forEach(item => {
					if (item.id == 'grid_member' || item.id == 'deploy') {
						this.isPAD = true;
					}
				})
				userRolesList.forEach(item => {
					if (item.id == 'border_control_org_point') {
						this.isBJDZ = true;
					}
				})
			},
			fetchIntegral() {
				if (this.userType != 1) {
					IntegralApi.getPersonIntegralTotalReward().then(res => {
						this.zongjifen = res.data.data
					})
					IntegralApi.getPersonTotalBean().then(res => {
						this.pingandou = res.data.data
					})
				}
			},
			// 退出登录，先进行解绑操作
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
			},
			handleGoTo(e) {
				if (e == '总积分') {
					uni.navigateTo({
						url: '../IntegralManagement/integral/index'
					})
				}
				if (e == '平安豆') {
					uni.navigateTo({
						url: '../IntegralManagement/peaceBeans/index'
					})
				}
				if (e == '个人信息') {
					uni.navigateTo({
						url: './userinfo/userinfo'
					})
				}
				if (e == '修改密码') {
					uni.navigateTo({
						url: './modifypassword/modifypassword'
					})
				}
				if (e == '防控点位置信息') {
					uni.navigateTo({
						url: './borderOrganization/index'
					})
				}
				if (e == '我的积分') {
					uni.navigateTo({
						url: '../integral/integrallist/integrallist?zjf=' + this.integral.zongJF + '&syjf=' + this.integral.shengYuJF +
							'&syjf=' + this.integral.shiYongJF
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.user-head {
		background: url(../../eventReport/static/img/logo_header_bg.jpg);
		background-size: 100% 100%;
		color: #FFFFFF;
		padding: 70upx 0;
		img {
			width: 180upx;
		}
	}

	.user-content {
		text-align: left;
		font-size: 35upx;
	}
	.jifenMain {
		width: 76%;
		margin-left: 12%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border:1px #8799A3 solid;
		box-shadow:1px 1px 10px #909090;
		margin-top: -40rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 1rem;
	}
	.list-content {
		margin-top: 10px;
		background: #fff;
	}
	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}
		.li {
			width: 100%;
			height: 88upx;
			padding: 0 4%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}
			.icon {
				flex-shrink: 0;
				width: 35upx;
				height: 35upx;

				image {
					width: 35upx;
					height: 35upx;
				}
			}
			.text {
				padding-left: 20upx;
				width: 90%;
				color: #666;
			}
			.to {
				flex-shrink: 0;
				width: 30upx;
				height: 30upx;
			}
			.text-right {
				width: 120rpx;
				padding-right: 5rpx;
			}
		}
	}
</style>
