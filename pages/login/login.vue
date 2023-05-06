<template>
	<view class="content">
		<view class="login-bg">
			<view class="login-head">
				<view style="text-align: center;">
					<img src="../../eventReport/static/img/logo.png" mode="widthFix">
					<view class="login-title">
						景洪市综治信息系统
					</view>
				</view> 
			</view>
			<view v-if="loginStatus == 0" class="login-body">
				<view class="login-title">
					— 账户登录 —
				</view>
				<view style="color: #000000;">
					<wInput v-model="userinfo.account" type="text" placeholder="账户(手机号)" headericon="cuIcon-people">
					</wInput>
					<wInput v-model="userinfo.password" type="password" maxlength="20" placeholder="密码" isShowPass
					 headericon="cuIcon-lock">
					</wInput>
				</view>
				<view>
					<u-button :custom-style="loginBottonClass" @click="handleLogin()" :hair-line="false">登 录</u-button>
				</view>
				<view style="display: flex;margin-top: 2%;">
					<view class="login-function" style="flex: 1;text-align: left;">
						<view @click="handleToOauth()">微信一键登录</view> 
					</view>
					<!-- <view class="login-function" style="flex: 1;text-align: right;">
						<view @click="handleToRegister()">平安志愿者注册</view>
					</view> -->
				</view>
			</view>
			<view v-if="loginStatus == 1" class="login-body-auth">
				<view>
					<u-button :custom-style="loginBottonClass" @click="oauthLogin()" :hair-line="false">
						<view class="icon"><u-icon size="60" name="weixin-fill" color="rgb(83,194,64)"></u-icon></view>
						<text style="margin-left: 5%;">一键登录</text>
					</u-button>
				</view>
				<view class="login-function">
					<view @click="handleToAccount()">账户密码登录</view>
				</view>
			</view>
			<view class="login-foot" />
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import wInput from '@/components/watch-login/watch-input.vue'
	import UserApi from '../../api/user.js'
	import JWTDecrypt from '@/utils/jwt'
	import Request from '@/common/request/index.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		components: {
			wInput
		},
		data() {
			return {
				title: 'Hello',
				check: false,
				openId: '',
				userinfo: {
					password: '',
					account: '',
					openId: ''
				},
				loginStatus: 1,
				loginBottonClass: {
					backgroundColor: '#1261d4',
					color: '#ffffff'
				},
				wechatOpenId: ''
			}
		},
		onShow() {},
		onLoad() {
			this.openId = uni.getStorageSync('openId')
			// #ifdef MP-WEIXIN
			if (!this.openId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
			this.handleToGetOpenId()
		},
		methods: {	
			// 显示账户密码登录
			handleToOauth() {
				this.loginStatus = 1
			},
			// 显示账户密码登录
			handleToAccount() {
				this.loginStatus = 0
			},
			handleToGetOpenId() {
				let openid = uni.getStorageSync('openId')
				this.userinfo.openId = openid
				this.oauthLogin()
			},
			// 账户密码登录
			handleLogin() {
				UserApi.accountlogin(this.userinfo).then(res => {
					if (res.data.code == 0) {
						// console.log('账户密码登录', res)
						uni.setStorageSync('token', res.data.data.access_token)
						uni.setStorageSync('username', res.data.data.expand.name)
						uni.setStorageSync('userid', res.data.data.expand.id)
						uni.setStorageSync('account', res.data.data.expand.account)
						uni.setStorageSync('org', res.data.data.expand.org)
						uni.setStorageSync('roles', res.data.data.expand.roles)
						let now = Date.now()
						let exptime = now + ((res.data.data.expires_in - 60) * 1000)
						uni.setStorageSync('tokenexp', exptime)
						// 2021年4月14日新增用户类型/防控用户组织机构信息 0:综治用户 1:防控用户 2::综治\防控用户
						uni.setStorageSync('userType', res.data.data.expand.userType)
						if(res.data.data.expand.userType !== 0) {
							uni.setStorageSync('borderUserid', res.data.data.expand.borderUserid)
							uni.setStorageSync('borderUsername', res.data.data.expand.borderUsername)
							uni.setStorageSync('borderUserorg', res.data.data.expand.borderUserorg)
							uni.setStorageSync('borderUserlineOrgInfos', res.data.data.expand.borderUserlineOrgInfos)//多段长信息
							uni.setStorageSync('borderUserpointOrgInfos', res.data.data.expand.borderUserpointOrgInfos)
							uni.setStorageSync('borderUserOrgRegionCode', res.data.data.expand.borderUserOrgRegionCode)
						}
						uni.switchTab({
							url: '../main/main'
						})
					} else {
						uni.showToast({
							title: '登录失败' + res.data.desc,
							icon: 'none'
						})
					}
				})
			},
			//用户openid登录
			oauthLogin() {
				UserApi.oauthLogin(this.userinfo).then(res => {
					if (res.data.code == 0) {
						console.log('res', res)
						uni.setStorageSync('token', res.data.data.access_token)
						uni.setStorageSync('username', res.data.data.expand.name)
						uni.setStorageSync('userid', res.data.data.expand.id)
						uni.setStorageSync('account', res.data.data.expand.account)
						uni.setStorageSync('org', res.data.data.expand.org)
						uni.setStorageSync('roles', res.data.data.expand.roles)
						let now = Date.now()
						let exptime = now + ((res.data.data.expires_in - 60) * 1000)
						uni.setStorageSync('tokenexp', exptime)
						// 2021年4月14日新增用户类型/防控用户组织机构信息 0:综治用户 1:防控用户 2::综治\防控用户
						uni.setStorageSync('userType', res.data.data.expand.userType)
						if(res.data.data.expand.userType !== 0) {
							uni.setStorageSync('borderUserid', res.data.data.expand.borderUserid)
							uni.setStorageSync('borderUsername', res.data.data.expand.borderUsername)
							uni.setStorageSync('borderUserorg', res.data.data.expand.borderUserorg)
							uni.setStorageSync('borderUserlineOrgInfos', res.data.data.expand.borderUserlineOrgInfos)
							uni.setStorageSync('borderUserpointOrgInfos', res.data.data.expand.borderUserpointOrgInfos)
							uni.setStorageSync('borderUserOrgRegionCode', res.data.data.expand.borderUserOrgRegionCode)
						}
						uni.switchTab({
							url: '../main/main'
						})
					} else if(res.data.code == 60000001) {
						this.loginStatus = 0
					} else {
						this.loginStatus = 0
					}
				})
			},
			// 跳转注册
			handleToRegister() {
				uni.navigateTo({
					url: '/eventReport/register/index'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.login-bg {
		background-color: #1261d4;
		height: 100vh;
	}
	.login-head {
		background: url(../../eventReport/static/img/logo_header_bg.jpg);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		border: 0upx;
		color: #FFFFFF;
		// padding: 60upx 0;
		padding-top: 80upx;
		height: 460upx;

		img {
			width: 170upx;
		}
	}
	.login-body {
		margin-top: -110upx;
		padding: 10%;
		color: #FFFFFF;
	}
	.login-body-auth {
		padding: 10%;
		color: #FFFFFF;
	}
	.login-foot {
		background: url(../../eventReport/static/img/logo_foot.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 180rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: auto
	}
	.login-title {
		font-size: 40upx;
		text-align: center;
		padding: 20upx 0upx 20upx 0upx;
	}
	.login-function {
		font-size: 32upx;
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}
	.login-forget {
		float: right;
		font-size: 30upx;
	}
	.login-register {
		float: left;
		font-size: 30upx;
	}

	.login-botton {
		// border: #FFFFFF;
		// border-style: solid;
		// border-width: 2px;
		color: #FFFFFF;
		background-color: #1261d4;
		width: 100%;
	}
</style>
