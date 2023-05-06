<template>
	<view class="content">
		<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">{{ query.time }} 填报情况</view>
		<u-subsection
			:list="list"
			:current="current"
			:animation="true"
			:active-color="activeColor"
			@change="sectionChange"
		/>
		<!-- 已填报防控点信息 -->
		<view v-show="current == 0" class="form">
			<u-collapse ref="completedPointView" :accordion="false" :head-style="completelyHeadStyle"
				:item-style="collapseItem" arrow-color="#18B566">
				<u-collapse-item :title="completedPoint.pointName" v-for="completedPoint in completedPointList"
					:key="completedPoint.index">
					<view class="report-viewarea list-content">
						<view class="list">
							<view class="li"><view class="text">报送人</view>{{completedPoint.userName}}</view>
						</view>
						<view class="list">
							<view class="li"><view class="text">出勤人数</view>{{completedPoint.attendance}} 人</view>
							<view style="text-align: center;">出勤明细</view>
							<view class="li"><view class="text">州级机关干部</view>{{completedPoint.attendanceCityOfficials}} 人</view>
							<view class="li"><view class="text">市级机关干部</view>{{completedPoint.attendanceCountyOfficials}} 人</view>
							<view class="li"><view class="text">公安警察</view>{{completedPoint.attendancePolice}} 人</view>
							<view class="li"><view class="text">移民警察</view>{{completedPoint.attendanceImmigrationPolice}} 人</view>
							<view class="li"><view class="text">援边突击队</view>{{completedPoint.attendanceCommando}} 人</view>
							<view class="li"><view class="text">乡镇本级民兵</view>{{completedPoint.attendanceMilitia}} 人</view>
							<view class="li"><view class="text">村民</view>{{completedPoint.attendanceVillager}} 人</view>
						</view>
						<view class="list">
							<view class="li"><view class="text">防控点巡逻次数</view>{{completedPoint.patrolTimes}} 次</view>
							<view class="li"><view class="text">一级段长巡逻次数</view>{{completedPoint.patrolTimesLevelOne}} 次</view>
							<view class="li"><view class="text">二级段长巡逻次数</view>{{completedPoint.patrolTimesLevelTwo}} 次</view>
							<view class="li"><view class="text">三级段长巡逻次数</view>{{completedPoint.patrolTimesLevelThree}} 次</view>
							<view class="li"><view class="text">过往人员常驻人口数</view>{{completedPoint.attendancePolice}} 人</view>
							<view class="li"><view class="text">过往人员流动人口数</view>{{completedPoint.attendanceImmigrationPolice}} 人</view>
							<view class="li"><view class="text">过往车辆数</view>{{completedPoint.attendanceCommando}} 辆</view>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
		<!-- 未填报防控点信息 -->
		<view v-show="current == 1" class="form">
			<u-collapse ref="inCompletedPointView" :accordion="false" :head-style="inCompletelyHeadStyle"
				:item-style="collapseItem" arrow-color="#F0AD4E">
				<u-collapse-item :title="inCompletedPoint.point.name" v-for="inCompletedPoint in inCompletedPointList"
					:key="inCompletedPoint.index">
					<view class="list-content">
						<view v-if="inCompletedPoint.pointUserList.length > 0 " class="list">
							<view
								v-for="inCompletedPointManage in inCompletedPoint.pointUserList"
								:key="inCompletedPointManage.account"
							>
								<view class="li">
									<view class="text">
										<u-icon name="account" />{{ inCompletedPointManage.name }}
									</view>
										<u-icon name="phone" />
										{{ inCompletedPointManage.mobile }}
								</view>
							</view>
						</view>
						<view v-if="inCompletedPoint.pointUserList.length == 0 " class="list">
							<view class="li">
								<view class="text">
									暂无点长信息
								</view>
							</view>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import StrongAndSolidProof from '../../../../api/strongAndSolidProof.js'
	import moment from 'moment'
	export default {
		filters: {
			titleFilter(val) {
				if (val.length > 20) {
					return val.substring(0, 20) + '...'
				}
				return val
			}
		},
		components: {},
		data() {
			return {
				reportTypeShow:false,
				reportTypeList: [],
				typeText: '',
				showList: [],
				showEventList: [],
				showLen: 0,
				listData: [],
				query: {
					time: '',
					sorts: '-createdDate'
				},
				value: '',
				currentDate: '',
				value_startTime: '点击打开 picker',
				startDay: '2020-01',
				endDay: '',
				loadingText: "正在加载...",
				loadingVisible: false,
				eventLoadingVisible: false,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				headerTop: null,
				jinETotal: 0,
				condition: {},
				list: [
					{ name: '已填报' }, 
					{ name: '未填报' }
				],
				current: 0,
				activeColor: '#18B566',
				collapseItem: {
					color: '#18B566',
				},
				completelyHeadStyle: {
					height: '100upx',
					border: '3px #ececec solid',
					fontWeight: 700,
					color: '#18B566',
					textIndent: '1em'
				},
				completedPointList: [],
				inCompletelyHeadStyle: {
					height: '100upx',
					border: '3px #ececec solid',
					fontWeight: 700,
					color: '#F0AD4E',
					textIndent: '1em'
				},
				inCompletedPointList: []
			}
		},
		computed: {},
		onShow() {
			this.$nextTick(() => {
				this.$refs.completedPointView.init()
			})
		},
		onLoad(option) {
			this.query.time = option.reportTime
			this.fetchList()
		},
		methods: {
			// 选项卡切换监听
			sectionChange(index) {
				this.current = index
				if (this.current === 1) {
					this.activeColor = '#F0AD4E'
					this.$nextTick(() => {
						this.$refs.inCompletedPointView.init()
					})
				} else {
					this.activeColor = '#18B566'
					this.$nextTick(() => {
						this.$refs.completedPointView.init()
					})
				}
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				StrongAndSolidProof.getBorderReportList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.completedPointList = res.data.data.content
						})
					}
					uni.hideLoading()
				})
				StrongAndSolidProof.getBorderUnReportList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.inCompletedPointList = res.data.data.content
						})
					}
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.form {
		padding: 20upx 20upx;
	}
	.report-viewarea {
		// border-radius: 15px;
		border: 1px #909399 solid;
		margin:1% 2% 2% 2%;
		min-height: 350rpx;
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
					width: 85%;
					font-size: small;
					color: #AAAAAA;
				}
			}
		}
</style>
