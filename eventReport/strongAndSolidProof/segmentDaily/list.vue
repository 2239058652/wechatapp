<template>
	<view class="content">
		<!-- <u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs> -->
		<view v-if="tabsIndex==0">
			<view class="form" v-if="borderUserlineOrgInfos.length > 1">
				<u-form  ref="uForm" label-width="170" :error-type="errorType">
					<u-form-item label="选择报送段:" :required="true">
						<u-input type="select" :select-open="selectShow" v-model="lineName" :border="true" placeholder="选择报送段" @click="selectShow = true" />
						<u-select v-model="selectShow" :list="segmentList" @confirm="segmenSelectconfirm"></u-select>
					</u-form-item>
				</u-form>
			</view>
			<view class="cu-list menu sm-border">
				<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
					<view class="content">
						<view class="padding-tb-sm flex align-center">
							<view class="content margin-left-sm">
								<view>
									<text class="text-black" style="font-weight: bold;font-size: 34rpx;">{{item.pointName}}</text>
								</view>
								<view class="text-sm">
									<view class="text-gray" style="color: #000000;">
										报送人：{{item.lineName}} 填报日期：{{item.reportTime}}
									</view>
									<view class="text-gray">
										案件总数：{{item.eventCount}} 件。
									</view>
									<view class="text-gray">
										案件类型总数：{{item.eventTypeCount}} 件。
									</view>
									<view class="text-gray">
										巡逻次数：{{item.patrolTimes}} 次。
									</view>
									<view class="text-gray">
										巡逻人数：{{item.peopleCount}} 人。
									</view>
									<view class="text-gray">
										过往人员常驻人口数：{{item.permanentPopulation}} 人,过往人员流动人口数：{{item.floatingPopulation}} 人
									</view>
									<view class="text-gray">
										物资使用情况：{{item.usedDesc || noneData}} 。
									</view>
									<view class="text-gray">
										物资储备情况：{{item.leftDesc || noneData}} 。
									</view>
									<view class="text-gray">
										其他工作情况：{{item.otherDesc || noneData}} 。
									</view>
<!-- 									<view class="text-gray">
										其中：州级机关干部：{{item.attendanceCityOfficials}} 人,
										市级机关干部：{{item.attendanceCountyOfficials}} 人 ,公安警察：{{item.attendancePolice}} 人 ,
										移民警察：{{item.attendanceImmigrationPolice}} 人 ,乡镇本级民兵：{{item.attendanceMilitia}} 人 ,
										对口支援力量：{{item.attendanceSupport}} 人 ,援边突击队：{{item.attendanceCommando}} 人 ,
										村民：{{item.attendanceVillager}} 人。
									</view> -->
<!-- 									<view class="text-gray">
										本防控点巡逻次数：{{item.patrolTimes}} 次
									</view>
									<view class="text-gray">
										一级段长巡逻次数：{{item.patrolTimesLevelOne}} 次,二级段长巡逻次数：{{item.patrolTimesLevelTwo}} 次,
										三级段长巡逻次数：{{item.patrolTimesLevelThree}} 次
									</view> -->
									<!-- <view class="text-gray">
										过往人员常驻人口数：{{item.permanentPopulation}} 人,过往人员流动人口数：{{item.floatingPopulation}} 人
									</view> -->
								<!-- 	<view class="text-gray">
										过往车辆数：{{item.carNumber}} 辆
									</view> -->
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
			</view>
			<view v-if="showList.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
				<u-empty text="没有数据" mode="data"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import segmentDaily from '@/api/segmentDaily.js'
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
				// tabsList: [
				// 	{ name: '点长日报' },
				// 	{ name: '事件报送' }
				// ],
				noneData:'暂无',
				tabsIndex: 0,
				showList: [],
				showEventList: [],
				showLen: 0,
				listData: [],
				eventListData: [],
				lineName:'',
				query: {
					lineId:'',
					sorts: '-createdDate'
				},
				loadingText: "正在加载...",
				loadingVisible: false,
				eventLoadingVisible: false,
				headerTop: null,
				jinETotal: 0,
				selectShow:false,
				borderUserlineOrgInfos: [],
				segmentList: [],
				errorType: ['toast', 'border'],
				
			}
		},
		computed: {

		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
		},
		onLoad() {
			this.headerTop = this.CustomBar
			// #ifdef MP-ALIPAY
			this.headerTop = 0
			// #endif
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			
			
			console.log(uni.getStorageSync('borderUserlineOrgInfos'));
			this.borderUserlineOrgInfos = uni.getStorageSync('borderUserlineOrgInfos');
			if (this.borderUserlineOrgInfos.length > 1) {
				this.borderUserlineOrgInfos.forEach(Element => {
					this.segmentList.push({ value: Element.id, label: Element.name });
				});
				
			}
			if (this.borderUserlineOrgInfos.length === 1) {
				this.query.lineId=this.borderUserlineOrgInfos[0].id
				this.fetchList();
			}
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
			this.eventLoadingVisible = true
			let len = this.listData.length;
			if (this.showLen >= len) {
				this.loadingText = "到底了";
				return false;
			}
			setTimeout(function() {
				_this.showList = _this.showList.concat(_this.listData.slice(_this.showLen, _this.showLen + 10));
				_this.showEventList = _this.showEventList.concat(_this.eventListData.slice(_this.showLen, _this.showLen + 10));
				_this.showLen = _this.showLen + 10
			}, 500);

		},
		methods: {
			// 选择段长后确认按钮
			segmenSelectconfirm(e) {
				this.lineName = e[0].label;
				// this.dataTemp.lineId = e[0].value;
				this.query.lineId = e[0].value;
				this.fetchList();
			},
			// 选项卡切换
			tabsChange(index) {
				this.tabsIndex = index
			},
			handleView(e) {
				uni.navigateTo({
					url: '../view/view?id=' + e.id
				})
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				segmentDaily.fetchDetail(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							console.log(res,'段长日报列表')
							_this.listData = res.data.data
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.slice(0, len))
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
						if (res.data.data.length > 0) {
							_this.loadingVisible = true
						}
					}
					uni.hideLoading()
				})
			},
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
	.form {
		padding: 20upx 40upx;
	}
</style>
