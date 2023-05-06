<template>
	<view class="content">
		<view>
			<view class="cu-list menu sm-border">
				<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
					<u-card margin="0rpx 0rpx 0rpx 0rpx" padding="10" title-color="#000000" style="width: 100%;">
						<view class="content" slot="body">
							<view class="padding-tb-sm flex align-center">
								<view class="content">
									<view class="padding-tb-sm flex align-center">
										<view class="content margin-left-sm">
											<view>
												<text class="text-black" style="font-weight: bold;font-size: 30rpx;">
													报送人：{{item.userName}} 填报日期：{{item.reportTime}}
												</text>
											</view>
											<view>
												<view class="text-gray" style="color: #000000;">出勤人数：{{item.attendance}} 人</view>
											</view>
											<view>
												<view class="text-gray" style="color: #000000;">
													其中：州级机关干部：{{item.attendanceCityOfficials}} 人,
													市级机关干部：{{item.attendanceCountyOfficials}} 人 ,公安警察：{{item.attendancePolice}} 人 ,
													移民警察：{{item.attendanceImmigrationPolice}} 人 ,乡镇本级民兵：{{item.attendanceMilitia}} 人 ,
													对口支援力量：{{item.attendanceSupport}} 人 ,援边突击队：{{item.attendanceCommando}} 人 ,
													村民：{{item.attendanceVillager}} 人。
												</view>
											</view>
											<view class="text-gray" style="color: #000000;">
												一级段长巡逻次数：{{item.patrolTimesLevelOne}} 次,二级段长巡逻次数：{{item.patrolTimesLevelTwo}} 次,
												三级段长巡逻次数：{{item.patrolTimesLevelThree}} 次
											</view>
											<view class="text-gray" style="color: #000000;">
												过往人员常驻人口数：{{item.permanentPopulation}} 人,过往人员流动人口数：{{item.floatingPopulation}} 人
											</view>
											<view class="text-gray" style="color: #000000;">
												过往车辆数：{{item.carNumber}} 辆
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</u-card>
					<!-- <view class="content">
						<view class="padding-tb-sm flex align-center">
							<view class="content margin-left-sm">
								<view>
									<text class="text-black" style="font-weight: bold;font-size: 34rpx;">{{item.pointName}}</text>
								</view>
								<view class="text-sm">
									<view class="text-gray" style="color: #000000;">
										报送人：{{item.userName}} 填报日期：{{item.reportTime}}
									</view>
									<view class="text-gray">
										出勤人数：{{item.attendance}} 人。 其中：州级机关干部：{{item.attendanceCityOfficials}} 人,
										市级机关干部：{{item.attendanceCountyOfficials}} 人 ,公安警察：{{item.attendancePolice}} 人 ,
										移民警察：{{item.attendanceImmigrationPolice}} 人 ,乡镇本级民兵：{{item.attendanceMilitia}} 人 ,
										对口支援力量：{{item.attendanceSupport}} 人 ,援边突击队：{{item.attendanceCommando}} 人 ,
										村民：{{item.attendanceVillager}} 人。
									</view>
									<view class="text-gray">
										本点巡逻次数：{{item.patrolTimesLevelOne}} 次
									</view>
									<view class="text-gray">
										一级段长巡逻次数：{{item.patrolTimesLevelOne}} 次,二级段长巡逻次数：{{item.patrolTimesLevelTwo}} 次,
										三级段长巡逻次数：{{item.patrolTimesLevelThree}} 次
									</view>
									<view class="text-gray">
										过往人员常驻人口数：{{item.permanentPopulation}} 人,过往人员流动人口数：{{item.floatingPopulation}} 人
									</view>
									<view class="text-gray">
										过往车辆数：{{item.carNumber}} 辆
									</view>
								</view>
							</view>
						</view>
					</view> -->
				</view>
				<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
			</view>
			<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
				<u-empty text="没有数据" mode="data"></u-empty>
			</view>
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
					day: '',
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
				condition: {}
			}
		},
		computed: {},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchList()
		},
		onLoad(option) {
			this.query.day = option.reportTime
			this.headerTop = this.CustomBar
			// #ifdef MP-ALIPAY
			this.headerTop = 0
			// #endif
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchList()
		},

		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.fetchList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			var _this = this
			this.loadingVisible = true
			let len = this.listData.length;
			if (this.showLen >= len) {
				this.loadingText = "到底了";
				return false;
			}
			setTimeout(function() {
				_this.showList = _this.showList.concat(_this.listData.slice(_this.showLen, _this.showLen + 10));
				_this.showLen = _this.showLen + 10
			}, 500);

		},
		methods: {
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				StrongAndSolidProof.getBorderReportList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.listData = res.data.data.content
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.content.slice(0, len))
							_this.showLen = len
							if (_this.showLen < 15 && _this.showLen > 0) {
								_this.$nextTick(function() {
									_this.loadingText = '没有更多了'
								})
							}
							var totalArr = res.data.data.sum
							_this.jinETotal = 0
							_this.listData.forEach(function(item) {
								_this.jinETotal += item.qianYueJE * 1000
				
							})
							_this.jinETotal = _this.jinETotal / 1000
						})
						if (res.data.data.content.length > 0) {
							_this.loadingVisible = true
						}
					}
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.nodata {
		height: calc(70vh);
		flex-direction: column;

		image {
			width: 100upx;
			height: 0;
		}
	}

	.headIcon {

		flex-shrink: 0;
		width: 55upx;
		// height: 55upx;
		// line-height: 100upx;

		image {
			width: calc(100% - 5upx);
			height: 0;
		}
	}

	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}

	.place {
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
		background-color: #f8f8f8;
		height: 100upx;
	}

	.toppicker {
		height: 85rpx;
		text-align: center;
		padding: 10rpx 100rpx 0 0;
		width: 100%;
		background-color: #f8f8f8;
	}
</style>
