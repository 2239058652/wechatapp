<template>
	<view class="content">
		<!-- <u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs> -->
		<view class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
				<view class="content" @tap="handleView(item)">
					<view class="padding-tb-sm flex align-center">
						<view class="content margin-left-sm">
							<view>
								<text class="text-black" style="font-weight: bold;font-size: 34rpx;">{{item.title | titleFilter}}</text>
							</view>
							<view class="text-sm">
								<view class="text-black">
									<span>事件级别：<u-tag :text="item.eventLevel" mode="dark" :type="item.eventLevelType" shape="circle" /></span>
									<span style="margin-left: 5%;">紧急程度：<u-tag :text="item.eventUrgent" mode="dark" :type="item.eventUrgentType" shape="circle" /></span>
								</view>
								<view class="text-black">
									事件类别：{{item.eventClassificationCriteria | titleFilter}}
								</view>
								<view class="text-gray">
									报送机构：{{item.sourceOrgName}} 
								</view>
								<view class="text-gray">
									报送人员：{{item.sourceUserName}}
								</view>
								<view class="text-gray">
									上报时间：{{item.reportTime}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class=" action" style="margin-top: -40upx;">
					<view class="flex justify-end text-sm" style="width: 100%;">
						<u-tag :text="item.statusDesc" mode="dark" :type="item.statusDescType" />
					</view>
				</view>
			</view>
			<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import EventApi from '../../../api/eventdetail.js'
	import moment from 'moment'
	export default {
		filters: {
			// dateFilter(val){
			// 	return val.replace('-','年')
			// }
			titleFilter(val) {
				if (val.length > 20) {
					return val.substring(0, 20) + '...'
				}
				return val
			}
		},
		data() {
			return {
				tabsList: [{
						name: '报送件'
					},
					{
						name: '转交件'
					}
				],
				tabsIndex: 0,
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					keyWord: '',
				},
				value: '',
				currentDate: '',
				value_startTime: '点击打开 picker',
				startDay: '2020-01',
				endDay: '',
				loadingText: "正在加载...",
				loadingVisible: false,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				headerTop: null,
				jinETotal: 0,
				condition: {}
			}
		},
		computed: {

		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			// console.log(currPage)
			// console.log(currPage.query); //这就是传递的参数	
			this.fetchList()

		},
		onLoad() {

			// this.setStartDay()
			// this.headerTop = plus.navigator.getStatusbarHeight()
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
			// uni.showToast({
			// 	title: '加载中'
			// });
			this.loadingVisible = true
			let len = this.listData.length;
			if (this.showLen >= len) {
				this.loadingText = "到底了";
				return false;
			}
			// console.log(this.showLen)
			setTimeout(function() {
				_this.showList = _this.showList.concat(_this.listData.slice(_this.showLen, _this.showLen + 10));
				_this.showLen = _this.showLen + 10
			}, 500);

		},
		methods: {
			tabsChange(index) {
				this.tabsIndex = index
				this.fetchList()
			},
			setStartDay() {
				this.currentDate = moment().format('YYYY/MM')
				this.endDay = moment().format('YYYY-MM')
				this.query.year = moment().get('year');
				this.query.month = moment().get('month') + 1;
				this.fetchList()
				// console.log(this.year + '-' + this.month)
			},
			handleView(e) {
				console.log(e)
				uni.navigateTo({
					url: '../../eventhandle/view/view?id=' + e.id
				})
			},
			fetchList() {
				var _this = this
				// Bill.getTradeHistoryList(this.query).then(res => {
				// 	console.log('historybill', res)
				// })
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				if (this.tabsIndex == 0) {
					EventApi.getBorderReportList(_this.query).then(res => {
						console.log('eventlist', res)
						if (res.data.code == 0) {
							_this.$nextTick(function() {
								_this.listData = res.data.data.content
								var len = 0
								_this.listData.length < 15 ? len = _this.listData.length : len = 15
								_this.showList = [].concat(res.data.data.content.slice(0, len))
								_this.showList.forEach(function(item) {
									item.title = _this.decrypt(item.title)
									item.content = _this.decrypt(item.content)
									if (item.eventLevel == '一般') { item.eventLevelType = 'info'}
									else if (item.eventLevel == '较大') { item.eventLevelType = 'success'}
									else if (item.eventLevel == '重大') { item.eventLevelType = 'warning'}
									else { item.eventLevelType = 'error'}
									
									if (item.eventUrgent == '一般') { item.eventUrgentType = 'success'}
									else if (item.eventUrgent == '特急') { item.eventUrgentType = 'warning'}
									else { item.eventUrgentType = 'error'}
									if (item.statusDesc == '办结') { item.statusDescType = 'success'}
								})
								_this.showLen = len
								if (_this.showLen < 15 && _this.showLen > 0) {
									_this.$nextTick(function() {
										_this.loadingText = '没有更多了'
									})
								}
								//计算收入支出总和
								var totalArr = res.data.data.sum
								_this.jinETotal = 0
								_this.listData.forEach(function(item) {

									_this.jinETotal += item.qianYueJE * 1000

								})
								_this.jinETotal = _this.jinETotal / 1000
								// console.log('sss2',_this.showList)
							})
							if (res.data.data.content.length > 0) {
								_this.loadingVisible = true
							}
							// console.log('sss111',_this.listData)
							// console.log('ddddd',res.data.data.content)
						}
						uni.hideLoading()
					})
				}
				if (this.tabsIndex == 1) {
					EventWorkOutApi.getTransmitEventDoneList(_this.query).then(res => {
						console.log('eventlist', res)
						if (res.data.code == 0) {
							_this.$nextTick(function() {
								_this.listData = res.data.data.content
								var len = 0
								_this.listData.length < 15 ? len = _this.listData.length : len = 15
								_this.showList = [].concat(res.data.data.content.slice(0, len))
								_this.showList.forEach(function(item) {
									item.title = _this.decrypt(item.title)
									item.content = _this.decrypt(item.content)
									if (item.eventLevel == '一般') { item.eventLevelType = 'info'}
									else if (item.eventLevel == '较大') { item.eventLevelType = 'success'}
									else if (item.eventLevel == '重大') { item.eventLevelType = 'warning'}
									else { item.eventLevelType = 'error'}
									
									if (item.eventUrgent == '一般') { item.eventUrgentType = 'success'}
									else if (item.eventUrgent == '特急') { item.eventUrgentType = 'warning'}
									else { item.eventUrgentType = 'error'}
									if (item.statusDesc == '办结') { item.statusDescType = 'success'}
								})
								_this.showLen = len
								if (_this.showLen < 15 && _this.showLen > 0) {
									_this.$nextTick(function() {
										_this.loadingText = '没有更多了'
									})
								}
								//计算收入支出总和
								var totalArr = res.data.data.sum
								_this.jinETotal = 0
								_this.listData.forEach(function(item) {

									_this.jinETotal += item.qianYueJE * 1000

								})
								_this.jinETotal = _this.jinETotal / 1000
								// console.log('sss2',_this.showList)
							})
							if (res.data.data.content.length > 0) {
								_this.loadingVisible = true
							}
							// console.log('sss111',_this.listData)
							// console.log('ddddd',res.data.data.content)
						}
						uni.hideLoading()
					})
				} else {
					uni.hideLoading()
				}
			},
			DateChange(event) {
				// console.log('选中', event.detail.value)
				event.detail
				this.currentDate = event.detail.value
				this.query.year = moment(event.detail.value, 'YYYY-MM').get('year')
				this.query.month = moment(event.detail.value, 'YYYY-MM').get('month') + 1
				this.fetchList()
			},
			openFilter() {
				uni.navigateTo({
					url: '../conditionform/conditionform'
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
		/*  #ifdef  H5  */
		top: 85upx;
		/*  #endif  */
		height: 100upx;
		width: 100%;
		z-index: 996;
		background-color: #f8f8f8;
	}
</style>
