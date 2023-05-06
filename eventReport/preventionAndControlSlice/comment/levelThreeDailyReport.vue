<template>
	<view>
		<view style="height: 80rpx;line-height: 80rpx;text-align: center;">
			{{ dataTemp.reportTime }}片长日报
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
			<u-divider>日常工作</u-divider>
			<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
				<u-form-item label="村小组巡逻出勤人数:" :required="true" prop="attendance">
					<u-number-box v-model="dataTemp.attendance" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-collapse ref="attendanceView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="村小组巡逻出勤人数填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li"><view class="text">{{ item.orgName }}</view>{{item.attendance}} 人</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="村小组巡逻次数:" :required="true" prop="patrolTimes">
					<u-number-box v-model="dataTemp.patrolTimes" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">次</text>
				</u-form-item>
				<u-collapse ref="patrolTimesView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="村小组巡逻次数填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.patrolTimes}} 次</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="核查人员:" :required="true" prop="peopleNumber">
					<u-number-box v-model="dataTemp.peopleNumber" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-collapse ref="peopleNumberView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="核查人员填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.peopleNumber}} 人</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="核查车辆:" :required="true" prop="carNumber">
					<u-number-box v-model="dataTemp.carNumber" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">辆</text>
				</u-form-item>
				<u-collapse ref="carNumberView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="核查车辆填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.carNumber}} 辆</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="入户走访:" :required="true" prop="houseVsit">
					<u-number-box v-model="dataTemp.houseVsit" 
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">户</text>
				</u-form-item>
				<u-collapse ref="houseVsitView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="入户走访填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.houseVsit}} 户</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="宣传教育:" :required="true" prop="publicityAndEducation">
					<u-number-box v-model="dataTemp.publicityAndEducation"
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-collapse ref="publicityAndEducationView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="宣传教育填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.publicityAndEducation}} 人</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="发放宣传手册:" :required="true" prop="providePublicityBrochure">
					<u-number-box v-model="dataTemp.providePublicityBrochure" 
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">份</text>
				</u-form-item>
				<u-collapse ref="providePublicityBrochureView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="发放宣传手册填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.providePublicityBrochure}} 份</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item label="张贴通告:" :required="true" prop="pasteBulletin">
					<u-number-box v-model="dataTemp.pasteBulletin" 
						:min="0" :max="100" :input-width="250" :step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">份</text>
				</u-form-item>
				<u-collapse ref="pasteBulletinView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="张贴通告填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.pasteBulletin}} 份</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-divider>村民动态监测</u-divider>
			<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
				<u-form-item label="非本村可疑外来人员:" :required="true" prop="markedNum">
					<u-number-box v-model="dataTemp.markedNum" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="深夜外出村民:" :required="true" prop="leaveNum">
					<u-number-box v-model="dataTemp.leaveNum" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="境外务工人员:" :required="true" prop="overseasNum">
					<u-number-box v-model="dataTemp.overseasNum" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="有境外务工史人员:" :required="true" prop="hisOverseasNum">
					<u-number-box v-model="dataTemp.hisOverseasNum" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-divider>案件情况</u-divider>
			<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
				<u-form-item label="案件数量:" :required="true" prop="eventNum">
					<u-number-box v-model="dataTemp.eventNum" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">件</text>
				</u-form-item>
				<u-form-item label="涉案人数:" :required="true" prop="involvedNum">
					<u-number-box v-model="dataTemp.involvedNum" :min="0" :max="100" :input-width="250"
						:step="1" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
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
				showItemList: [],
				areaDailyList: [],
				houseSelectShow: false,
				dataTemp: {
					attendance: 0,
					carNumber: 0,
					eventNum: 0,
					hisOverseasNum: 0,
					houseVsit: 0,
					involvedNum: 0,
					leaveNum: 0,
					markedNum: 0,
					overseasNum: 0,
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
				currentAttendance: 1,
				completelyHeadStyle: {
					height: '40upx',
					fontSize: 'small',
					color: '#AAAAAA'
				}
			}
		},
		onShow() {
			this.getRecentlyReport()
		},
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
				uni.showLoading({
					title: '加载中',
				})
				this.showItemList = []
				PreventionAndControlSlice.getLevelThreeAreaLeaderReport().then(res => {
					if (res.data.data != null) {
						this.showItemList.push({ areaDailyList: res.data.data.areaDailyList })
						this.dataTemp.attendance = res.data.data.attendance
						this.dataTemp.carNumber = res.data.data.carNumber
						this.dataTemp.eventNum = res.data.data.eventNum
						this.dataTemp.hisOverseasNum = res.data.data.hisOverseasNum
						this.dataTemp.houseVsit = res.data.data.houseVsit
						this.dataTemp.involvedNum = res.data.data.involvedNum
						this.dataTemp.leaveNum = res.data.data.leaveNum
						this.dataTemp.markedNum = res.data.data.markedNum
						this.dataTemp.overseasNum = res.data.data.overseasNum
						this.dataTemp.pasteBulletin = res.data.data.pasteBulletin
						this.dataTemp.patrolTimes = res.data.data.patrolTimes
						this.dataTemp.peopleNumber = res.data.data.peopleNumber
						this.dataTemp.providePublicityBrochure = res.data.data.providePublicityBrochure
						this.dataTemp.publicityAndEducation = res.data.data.publicityAndEducation
						uni.hideLoading()
					} else {
						this.dataTemp.attendance = 0
						this.dataTemp.carNumber = 0
						this.dataTemp.eventNum = 0
						this.dataTemp.hisOverseasNum = 0
						this.dataTemp.houseVsit = 0
						this.dataTemp.involvedNum = 0
						this.dataTemp.leaveNum = 0
						this.dataTemp.markedNum = 0
						this.dataTemp.overseasNum = 0
						this.dataTemp.pasteBulletin = 0
						this.dataTemp.patrolTimes = 0
						this.dataTemp.peopleNumber = 0
						this.dataTemp.providePublicityBrochure = 0
						this.dataTemp.publicityAndEducation = 0
						uni.hideLoading()
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
						PreventionAndControlSlice.saveLevelThreeAreaLeaderReport(this.dataTemp).then(res => {
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
			height: 60upx;
			padding: 0 2%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;
			&.noborder {
				border-bottom: 0
			}
			.text {
				padding-left: 10upx;
				width: 88%;
				font-size: small;
				color: #AAAAAA;
			}
		}
	}
</style>
