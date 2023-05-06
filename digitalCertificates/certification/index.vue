<template>
	<view class="user-body">
		<view style="background-color: #FFFFFF;min-height: 95vh;">
			<!-- 微信信息：头像、昵称 -->
			<view class="wxuserinfo-head">
				<view class="wxuserinfo-avatar">
					<open-data  type="userAvatarUrl"></open-data>
				</view>
				<view v-if="loginStatus !== 3" class="wxuserinfo-nichen">
					<open-data type="userNickName"></open-data>
				</view>
				<view v-if="loginStatus === 3" class="userinfo-name">
					<view class="user-name" style="line-height: 88rpx;">{{ userInfo.name }}</view>
					<view class="user-idcard">{{ userInfo.strcard }}</view>
				</view>
			</view>
			<!-- 间隔槽 -->
			<view><u-gap height="10" bg-color="#ececec" /></view>
			<!-- 从未登录过系统信息 -->
			<view v-if="loginStatus === 1">
				<view class="not-login" />
				<view>
					<view style="text-align: center;font-size: 1.2rem;font-weight: 800;">还未申领“傣乡畅行码”</view>
					<view style="text-align: center;font-size: 1rem;color: #bbb">申领后可查看数字身份证信息</view>
				</view>
				<view style="margin: 80px 30rpx 0 30rpx;">
					<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="login-phone" :loading="buttonLoading">申领</button>
				</view>
			</view>
			<!-- 登录过系统但是未认证 -->
			<view v-if="loginStatus === 2">
				<!-- <view class="not-regist" /> -->
				<!-- 时间信息 -->
				<view class="userInfo-timeDate">
					<view class="date">{{ currentDate }}</view>
					<view class="time">{{ currentTime }}</view>
				</view>
				<!-- 用户二维码 -->
				<view class="qrimg">
					<tki-qrcode cid="qrcode2" ref="qrcode2" :val="val" :size="size"
					:background="background" :foreground="foreground" :pdground="pdground" :icon="icon"
					:onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
				</view>
				<view>
					<view style="text-align: center;font-size: 1.2rem;font-weight: 800;">您的“傣乡畅行码”已经申领完成</view>
					<view style="text-align: center;font-size: 1rem;color: #bbb">更多应用需要进一步完善信息</view>
				</view>
				<view style="margin: 80px 30rpx 0 30rpx;">
					<button class="login-phone" @click="linkCertification">继续完善信息</button>
				</view>
			</view>
			<!-- 已认证 -->
			<view v-if="loginStatus === 3">
				<!-- 时间信息 -->
				<view class="userInfo-timeDate">
					<view class="date">{{ currentDate }}</view>
					<view class="time">{{ currentTime }}</view>
				</view>
				<!-- 用户二维码 -->
				<view class="qrimg">
					<tki-qrcode cid="qrcode2" ref="qrcode2" :val="val" :size="size"
					:background="background" :foreground="foreground" :pdground="pdground" :icon="icon"
					:onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
				</view>
				<view style="width: 100%;text-align: center;margin-top: 18rpx;color: #1261D4;">状态正常</view>
				<view class="user-info">
					<view class="user-box">
						<view style="margin: 2%;">
							<view style="width: 100%;display: flex;">
								<view style="width: 55%;">
									<view>姓名:{{ userInfo.name }} </view>
									<view>性别:{{ userInfo.gender }} </view>
									<view>年龄:{{ userInfo.age }} </view>
									<view>电话:{{ userInfo.mobile }} </view>
								</view>
								<view style="width: 45%;">
									<image
										:src="imgPath"
										mode="aspectFill"
										:lazy-load="true"
										@load="onoff='1'"
										style="height: 24vh;border-radius: 10rpx;"
									/>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="margin: 28rpx 30rpx 20rpx 30rpx;">
					<button class="login-phone" @click="linkIndex">综治信息系统</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import DigitalCertificates from '@/api/digitalCertificates.js'
	import moment from 'moment'
	import tkiQrcode from '../common/components/tki-qrcode/tki-qrcode.vue'
	import FileApi from '@/api/fileupload.js'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		components: {
			tkiQrcode
		},
		data() {
			return {
				loginStatus: '',
				currentDate: '',
				currentTime: '',
				userInfo: {},
				buttonLoading: false,
				openId: '',
				query: {
					openId: ''
				},
				val: '待识别', // 要生成的二维码值
				size: 320, // 二维码大小
				unit: 'upx', // 单位
				background: '#ffffff', // 背景色
				foreground: '#1261d4', // 前景色
				pdground: '#009999', // 角标色
				icon: '',
				// icon: 'https://fangxincan.oss-cn-hangzhou.aliyuncs.com/20210604/a4bbd2253c234041b5d6492f65034024-exchange.png',
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				residentId: '',
				accountMobile: '',
				imgPath: ''
			}
		},
		onShow() {
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
			this.currentTime = new moment().format('HH:mm:ss')
			this.currentDate = new moment().format('YYYY-MM-DD')
			this.fetchLoginStatus()
		},
		onLoad() {},
		methods: {
			// 计算年龄
			getAge(birthday){   
			    var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);     
			    if(r==null)return   false;     
			    var d= new Date(r[1],r[3]-1,r[4]);
			    if(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]){   
			        var date = new Date();
			        var Y   =   date.getFullYear() - r[1];
			        var M = date.getMonth() + 1 - r[3];
			        var D = date.getDate();
			        if(parseInt(D) - parseInt(r[4]) < 0){
			            M--;
			            if(M<0){
			                Y--;
			                M = 11;
			            }
			        }
			        if(M<0){
			            Y--;
			            M = 11;
			        }
			        return (Y + M);   
			    }   
			    return("输入的日期格式错误！");   
			},
			// 获取当前用户注册认证信息
			fetchLoginStatus() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				let openId = uni.getStorageSync('openId')
				_this.query.openId = openId
				DigitalCertificates.userResidentWechat(_this.query.openId).then(res => {
					if (res.data.code == 0) {
						if(res.data.data.expand.status === 0) {
							_this.residentId = res.data.data.expand.id
							_this.loginStatus = 2
							this.$nextTick(function() {
								const scanData = {
									id: _this.encrypt(res.data.data.expand.id),
									account: _this.encrypt(res.data.data.expand.account),
									mobile: _this.encrypt(_this.accountMobile)
								}
								_this.val = JSON.stringify(scanData)
							})
						} else {
							const postData = {
								openId: openId,
								residentId: res.data.data.expand.id
							}
							DigitalCertificates.viewWechatUserInfo(postData).then(resPonse => {
								_this.userInfo = resPonse.data.data
								this.$nextTick(function() {
									FileApi.downloadFileByUni(_this.userInfo.photoFile).then(i => {
										_this.imgPath = i[1].tempFilePath
									})
								})
								var strcard = _this.userInfo.idCard.replace(/^(.{2})(?:\d+)(.{2})$/,"$1**************$2")
								_this.userInfo.strcard = strcard
								_this.userInfo.age = _this.getAge(_this.userInfo.birthday)
								this.$nextTick(function() {
									const scanData = {
										id: _this.encrypt(_this.userInfo.id),
										openId: _this.encrypt(_this.userInfo.openId)
									}
									_this.val = JSON.stringify(scanData)
								})
								_this.loginStatus = 3
							})
						}
					} else {
						_this.loginStatus = 1
					}
					uni.hideLoading()
				})
			},
			// 获取用户手机号、解密、注册
			getPhoneNumber(e) {
				var _this = this
				if (e.detail.errMsg.indexOf('ok') !== -1) {
					let postOpenId = uni.getStorageSync('openId')
					const postData = {
						openId: postOpenId,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}
					DigitalCertificates.saveMediateAdvisory(postData).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: '授权成功',
								icon: 'none'
							})
							_this.accountMobile = res.data.data.purePhoneNumber
							const registData = {
								mobile: res.data.data.purePhoneNumber,
								openId: postOpenId
							}
							DigitalCertificates.wechatRegist(registData).then(response => {
								if (response.data.code == 0) {
									uni.showToast({
										title: '登录成功，请认证',
										icon: 'none'
									})
									_this.residentId = response.data.data
									_this.fetchLoginStatus()
									// uni.showModal({
									// 	title: '温馨提示',
									// 	content: '下一步将进行实名认证，需要用到您的身份证相关材料以及进行人脸核身操作，是否确认继续操作？',
									// 	success: function(i) {
									// 		if (i.confirm == true) {
									// 			uni.navigateTo({
									// 				url: './personnelInformation?residentId=' + _this.residentId
									// 			})
									// 		} else {
												
									// 		}
									// 	}
									// })
								} else {
									uni.showToast({
										title: '登录失败: 请检查后重试',
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})
						} else {
							uni.showToast({
								title: '授权失败: 请检查后重试',
								icon: 'none'
							})
							_this.buttonLoading = false
						}
					})
				} else {
					uni.showToast({
						title: '授权失败: 请检查后重试',
						icon: 'none'
					})
					_this.buttonLoading = false
				}
			},
			// 二维码信息显示
			qrR(res) {
				this.src = res
			},
			linkCertification() {
				var _this = this
				uni.navigateTo({
					url: './personnelInformation?residentId=' + _this.residentId
				})
				// uni.showModal({
				// 	title: '温馨提示',
				// 	content: '下一步将进行实名认证，需要用到您的身份证相关材料以及进行人脸核身操作，是否确认继续操作？',
				// 	success: function(i) {
				// 		if (i.confirm == true) {
				// 			uni.navigateTo({
				// 				url: './personnelInformation?residentId=' + _this.residentId
				// 			})
				// 		} else {
				// 			_this.fetchLoginStatus()
				// 		}
				// 	}
				// })
			},
			linkIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.user-body {
		background-color: #1261d4;
		padding: 15upx 30upx;
		min-height: 100vh;
	}
	.wxuserinfo-head {
		width: 100%;
		display: flex;
	}
	.not-login {
		width: 38%;
		margin-left: 31%;
		background: url(../staticrz/img/wdl.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-top: 2vh;
		height: 23vh;
	}
	.not-regist {
		width: 38%;
		margin-left: 31%;
		background: url(../staticrz/img/wrz.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		margin-top: 2vh;
		height: 23vh;
	}
	.wxuserinfo-avatar {
		overflow:hidden;
		display: block;
		width: 118rpx;
		height: 118rpx;
		margin: 20rpx;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
	}
	.wxuserinfo-nichen {
		overflow:hidden;
		display: block;
		height: 118rpx;
		line-height: 118rpx;
		margin: 20rpx;
		font-size: 1.2rem;
		font-weight: 800;
	}
	.login-phone {
		background-color: #1261d4;
		color: #FFFFFF;
	}
	.userinfo-name {
		overflow:hidden;
		display: block;
		height: 118rpx;
		margin: 20rpx;
		font-size: 1.2rem;
		font-weight: 800;
		.user-name {
			line-height: 88rpx;
		}
		.user-idcard {
			line-height: 30rpx;
			font-size: 0.95rem;
			color: #bbb;
			font-weight: 200;
		}
	}
	.userInfo-timeDate {
		width: 100%;
		margin-top: 18rpx;
		display: flex;
		height: 58rpx;
		line-height: 58rpx;
		.time {
			width: 50%;
			line-height: 58rpx;
			text-align: center;
			font-size: 1.2rem;
			font-weight: 800;
			color: #1261d4;
		}
		.date {
			width: 50%;
			line-height: 58rpx;
			text-align: center;
			font-size: 1.2rem;
			font-weight: 800;
			color: #1261d4;
		}
	}
	.qrimg {
		margin-top: 18rpx;
		display: flex;
		justify-content: center;
	}
	.user-info {
		margin: 3% 3% 0% 3%;
	}
	.user-box {
		margin: 5rpx 0 10rpx 0;
		border: 5rpx #ececec solid;
		border-radius: 20rpx;
		line-height: 6vh;
		color: #000000;
		box-shadow:2px 2px 2px 2px #bbb;
	}
</style>
