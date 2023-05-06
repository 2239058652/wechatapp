<template>
	<view class="content">
		<view class="cu-list menu sm-border">
			<view v-for="(eventReportItem, index) in showList" :key="index" class="cu-item">
				<u-card :title="eventReportItem.reportTime" margin="20rpx 0rpx 0 0rpx" padding="10" title-color="#000000" style="width: 100%;">
					<view class="content" slot="body">
						<view class="padding-tb-sm flex align-center" style="width: 100%;display: flex;">
							<view class="content margin-left-sm" style="width: 75%;">
								<view>
									<text class="text-content" style="color: #1261d4;">事件总数：{{eventReportItem.eventAll}} 起</text>
								</view>
								<view>
									<text class="text-content" style="color: #18B566;">涉案人数：{{eventReportItem.involvedPeopleCount}} 人</text>
								</view>
							</view>
							<view style="width: 25%;">
								<view><u-button type="primary" @click="handleViewPeopleDel(eventReportItem)">情况统计</u-button></view>
								<view style="margin-top: 10%;"><u-button type="success" @click="handleViewReportList(eventReportItem)">报送情况</u-button></view>
							</view>
						</view>
					</view>
				</u-card>
			</view>
			<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import StrongAndSolidProof from '../../../api/strongAndSolidProof.js'
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
				typeText: '',
				tabsIndex: 0,
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					sorts: '-reportTime'
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
				condition: {},
				dataTemp: {}
			}
		},
		computed: {},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchList()
		},
		onLoad() {
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
			//查看人员力量情况
			handleViewPeopleDel(e) {
				uni.navigateTo({
					url: './view/viewEventDel?eventAll=' + e.eventAll + '&eventType01=' + e.eventType01 + '&eventType02=' + e.eventType02 +
					'&eventType03=' + e.eventType03 + '&eventType04=' + e.eventType04 +
					'&eventType05=' + e.eventType05 + '&eventType06=' + e.eventType06 +
					'&eventType07=' + e.eventType07 + '&involvedPeopleCount=' + e.involvedPeopleCount +
					'&involvedPeopleType01=' + e.involvedPeopleType01 + '&involvedPeopleType02=' + e.involvedPeopleType02 +
					'&involvedPeopleType03=' + e.involvedPeopleType03 + '&involvedPeopleType04=' + e.involvedPeopleType04 +
					'&involvedPeopleType05=' + e.involvedPeopleType05 + '&involvedPeopleType06=' + e.involvedPeopleType06 +
					'&involvedPeopleType07=' + e.involvedPeopleType07 + '&reportTime=' + e.reportTime
				})
			},
			//查看填报情况
			handleViewReportList(e) {
				uni.navigateTo({
					url: './list/list?reportTime=' + e.reportTime
				})
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				StrongAndSolidProof.getEventReportCountList(_this.query).then(res => {
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
	.text-content {
		font-weight: bold;
		font-size: 30rpx;
	}
</style>
