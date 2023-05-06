<template>
	<view class="content">
		<view>
			<view class="cu-list menu sm-border">
				<view v-for="(item,index) in showEventList" :key="item.id" class="cu-item">
					<u-card margin="0rpx 0rpx 0rpx 0rpx" padding="10" title-color="#000000" style="width: 100%;">
						<view class="content" slot="body">
							<view class="padding-tb-sm flex align-center">
								<view class="content" @tap="handleView(item)">
									<view class="padding-tb-sm flex align-center">
										<view class="content margin-left-sm">
											<view>
												<text class="text-black" style="font-weight: bold;font-size: 30rpx;">
													日期：{{item.reportTime}}
												</text>
											</view>
											<view>
												<text class="text-black" style="font-weight: bold;font-size: 30rpx;">
													地点：{{item.eventAddress}}
												</text>
											</view>
											<view>
												<text class="text-black" style="font-weight: bold;font-size: 30rpx;">
													涉案人数：{{item.involvedPeopleCount}} 人
												</text>
											</view>
											<view class="text-sm">
												<view class="text-gray" style="color: #000000;">
													{{item.pointName}}负责人{{item.userName}} 于：{{item.createdDate}} 填报。
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</u-card>
				</view>
				<view v-if="eventLoadingVisible" class="loading-text">{{loadingText}}</view>
			</view>
			<view v-if="eventListData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
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
				eventListData: [],
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
			this.fetchEventList()
		},
		onLoad(option) {
			this.query.day = option.reportTime
			this.headerTop = this.CustomBar
			// #ifdef MP-ALIPAY
			this.headerTop = 0
			// #endif
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchEventList()
		},
		onPullDownRefresh() {
			this.fetchEventList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			var _this = this
			this.eventLoadingVisible = true
			let len = this.listData.length;
			if (this.showLen >= len) {
				this.loadingText = "到底了";
				return false;
			}
			setTimeout(function() {
				_this.showEventList = _this.showEventList.concat(_this.eventListData.slice(_this.showLen, _this.showLen + 10));
				_this.showLen = _this.showLen + 10
			}, 500);

		},
		methods: {
			handleView(e) {
				uni.navigateTo({
					url: '/eventReport/strongAndSolidProof/view/view?id=' + e.id
				})
			},
			fetchEventList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.eventLoadingVisible = false
				StrongAndSolidProof.getBorderEventReportList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.eventListData = res.data.data.content
							var len = 0
							_this.eventListData.length < 15 ? len = _this.eventListData.length : len = 15
							_this.showEventList = [].concat(res.data.data.content.slice(0, len))
							_this.showLen = len
							if (_this.showLen < 15 && _this.showLen > 0) {
								_this.$nextTick(function() {
									_this.loadingText = '没有更多了'
								})
							}
							var totalArr = res.data.data.sum
							_this.jinETotal = 0
							_this.eventListData.forEach(function(item) {
								_this.jinETotal += item.qianYueJE * 1000
				
							})
							_this.jinETotal = _this.jinETotal / 1000
						})
						if (res.data.data.content.length > 0) {
							_this.eventLoadingVisible = true
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
	.toppicker {
		height: 85rpx;
		text-align: center;
		padding: 10rpx 100rpx 0 0;
		width: 100%;
		background-color: #f8f8f8;
	}
</style>
