<template>
	<view style="min-height: 100vh;">
		<!-- <view class="scan-head">数字认证在线识别</view> -->
		<view @click="handleIdentification()">
			<view class="head-img">
				<view class="scan" />
			</view>
			<view v-if="!userInfoShow" style="padding: 10rpx 50rpx 10rpx 50rpx;">
				<view>注意事项：</view>
					<view>1、本功能仅用于扫描景洪市综治信息系统微信小程序内人员数字认证二维码信息使用；</view>
					<view>2、使用时请正确扫描景洪市综治信息系统微信小程序内人员数字认证二维码，非正确二维码系统会进行“二维码信息错误”提示；</view>
					<view>3、扫描识别信息仅用于系统识别身份、记录通行使用，请勿在其他非工作范围内使用；</view>
					<view>4、如遇到特殊情况可在扫描后点击查看详情进行查验说明补充填写。；</view>
			</view>
		</view>
		<view v-if="userInfoShow" class="user-info">
			<view class="title-show">基本信息</view>
			<view class="user-box">
				<view style="margin: 2%;">
					<view>姓名:{{ userInfo.name }} </view>
					<view>身份证号:{{ userInfo.idCard }} </view>
					<view>联系方式 :{{ userInfo.mobile }} </view>
					<view>登记地址:{{ userInfo.residenceAddress }} </view>
				</view>
			</view>
		</view>
		<view v-if="userInfo.id !== ''" style="margin: 30px 30rpx 0 30rpx;">
			<button class="login-phone" @click="viewDetail">查看详情</button>
		</view>
	</view>
</template>
<script>
	import DigitalCertificates from '@/api/digitalCertificates.js'
	import moment from 'moment'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				userInfoShow: false,
				userInfo: {
					id: '',
					name: '',
					idCard: '',
					mobile: '',
					residenceAddress: ''
				},
				coordinate: {
					lat: '',
					lng: ''
				},
				pointList: [],
				reportTime: '',
				workerId: '',
				workerOrgId: ''
			};
		},
		onLoad() {
			this.workerId = uni.getStorageSync('borderUserid')
			this.pointList = uni.getStorageSync('borderUserpointOrgInfos')
			this.workerOrgId = this.pointList[0].id
			this.reportTime = new moment().format('YYYY-MM-DD HH:mm:ss')
			this.getLocation()
		},
		methods: {
			handleIdentification() {
				var _this = this
				wx.scanCode({
					success: (res) => {
						var resResult = res.result.trim()
						if (JSON.parse(resResult).id !== undefined) {
							const postData = {
								residentId: _this.decrypt(JSON.parse(resResult).id),
								openId: _this.decrypt(JSON.parse(resResult).openId)
							}
							DigitalCertificates.viewWechatUserInfo(postData).then(resPonse => {
								_this.userInfo = resPonse.data.data
								_this.userInfoShow = true
							})
							uni.showToast({
								title: '识别成功！！',
								icon: 'none'
							})
							setTimeout(function() {
								_this.addCheckPassPost()
							}, 1500)
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
			addCheckPassPost() {
				var _this = this
				if (_this.coordinate.lat === '') {
					_this.coordinate.lat = '22.00008',
					_this.coordinate.lng = '100.77163'
				}
				const checkData = {
					coordinate: _this.coordinate,
					mapType: 2,
					remark: '',
					reportTime: _this.reportTime,
					residentId: _this.userInfo.id,
					workerId: _this.workerId,
					workerOrgId: _this.workerOrgId
				}
				DigitalCertificates.addCheckPass(checkData).then(res => {
					// console.log(res)
				})
			},
			getLocation() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.coordinate.lat = res.latitude
						_this.coordinate.lng = res.longitude
					}
				});
			},
			viewDetail() {
				var _this = this
				uni.navigateTo({
					url: '../userInfo/index?residentId=' + _this.userInfo.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scan-head {
		height: 4vh;
		line-height: 4vh;
		font-size: 1.2rem;
		text-align: center;
		font-weight: 800;
	}
	.head-img {
		padding: 25rpx
	}
	.scan {
		background: url(../staticrz/img/smqr.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 320rpx;
		width: 100%;
	}
	.user-info {
		margin: 0% 3% 0% 3%;
	}
	.title-show {
		text-align: center;
		font-size: large;
		font-weight: 700;
	}
	.user-box {
		margin: 5rpx 0 10rpx 0;
		border: 5rpx #ececec solid;
		border-radius: 20rpx;
		line-height: 5vh;
		color: #000000;
		box-shadow:2px 2px 2px 2px #bbb;
	}
	.login-phone {
		background-color: #1261d4;
		color: #FFFFFF;
	}
</style>
