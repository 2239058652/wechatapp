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
			<view class="login-body">
				<view class="login-title">
					— 平安志愿者注册 —
				</view>
				<u-form :model="userinfo" ref="uForm" label-width="0" :error-type="errorType" style="overflow: auto;margin-top: 10%;">
					<u-form-item
						left-icon="account" :left-icon-style="lefticonstyle"
						class="uni-form-item" prop="name"
					>
						<input type="text" class="uni-input" placeholder-class="placeholder-class"
							v-model="userinfo.name" placeholder="请输入您的姓名"
						/>
					</u-form-item>
					<u-form-item
						left-icon="phone" :left-icon-style="lefticonstyle"
						class="uni-form-item" prop="mobile"
					>
						<input type="number" maxlength="11" class="uni-input" placeholder-class="placeholder-class"
							v-model="userinfo.mobile" placeholder="请输入您的手机号(登录账号)"
						/>
					</u-form-item>
					<u-form-item
						left-icon="order" :left-icon-style="lefticonstyle"
						class="uni-form-item" prop="idCard"
					>
						<input type="text" maxlength="18" class="uni-input" placeholder-class="placeholder-class"
							v-model="userinfo.idCard" placeholder="请输入您的身份证号"
						/>
					</u-form-item>
					<u-form-item
						left-icon="lock" :left-icon-style="lefticonstyle"
						class="uni-form-item" prop="password"
					>
						<input type="password" class="uni-input" placeholder-class="placeholder-class"
							v-model="userinfo.password" placeholder="请输入您的密码"
						/>
					</u-form-item>
					<u-form-item
						left-icon="home" :left-icon-style="lefticonstyle"
						class="uni-form-item" prop="region"
					>
						<view style="display: flex;width: 100%;" @click="regionShow = true">
							<view style="width: 90%;">
								<input select disabled="true" class="uni-input" placeholder-class="placeholder-class"
									v-model="userinfo.region" placeholder="村（社区）平安志愿者组织"
								/>
							</view>
							<view style="width: 10%;">
								<u-icon name="arrow-down-fill" color="#FFFFFF" size="30"></u-icon>
							</view>
						</view>
						<u-select
							v-model="regionShow"
							mode="mutil-column-auto"
							:list="tabbarList"
							label-name="name"
							value-name="regionCode"
							@confirm="regionConfirm"
						/>
					</u-form-item>
				</u-form>
				<view style="margin-top: 10%;">
					<u-button
						:custom-style="loginBottonClass"
						@click="handleRegister()"
						:hair-line="false"
					>注 册</u-button>
				</view>
				<view class="exit-handle" @click="handleToLogin()">
					已有账号？点此登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import UserApi from '../../api/user.js'
	export default {
		onShareAppMessage(){
			return { from:"menu" }
		},
		onShareTimeline(){},
		components: {},
		data() {
			return {
				openId: '',
				wechatOpenId: '',
				regionShow: false,
				showPassword: true,
				errorType: ['toast', 'border'],
				userinfo: {
					name: '',
					idCard: '',
					mobile: '',
					password: '',
					openId: '',
					region: '',
					regionCode: ''
				},
				loginBottonClass: {
					fontSize: '35upx',
					backgroundColor: '#1261d4',
					color: '#ffffff'
				},
				lefticonstyle: {
					fontSize: '35upx',
					color: '#ffffff'
				},
				rules: {
					name: [{
							required: true,
							message: '请填写姓名',
							trigger: 'change'
						},
						{
							min: 2,
							message: '名字不能少于2个字',
							trigger: 'change'
						}
					],
					mobile: [{
							required: true,
							message: '请填写您的身份证号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号不正确',
							trigger: ['change', 'blur'],
						}
					],
					idCard: [{
							required: true,
							message: '请填写您的身份证号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.idCard(value);
							},
							message: '身份证件号不正确',
							trigger: ['change', 'blur'],
						}
					],
					password: [{
							required: true,
							message: '请输入您的密码',
							trigger: 'change'
						},
						{
							min: 8,
							message: '密码不能少于8位',
							trigger: 'change'
						},
						{
							pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种'
						}
					],
					regio: [{
							required: true,
							message: '请选择您所在的村（社区）平安志愿者组织',
							trigger: 'change'
						},
					]
				},
				tabbarList: [
					{
						regionCode: 1,
						name: '允景洪街道',
						children: [
							{
								regionCode: 2,
								name: '广东'
							},
							{
								regionCode: 3,
								name: '广西'
							}
						]
					},
					{
						regionCode: 4,
						name: '江北街道',
						children: [
							{
								regionCode: 5,
								name: '江北街道江北街道'
							}
						]
					},
					{
						regionCode: 6,
						name: '基诺山基诺族乡',
						children: [
							{
								regionCode: 7,
								name: 'XXXXXXX村委会'
							}
						]
					}
				]
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
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {	
			handleToGetOpenId() {
				let openid = uni.getStorageSync('openId')
				this.userinfo.openId = openid
				this.oauthLogin()
			},
			// 行政区划选择
			regionConfirm(e) {
				this.userinfo.region = e[1].label
				this.userinfo.regionCode = e[1].value
			},
			// 注册
			handleRegister() {
				var _this = this
				console.log('AAAAAAAAAA', this.userinfo)
				_this.$refs.uForm.validate(valid => {
					if (valid) {
						_this.buttonLoading = true
						if(_this.userinfo.mobile == '15214087452') {
							uni.showModal({
								title: '温馨提示',
								content: '您已经是系统用户，当前所属组织为：景洪市委政法委，请使用账户、密码进行登录！如您忘记密码请与景洪市委政法委系统管理员联系重置密码，感谢您的使用，祝您工作顺利！',
								confirmText: "知道了",
								showCancel: false
							})
						} else {
							// if (res.data.code === 0) {
							// 	uni.showToast({
							// 		title: '注册成功，请使用账户密码进行登录',
							// 		icon: 'none'
							// 	})
							// 	setTimeout(function() {
							// 		uni.navigateBack({
							// 			delta: 1
							// 		});
							// 	}, 1500)
							// } else {
							// 	uni.showToast({
							// 		title: '修改失败:' + res.data.desc,
							// 		icon: 'none'
							// 	})
							// 	_this.buttonLoading = false
							// }
						}
					} else {
						_this.buttonLoading = false
					}
				});
				// uni.navigateBack()
			},
			// 返回登录
			handleToLogin() {
				uni.navigateBack()
			}
		}
	}
</script>
<style lang="scss">
	.login-bg {
		background-color: #1261d4;
		height: 100vh;
	}
	.login-head {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		border: 0upx;
		color: #FFFFFF;
		padding-top: 10upx;
		height: 250upx;
		img {
			width: 150upx;
		}
	}
	.login-title {
		padding-top: 8px;
		font-size: 38upx;
		text-align: center;
	}
	.login-body {
		overflow: auto;
		padding: 0% 13%;
		color: #FFFFFF;
	}
	.uni-form-item{
		height: 4.5vh;
		margin-bottom: 40upx;
		padding: 0;
		color: #FFFFFF;
		.uni-input{
			color: #FFFFFF;
			height: 4.5vh;
			font-size: 30upx;
		}
	}
	.exit-handle {
		margin-top: 5%;
		font-size: 35upx;
		text-align: center;
		padding-top: 20rpx;
	}
	/deep/.placeholder-class {
		font-size: 30upx;
		color: #FFFFFF;
	}
</style>
