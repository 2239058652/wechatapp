<template>
	<view>
		<view style="height: 80rpx;line-height: 80rpx;text-align: center;">
			{{ dataTemp.reportTime }}平安日报
		</view>
		<view v-if="pointList.length > 1" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="填报单位" :required="true">
					<u-input type="select" :select-open="pointSelectShow" :border="true" v-model="dataTemp.pointName"
					 @click="pointSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="id" label-name="name" :list="pointList" v-model="pointSelectShow"
					 @confirm="pointSelectConfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-divider>出勤情况</u-divider>
			<view class="header-index">出勤总人数</view>
			<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
				<u-form-item label="出勤总人数:" :required="true" prop="attendance">
					<u-number-box v-model="dataTemp.attendance" 
						:min="1" :max="10000" :input-width="250"
						:step="1" :input-height="70" @change="attendanceChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<view class="header-index">出勤人员明细</view>
				<u-form-item label="州级机关干部:" prop="attendanceCityOfficials">
					<u-number-box v-model="dataTemp.attendanceCityOfficials" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="市级机关干部:" prop="attendanceCountyOfficials">
					<u-number-box v-model="dataTemp.attendanceCountyOfficials" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="公安警察:" prop="attendancePolice">
					<u-number-box v-model="dataTemp.attendancePolice" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="移民警察:" prop="attendanceImmigrationPolice">
					<u-number-box v-model="dataTemp.attendanceImmigrationPolice" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="乡镇本级民兵:" prop="attendanceMilitia">
					<u-number-box v-model="dataTemp.attendanceMilitia" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="对口支援力量:" prop="attendanceSupport">
					<u-number-box v-model="dataTemp.attendanceSupport" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="援边突击队:" prop="attendanceCommando">
					<u-number-box v-model="dataTemp.attendanceCommando" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="村民:" prop="attendanceVillager">
					<u-number-box v-model="dataTemp.attendanceVillager" 
						:min="0" :max="dataTemp.attendance" :input-width="250"
						:step="1" :input-height="70" @change="currentDetailChange">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-divider>巡逻情况</u-divider>
			<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="本防控点巡逻次数:" :required="true" prop="patrolTimes">
					<u-number-box v-model="dataTemp.patrolTimes" :min="0" :max="10000"
						:step="1" :input-width="250"  :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">次</text>
				</u-form-item>
				<u-form-item label="本防控点巡逻情况:" prop="patrolDetail">
					<u-input v-model="dataTemp.patrolDetail" type="textarea"
						height="180" :border="true"
						placeholder="请填写巡逻情况"
					/>
				</u-form-item>
				<u-form-item label="一级段长巡逻次数:" :required="true" prop="patrolTimesLevelOne">
					<u-number-box v-model="dataTemp.patrolTimesLevelOne" :min="0" :max="10000"
						:step="1" :input-width="250"  :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">次</text>
				</u-form-item>
				<u-form-item label="二级段长巡逻次数:" :required="true" prop="patrolTimesLevelTwo">
					<u-number-box v-model="dataTemp.patrolTimesLevelTwo" :min="0" :max="10000"
						:step="1" :input-width="250"  :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">次</text>
				</u-form-item>
				<u-form-item label="三级段长巡逻次数:" :required="true" prop="patrolTimesLevelThree">
					<u-number-box v-model="dataTemp.patrolTimesLevelThree" :min="0" :max="10000"
						:step="1" :input-width="250"  :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">次</text>
				</u-form-item>
				<u-form-item label="过往人员常驻人口数:" :required="true" prop="permanentPopulation">
					<u-number-box v-model="dataTemp.permanentPopulation" :min="0" :max="10000"
						:step="1" :input-width="250" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="过往人员流动人口数:" :required="true" prop="floatingPopulation">
					<u-number-box v-model="dataTemp.floatingPopulation" :min="0" :max="10000"
						:step="1" :input-width="250" :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">人</text>
				</u-form-item>
				<u-form-item label="过往车辆数:" :required="true" prop="carNumber">
					<u-number-box v-model="dataTemp.carNumber" :min="0" :max="10000"
						:step="1" :input-width="250"  :input-height="70">
					</u-number-box> <text style="margin-left: 5%;">辆</text>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
	</view>
</template>

<script>
	import DictionaryApi from '../../../api/dictionary.js'
	import StrongAndSolidProof from '../../../api/strongAndSolidProof.js'
	import RoleJS from '../../../utils/role.js'
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
				hasAuth: false,
				pointList: [],
				pointSelectShow: false,
				dataTemp: {
					attendance: 1,
					attendanceCityOfficials: 0,
					attendanceCommando: 0,
					attendanceCountyOfficials: 0,
					attendanceDetail: '',
					attendanceImmigrationPolice: 0,
					attendanceMilitia: 0,
					attendanceOther: 0,
					attendancePolice: 0,
					attendanceSupport: 0,
					attendanceVillager: 0,
					carNumber: 0,
					coordinate: {
						lat: '',
						lng: ''
					},
					floatingPopulation: 0,
					mapType: 2,
					openid: '',
					patrolDetail: '',
					patrolTimesLevelOne: 0,
					patrolTimesLevelThree: 0,
					patrolTimesLevelTwo: 0,
					peopleNumber: 0,
					permanentPopulation: 0,
					pointName: '',
					pointId: '',
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
			this.pointList = uni.getStorageSync('borderUserpointOrgInfos')
			this.dataTemp.pointName = this.pointList[0].name
			this.dataTemp.pointId = this.pointList[0].id
			if (this.dataTemp.pointId != '') {
				this.getRecentlyReport()
			}
			this.getLocation()
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 出勤人数监听
			attendanceChange(e) {
				let detialTotal = this.dataTemp.attendanceCityOfficials + this.dataTemp.attendanceCountyOfficials +
					this.dataTemp.attendanceCommando +this.dataTemp.attendanceImmigrationPolice +
					this.dataTemp.attendanceMilitia + this.dataTemp.attendancePolice +
					this.dataTemp.attendanceSupport + this.dataTemp.attendanceVillager
				if(e.value < detialTotal) {
					uni.showToast({
						title: '请检查，当前修改出勤总人数数量小于于所填写出勤人员明细数量总和',
						icon: 'none'
					})
				}
			},
			currentDetailChange() {
				// this.fetchDetialTotal()
			},
			fetchDetialTotal() {
				let detialTotal = this.dataTemp.attendanceCityOfficials + this.dataTemp.attendanceCountyOfficials +
					this.dataTemp.attendanceCommando +this.dataTemp.attendanceImmigrationPolice +
					this.dataTemp.attendanceMilitia + this.dataTemp.attendancePolice +
					this.dataTemp.attendanceSupport + this.dataTemp.attendanceVillager
				if (this.dataTemp.attendance > detialTotal) {
					this.currentAttendance = this.dataTemp.attendance - detialTotal
				} else if (this.dataTemp.attendance == detialTotal) {
					this.currentAttendance = 0
				}
			},
			// 防控点选择
			pointSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.pointName = val.label
					this.dataTemp.pointId = val.value
					this.getRecentlyReport()
				})
			},
			// 获取最近一次填报数据
			getRecentlyReport() {
				StrongAndSolidProof.getRecentlyReport(this.dataTemp.pointId).then(res => {
					if (res.data.data != null) {
						this.dataTemp.attendance = res.data.data.attendance
						this.dataTemp.attendanceCityOfficials = res.data.data.attendanceCityOfficials
						this.dataTemp.attendanceCommando = res.data.data.attendanceCommando
						this.dataTemp.attendanceCountyOfficials = res.data.data.attendanceCountyOfficials
						this.dataTemp.attendanceImmigrationPolice = res.data.data.attendanceImmigrationPolice
						this.dataTemp.attendanceMilitia = res.data.data.attendanceMilitia
						this.dataTemp.attendanceOther = res.data.data.attendanceOther
						this.dataTemp.attendancePolice = res.data.data.attendancePolice
						this.dataTemp.attendanceSupport = res.data.data.attendanceSupport
						this.dataTemp.attendanceVillager = res.data.data.attendanceVillager
						this.dataTemp.carNumber = res.data.data.carNumber
						this.dataTemp.floatingPopulation = res.data.data.floatingPopulation
						this.dataTemp.patrolTimes = res.data.data.patrolTimes
						this.dataTemp.patrolTimesLevelOne = res.data.data.patrolTimesLevelOne
						this.dataTemp.patrolTimesLevelThree = res.data.data.patrolTimesLevelThree
						this.dataTemp.patrolTimesLevelTwo = res.data.data.patrolTimesLevelTwo
						this.dataTemp.peopleNumber = res.data.data.peopleNumber
						this.dataTemp.permanentPopulation = res.data.data.permanentPopulation
						if(res.data.data.reportTime == new moment().format('YYYY-MM-DD')) {
							uni.showModal({
								title: '温馨提示',
								content: '您已经填报过' + res.data.data.reportTime + '的平安日报，再次填报将覆盖原来的填报记录内容，如要查看已填报记录内容请进入“我的填报”进行查看。',
								confirmText: "知道了",
								showCancel: false
							})
						}
					} else {
						this.dataTemp.attendance = 1
						this.dataTemp.attendanceCityOfficials = 0
						this.dataTemp.attendanceCommando = 0
						this.dataTemp.attendanceCountyOfficials = 0
						this.dataTemp.attendanceImmigrationPolice = 0
						this.dataTemp.attendanceMilitia = 0
						this.dataTemp.attendanceOther = 0
						this.dataTemp.attendancePolice = 0
						this.dataTemp.attendanceSupport = 0
						this.dataTemp.attendanceVillager = 0
						this.dataTemp.carNumber = 0
						this.dataTemp.floatingPopulation = 0
						this.dataTemp.patrolTimes = 0
						this.dataTemp.patrolTimesLevelOne = 0
						this.dataTemp.patrolTimesLevelThree = 0
						this.dataTemp.patrolTimesLevelTwo = 0
						this.dataTemp.peopleNumber = 0
						this.dataTemp.permanentPopulation = 0
					}
				})
			},
			// 保存平安报送数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				if (this.dataTemp.attendance != (this.dataTemp.attendanceCityOfficials +
					this.dataTemp.attendanceCountyOfficials + this.dataTemp.attendanceCommando +
					this.dataTemp.attendanceImmigrationPolice + this.dataTemp.attendanceMilitia +
					this.dataTemp.attendancePolice + this.dataTemp.attendanceSupport + this.dataTemp.attendanceVillager)) {
					uni.showToast({
						title: '请检查，当前添加出勤人员数量不等于所填写出勤人员明细数量总和',
						icon: 'none'
					})
				} else if (this.dataTemp.carNumber > (this.dataTemp.permanentPopulation +this.dataTemp.floatingPopulation)) {
					uni.showToast({
						title: '请检查，过往车辆数不应大于过往人员常驻人口数和过往人员流动人口数之和',
						icon: 'none'
					})
				} else {
					this.$refs.uForm.validate(valid => {
						_this.dataTemp.openid = openid
						if (valid) {
							_this.buttonLoading = true
							StrongAndSolidProof.addBorderReport(this.dataTemp).then(res => {
								console.log('报送结果', res)
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
							console.log('验证通过');
							console.log(this.dataTemp)
						} else {
							console.log('验证失败');
							_this.buttonLoading = false
						}
					});
				}
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
