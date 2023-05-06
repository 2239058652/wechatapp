<template>
	<view style="min-height: 100vh;">
		<!-- 用户基本信息 -->
		<view class="user-info">
			<view class="show-title">基本信息</view>
			<view class="user-box">
				<view style="margin: 2%;">
					<view style="width: 100%;display: flex;">
						<view style="width: 70%;">
							<view>姓名:{{ userInfo.name }} </view>
							<view>性别:{{ userInfo.gender }} </view>
							<view>出生日期:{{ userInfo.birthday }} </view>
							<view>联系方式:{{ userInfo.mobile }} </view>
						</view>
						<view style="width: 30%;">
							<image
								:src="imgPath"
								mode="aspectFill"
								:lazy-load="true"
								@load="onoff='1'"
								style="height: 18vh;border-radius: 10rpx;"
							/>
						</view>
					</view>
					<view>身份证号:{{ userInfo.idCard }} </view>
					<view>登记地址:{{ userInfo.residenceAddress }} </view>
				</view>
			</view>
		</view>
		<u-form :model="checkData" ref="certificationFormData">
			<u-form-item prop="remark">
				<view style="width: 100%;margin: 0 20rpx 0 20rpx;">
					<u-input cursor-spacing="150" :border="true" type="textarea" height="80" v-model="checkData.remark" placeholder="请填写查验说明"/>
				</view>
			</u-form-item>
		</u-form>
		<view style="margin: 10px 30rpx 0 30rpx;">
			<button class="login-phone" @click="addCheckPassPost()">添加查验</button>
		</view>
		<!-- 通行记录 -->
		<view class="list-info">
			<view class="show-title">通行记录</view>
			<view v-for="item in checkRccordList" :key="item.id">
				<view class="list-content" @click="handleView(item)">
					<view style="margin: 2%;">
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">查验时间</view>
							<view style="width: 75%;text-align: left;">{{ item.reportTime }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">查验机构</view>
							<view style="width: 75%;text-align: left;">{{ item.workerOrgName }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">查验人</view>
							<view style="width: 75%;text-align: left;">{{ item.workerName }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import DigitalCertificates from '@/api/digitalCertificates.js'
	import FileApi from '@/api/fileupload.js'
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
				scanShow: true,
				userInfoShow: false,
				userInfo: {},
				imgPath: '',
				checkRccordList: [],
				residentId: '',
				coordinate: {
					lat: '',
					lng: ''
				},
				pointList: [],
				reportTime: '',
				workerId: '',
				workerOrgId: '',
				checkData: {
					remark: ''
				}
			};
		},
		onLoad(option) {
			this.residentId = option.residentId
			if (this.residentId !== '') {
				this.fetchLoad()
			}
			this.workerId = uni.getStorageSync('borderUserid')
			this.pointList = uni.getStorageSync('borderUserpointOrgInfos')
			this.workerOrgId = this.pointList[0].id
			this.reportTime = new moment().format('YYYY-MM-DD HH:mm:ss')
			this.getLocation()
		},
		methods: {
			fetchLoad() {
				var _this = this
				DigitalCertificates.getUserInfoMore(_this.residentId).then(res => {
					if (res.data.code === 0) {
						_this.userInfo = res.data.data.resident
						this.$nextTick(function() {
							FileApi.downloadFileByUni(_this.userInfo.photoFile).then(i => {
								_this.imgPath = i[1].tempFilePath
							})
						})
						_this.checkRccordList = res.data.data.records
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
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
					if (res.data.code === 0) {
						uni.showToast({
							title: '添加成功！！',
							icon: 'none'
						})
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					} else {
						uni.showToast({
							title: '添加失败',
							icon: 'none'
						})
					}
				})
			},
			handleView(e) {
				uni.navigateTo({
					url: '../accessRecords/view?id=' + e.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-info {
		margin: 0% 3% 0% 3%;
	}
	.user-box {
		margin: 5rpx 0 10rpx 0;
		border: 5rpx #ececec solid;
		border-radius: 20rpx;
		line-height: 5vh;
		color: #000000;
		box-shadow:2px 2px 2px 2px #bbb;
	}
	.show-title {
		text-align: center;
		font-size: 1.2rem;
		font-weight: 700;
	}
	.list-info {
		margin: 0% 3% 0% 3%;
	}
	.list-content {
		margin-top: 1vh;
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
