<template>
	<view class="content">
		<view class="toppicker">
			<view class="padding-lr" style="width: 230rpx;">
				<!-- <u-search placeholder="工作类型" v-model="query.workType" :show-action="false" @search="handleSearch"></u-search> -->
				<u-input type="select" :select-open="dateShow" input-align="center" v-model="query.dateText" :border="false"
				 placeholder="年月" @click="dateShow = true" />
				<u-picker mode="time" cancel-text="清除" v-model="dateShow" :params="limitParams" @confirm="dateSelectConfirm"
				 @cancel="dateSelectCancel"></u-picker>
			</view>
			<view class="text-right padding-lr-xs">
				<view class="text-sm">
					总积分：{{integralTemp.total}}
				</view>
				<view class="text-sm">
					已使用：{{integralTemp.used}};剩余：{{integralTemp.residue}}
				</view>
			</view>
		</view>
		<view class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
				<view class="content">
					<view class="padding-tb-sm flex align-center">
						<view class="content margin-left-sm">
							<view>
								<text class="text-black">{{item.year}}年{{item.month}}月考核</text>
							</view>
							<view class="text-sm">
								<view class="text-black">
									得分：{{item.jiFen}} （{{item.inOutDesc}})
								</view>
								<view class="text-grey">
									{{item.description}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class=" action" style="margin-top: 0upx; width: 120rpx;">
					<view class="flex justify-end text-sm" style="width: 100%;">
						{{ item.sourceDesc}}
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
	import IntegralApi from '../../../api/integral.js'
	import moment from 'moment'
	export default {
		filters: {
			// dateFilter(val){
			// 	return val.replace('-','年')
			// }
			contentFilter(val) {
				if (val && val.length > 20) {
					return val.substring(0, 20) + '...'
				}
				return val
			}
		},
		data() {
			return {
				tabsList: [{
						name: '个人收件'
					},
					{
						name: '机构收件'
					}
				],
				tabsIndex: 0,
				dateShow: false,
				dateValue: '',
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					kaoHeGzName: '',
					dateText: '全部',
					year: '',
					month: ''
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
				limitParams: {
					year: true,
					month: true,
					day: false,
					dateText: ''
				},
				integralTemp: {
					total: 0,
					used: 0,
					residue: 0
				}
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
		onLoad(option) {
			this.integralTemp.total = option.zjf
			this.integralTemp.used = option.syjf
			this.integralTemp.residue = option.syjf
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
			dateSelectCancel() {
				this.query.year = ''
				this.query.month = ''
				this.query.dateText = "全部"
				this.fetchList()
			},
			// 年月选择
			dateSelectConfirm(e) {
				console.log(e)
				this.query.year = e.year
				this.query.month = e.month
				this.query.dateText = e.year + '-' + e.month
				this.fetchList()
			},
			handleSearch() {
				this.fetchList()
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false

				IntegralApi.getEvaluateList(_this.query).then(res => {
					console.log('personeventlist', res)
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
						})
						if (res.data.data.content.length > 0) {
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
		/*  #ifdef  H5  */
		top: 85upx;
		/*  #endif  */
		height: 100upx;
		width: 100%;
		z-index: 996;
		background-color: #fff;
		border-bottom: 5upx solid #f8f8f8;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20upx;
	}
</style>
