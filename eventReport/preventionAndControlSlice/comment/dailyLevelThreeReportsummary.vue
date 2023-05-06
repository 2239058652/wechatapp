<template>
	<view>
		<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">
			工作情况汇总
		</view>
		<view style="width: 80%;margin-left: 10%;">
			<u-form-item label="汇总日期:" label-width="130" prop="reportDate">
				<u-input type="select" :select-open="starTimeShow"
					v-model="query.reportDate" :border="true"
				 @click="starTimeShow = true" />
				<u-calendar v-model="starTimeShow" mode="date" @change="starTimeSelectConfirm"></u-calendar>
			</u-form-item>
		</view>
		<view class="form report-viewarea">
			<u-divider>日常工作</u-divider>
			<view :model="dataTemp">
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">村小组巡逻出勤人数</view>{{ dataTemp.attendance }} 人</view>
					</view>
				</view>
				<u-collapse ref="attendanceView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="村小组巡逻出勤人数填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li"><view class="text">{{ item.orgName }}</view>{{item.attendance}} 人</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">村小组巡逻次数</view>{{ dataTemp.patrolTimes }} 次</view>
					</view>
				</view>
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
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">核查人员</view>{{ dataTemp.peopleNumber }} 人</view>
					</view>
				</view>
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
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">核查车辆</view>{{ dataTemp.carNumber }} 辆</view>
					</view>
				</view>
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
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">入户走访</view>{{ dataTemp.houseVsit }} 户</view>
					</view>
				</view>
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
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">宣传教育</view>{{ dataTemp.publicityAndEducation }} 人</view>
					</view>
				</view>
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
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">发放宣传手册</view>{{ dataTemp.providePublicityBrochure }} 份</view>
					</view>
				</view>
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
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">张贴通告</view>{{ dataTemp.providePublicityBrochure }} 份</view>
					</view>
				</view>
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
			</view>
		</view>
		<view class="form report-viewarea">
			<u-divider>村民动态监测</u-divider>
			<view :model="dataTemp">
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">非本村可疑外来人员</view>{{ dataTemp.markedNum }} 人</view>
					</view>
				</view>
				<u-collapse ref="markedNumView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="非本村可疑外来人员填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li"><view class="text">{{ item.orgName }}</view>{{item.markedNum}} 人</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">深夜外出村民</view>{{ dataTemp.leaveNum }} 次</view>
					</view>
				</view>
				<u-collapse ref="leaveNumView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="深夜外出村民填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.leaveNum}} 次</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">境外务工人员</view>{{ dataTemp.overseasNum }} 人</view>
					</view>
				</view>
				<u-collapse ref="overseasNumView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="境外务工人员填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.overseasNum}} 人</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="title">有境外务工史人员</view>{{ dataTemp.hisOverseasNum }} 辆</view>
					</view>
				</view>
				<u-collapse ref="hisOverseasNumView"  :accordion="false" :head-style="completelyHeadStyle">
					<u-collapse-item title="有境外务工史人员填报详情" v-for="showItem in showItemList" :key="showItem.index">
						<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
							<view class="list">
								<view class="li">
									<view class="text">{{ item.orgName }}</view>{{item.hisOverseasNum}} 辆</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</view>
		<view class="form report-viewarea">
			<u-divider>案件情况</u-divider>
			<view class="list-content">
				<view class="list">
					<view class="li"><view class="title">案件数量</view>{{ dataTemp.eventNum }} 辆</view>
				</view>
			</view>
			<u-collapse ref="eventNumView"  :accordion="false" :head-style="completelyHeadStyle">
				<u-collapse-item title="案件数量填报详情" v-for="showItem in showItemList" :key="showItem.index">
					<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
						<view class="list">
							<view class="li">
								<view class="text">{{ item.orgName }}</view>{{item.eventNum}} 辆</view>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
			<view class="list-content">
				<view class="list">
					<view class="li"><view class="title">涉案人数</view>{{ dataTemp.involvedNum }} 辆</view>
				</view>
			</view>
			<u-collapse ref="involvedNumView"  :accordion="false" :head-style="completelyHeadStyle">
				<u-collapse-item title="涉案人数填报详情" v-for="showItem in showItemList" :key="showItem.index">
					<view class="list-content" v-for="item in showItem.areaDailyList" :key="item.id">
						<view class="list">
							<view class="li">
								<view class="text">{{ item.orgName }}</view>{{item.involvedNum}} 辆</view>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
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
				starTimeShow: false,
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
				},
				query: {
					reportDate: ''
				}
			}
		},
		onShow() {
			this.getRecentlyReport()
		},
		created() {
			this.dataTemp.mapType = this.$MapType
			this.query.reportDate = new moment().format('YYYY-MM-DD')
			this.dataTemp.orgId = uni.getStorageSync('borderUserorg').id
			if (this.dataTemp.orgId != '') {
				this.getRecentlyReport()
			}
		},
		mounted() {},
		methods: {
			// 防控户选择（预留）
			houseSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.houseName = val.label
					this.dataTemp.orgId = val.value
					this.getRecentlyReport()
				})
			},
			starTimeSelectConfirm(e) {
				this.query.reportDate = moment(e.result).format('YYYY-MM-DD')
				this.getRecentlyReport()
			},
			// 获取填报数据
			getRecentlyReport() {
				uni.showLoading({
					title: '加载中',
				})
				this.showItemList = []
				PreventionAndControlSlice.getLevelThreeAreaLeaderReport().then(res => {
					if (res.data.data != null) {
						this.showItemList.push({ areaDailyList: res.data.data.areaLeaderReportList })
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
			padding: 0 0%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;
			&.noborder {
				border-bottom: 0
			}
			.title {
				width: 88%;
				color: #000000;
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
