<template>
	<view style="background-color: #1261d4;min-height: 100vh;">
		<view style="height: 3vh;" />
		<view class="scan-head">纠纷调解在线查询</view>
		<view v-if="scanshow" @click="handleIdentification()">
			<view class="head-img">
				<view class="scan" />
			</view>
			<view style="padding: 10rpx 50rpx 10rpx 50rpx;color: #FFFFFF;">
				<view>注意事项：</view>
					<view>1、本功能仅用于扫描综治信息系统（包括电脑端、微信小程序）内矛盾纠纷多元化解案件信息二维码使用；</view>
					<view>2、使用时请正确扫描矛盾纠纷多元化解案件信息相关记录二维码，非正确二维码系统会进行“二维码信息错误”提示；</view>
					<view>3、扫码成功后会自动跳转至您的申报列表、请您依据案件编号、时间等进行查找查看详情；</view>
					<view>4、如已经扫描关联过请勿重复扫描，系统会提示“已经关联过，请勿重复关联”；</view>
			</view>
		</view>
		<view v-if="mediateInfoShow">
			<view class="user-info">
				<view style="text-align: center;font-size: large;font-weight: 700;">案件信息</view>
				<!-- <view style="margin-left: 10%;">
					<u-icon name="file-text-fill" size="35" color="#1261d4" />纠纷案号:
				</view> -->
				<view style="text-align: center;">
					{{ mediateInfo.registrationNo }}
				</view>
				<view style="margin-left: 10%;">
					<u-icon name="file-text-fill" size="35" color="#1261d4" />联系人:{{ mediateInfo.linkman }} 
				</view>
			</view>
			<view class="refresh-user" @click="refreshUser()">
				<u-icon name="reload" color="#FFFFFF" size="35" style="margin-right: 2%;" />重新识别
			</view>
			<view style="margin: 10% 5% 0 8%;">
				<u-form :model="dataTempLink" ref="mediateInfoData" :error-type="errorType">
					<u-form-item :border-bottom="false" label="您的姓名:" prop="bindUserName" style="color: #FFFFFF;" label-width="130">
						<view style="background-color: #FFFFFF;width: 95%;border-radius: 10rpx;">
							<u-input v-model="dataTempLink.bindUserName" :border="true"
							style="background-color: #FFFFFF;"/>
						</view>
					</u-form-item>
					<u-form-item :border-bottom="false" label="您的电话:" prop="bindUserMobile" style="color: #FFFFFF;" label-width="130">
						<view style="background-color: #FFFFFF;width: 95%;border-radius: 10rpx;">
							<u-input type="number" maxlength="11" v-model="dataTempLink.bindUserMobile"
								:border="true" style="background-color: #FFFFFF;"/>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="confirmation" @click="handleConfirm()" style="margin-top: 10vh;">
				确定关联
			</view>
		</view>
	</view>
</template>
<script>
	import DisputesResolvePlatform from '@/api/disputesResolvePlatform.js'
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
				mediateInfoShow: false,
				storeDetail: {},
				dataTempLink: {
					bindUserName: '',
					bindUserMobile: ''
				},
				errorType: ['toast', 'border'],
				mediateInfo: {
					registrationId: '',
					userId: '',
					registrationNo: '',
					linkman: '',
					type: ''
				},
				rulesLink: {
					bindUserName: [{ required: true, message: '请输入您的姓名', trigger: 'change' }],
					bindUserMobile: [
						{ required: true, message: '请输入您的联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					]
				},
			};
		},
		onLoad() {
			// 获取openId
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
		methods: {
			handleIdentification() {
				var _this = this
				wx.scanCode({
					success: (res) => {
						var resResult = res.result.trim()
						if (JSON.parse(resResult).type == 1 ) {
							uni.showToast({
								title: '识别成功！！',
								icon: 'none'
							})
							_this.mediateInfo = JSON.parse(resResult)
							_this.mediateInfoShow = true
							_this.scanshow = false
						} else {
							uni.showToast({
								title: '二维码信息错误！',
								icon: 'none'
							})
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
				this.mediateInfoShow = false
				this.scanshow = true
			},
			handleConfirm() {
				var _this = this
				this.$refs.mediateInfoData.setRules(_this.rulesLink);
				this.$refs.mediateInfoData.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '正在操作中...'
						})
						let openid = uni.getStorageSync('openId')
						var postSta = {
							bindUserName: _this.dataTempLink.bindUserName,
							bindUserMobile: _this.dataTempLink.bindUserMobile,
							shareOpenid: _this.dataTempLink.shareOpenid,
							openid: openid,
							registrationId: _this.mediateInfo.registrationId,
							userId: _this.mediateInfo.userid
						}
						DisputesResolvePlatform.linkMediateOnWechat(postSta).then(res => {
							if (res.data.code === 0) {
								if (res.data.data === 0) {
									setTimeout(function() {
										uni.showToast({
											title: '确认关联操作成功！',
											icon: 'none'
										})
									}, 1500)
								} else {
									setTimeout(function() {
										uni.showToast({
											title: '已进行关联，无需重复关联！',
											icon: 'none'
										})
									}, 1500)
								}
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 3000)
								uni.hideLoading()
							} else {
								setTimeout(function() {
									uni.showToast({
										title: '操作失败: 请检查后重试',
										icon: 'none'
									})
								}, 1500)
								uni.hideLoading()
							}
						})
					} else {
						console.log('验证失败');
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.scan-head {
		height: 5vh;
		line-height: 5vh;
		font-size: 1.2rem;
		text-align: center;
		font-weight: 900;
		color: #FFFFFF;
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
		background: url(../../../statics/img/smqr.png);
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
		line-height: 6vh;
		font-size: 1rem;
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
