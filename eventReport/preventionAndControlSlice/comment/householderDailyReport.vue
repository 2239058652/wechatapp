<template>
	<view>
		<view style="height: 80rpx;line-height: 80rpx;text-align: center;">
			{{ dataTemp.reportTime }}户长日报
		</view>
		<view v-if="houseList.length > 1" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="填报单位" :required="true">
					<u-input type="select" :select-open="houseSelectShow" :border="true" v-model="dataTemp.houseName"
					 @click="houseSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="id" label-name="name" :list="houseList" v-model="houseSelectShow"
					 @confirm="houseSelectConfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
				<u-form-item label="出勤人数:" :required="true" prop="attendance">
					<u-number-box v-model="dataTemp.attendance" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="巡逻次数:" :required="true" prop="patrolTimes">
					<u-number-box v-model="dataTemp.patrolTimes" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">次</text>
				</u-form-item>
				<u-form-item label="核查人员:" :required="true" prop="peopleNumber">
					<u-number-box v-model="dataTemp.peopleNumber" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="核查车辆:" :required="true" prop="carNumber">
					<u-number-box v-model="dataTemp.carNumber" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">辆</text>
				</u-form-item>
				<u-form-item label="入户走访:" :required="true" prop="houseVsit">
					<u-number-box v-model="dataTemp.houseVsit" 
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">户</text>
				</u-form-item>
				<u-form-item label="宣传教育:" :required="true" prop="publicityAndEducation">
					<u-number-box v-model="dataTemp.publicityAndEducation"
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="发放宣传手册:" :required="true" prop="providePublicityBrochure">
					<u-number-box v-model="dataTemp.providePublicityBrochure" 
						:min="0" :max="100" :input-width="250":step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">份</text>
				</u-form-item>
				<u-form-item label="张贴通告:" :required="true" prop="pasteBulletin">
					<u-number-box v-model="dataTemp.pasteBulletin" 
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">份</text>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
	</view>
</template>

<script>
	import PreventionAndControlSlice from '../../../api/preventionAndControlSlice.js'
	import moment from 'moment'
	export default {
		components: {},
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				reportDateShow: false,
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '100rpx'
				},
				houseList: [],
				houseSelectShow: false,
				dataTemp: {
					attendance: 0,
					carNumber: 0,
					houseVsit: 0,
					pasteBulletin: 0,
					patrolTimes: 0,
					peopleNumber: 0,
					providePublicityBrochure: 0,
					publicityAndEducation: 0,
					coordinate: {
						lat: '',
						lng: ''
					},
					mapType: 2,
					openid: '',
					houseName: '',
					orgId: '',
					reportTime: ''
				},
				rules: {
					reportTime: [{
						required: true,
						message: '请选择填报时间',
						trigger: ['change', 'blur'],
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				currentAttendance: 1
			}
		},
		onShow() {},
		created() {
			this.dataTemp.mapType = this.$MapType
			this.dataTemp.reportTime = new moment().format('YYYY-MM-DD')
			this.dataTemp.orgId = uni.getStorageSync('borderUserorg').id
			if (this.dataTemp.orgId != '') {
				this.getRecentlyReport()
			}
			this.getLocation()
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 防控户选择（预留）
			houseSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.houseName = val.label
					this.dataTemp.orgId = val.value
					this.getRecentlyReport()
				})
			},
			// 获取最近一次填报数据
			getRecentlyReport() {
				PreventionAndControlSlice.getRecentlyHouseholderReport(this.dataTemp.orgId).then(res => {
					if (res.data.data != null) {
						this.dataTemp.attendance = res.data.data.attendance
						this.dataTemp.carNumber = res.data.data.carNumber
						this.dataTemp.houseVsit = res.data.data.houseVsit
						this.dataTemp.pasteBulletin = res.data.data.pasteBulletin
						this.dataTemp.patrolTimes = res.data.data.patrolTimes
						this.dataTemp.peopleNumber = res.data.data.peopleNumber
						this.dataTemp.providePublicityBrochure = res.data.data.providePublicityBrochure
						this.dataTemp.publicityAndEducation = res.data.data.publicityAndEducation
						if(res.data.data.reportTime == new moment().format('YYYY-MM-DD')) {
							uni.showModal({
								title: '温馨提示',
								content: '您已经填报过' + res.data.data.reportTime + '的户长日报，再次填报将覆盖原来的填报记录内容，如要查看已填报记录内容请进入“我的填报”进行查看。',
								confirmText: "知道了",
								showCancel: false
							})
						}
					} else {
						this.dataTemp.attendance = 0
						this.dataTemp.carNumber = 0
						this.dataTemp.houseVsit = 0
						this.dataTemp.pasteBulletin = 0
						this.dataTemp.patrolTimes = 0
						this.dataTemp.peopleNumber = 0
						this.dataTemp.providePublicityBrochure = 0
						this.dataTemp.publicityAndEducation = 0
					}
				})
			},
			// 报送数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				this.$refs.uForm.validate(valid => {
					_this.dataTemp.openid = openid
					if (valid) {
						_this.buttonLoading = true
						PreventionAndControlSlice.addHouseholderReport(this.dataTemp).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '填报成功，记得明日继续哦！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/main/main'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '报送失败:' + res.data.desc,
									icon: 'none'
								})
								_this.buttonLoading = false
							}
						})
					} else {
						_this.buttonLoading = false
					}
				});
			},
			getLocation() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.dataTemp.coordinate.lat = res.latitude
						_this.dataTemp.coordinate.lng = res.longitude
					}
				});
			},
			dateSelectConfirm(e) {
				this.dataTemp.reportTime = e.result
			},
			eventDateSelectConfirm(e) {
				this.eventDataTemp.reportTime = e.result
			}
		}
	}
</script>

<style lang="scss" scoped>
.form {
	padding: 20upx 40upx;
}
.report-viewarea {
	border-radius: 15px;
	border: 1px #909399 solid;
	margin:1% 2% 2% 2%;
	min-height: 350rpx;
	color: #000000;
}
.header-index {
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	width: 100%;
	background-color: #ececec;
}
</style>
