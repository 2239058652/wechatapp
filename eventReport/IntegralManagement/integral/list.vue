<template>
	<view class="content">
		<view class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.day" class="cu-item" @tap="handleView(item)">
				<view class="content" @tap="handleView(item)">
					<u-card :show-head="false" margin="0rpx 0rpx 0 0rpx" style="width: 100%;" @tap="handleView(item)">
						<view class="content" slot="body" @tap="handleView(item)">
							<view>
								<text class="text-black">日期：{{item.day}}</text>
							</view>
							<view>
								<text class="title-text" style="font-weight: bold;font-size: 34rpx;">积分：{{item.value}} 分</text>
							</view>
						</view>
					</u-card>
				</view>
			</view>
			<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
		<u-popup v-model="showDayIntegralList" mode="center" width="90%" min-height="800upx">
			<view style="padding:10px;display: flex;width: 100%;height: 70rpx;line-height: 70rpx;text-align: center;margin-bottom: 5%;">
				<view style="font-size: larger;font-weight: bold;width: 50%;color: #1261d4;">当日积分：{{ clickIntegral }} 分</view>
				<view style="width: 50%;text-align: right;">{{ clickDay }}</view>
			</view>
			<view v-for="(item,index) in dayIntegralList" :key="index">
				<view style="height: 100rpx;width: 100%;display: flex;padding:2% 2% 15% 2%;">
					<view style="width: 12%;height: 100rpx;line-height: 100rpx;text-align: center;">
						<u-icon name="integral" color="#2979ff" size="40"></u-icon>
					</view>
					<view style="width: 68%;height: 100rpx;line-height: 50rpx;">
						<view>{{item.createdDate}}</view>
						<view class="title-text">{{item.reason}}</view>
					</view>
					<view class="title-text" style="width: 20%;height: 100rpx;line-height: 100rpx;text-align: center;color: #1261d4;">
						+ {{item.value}} 分
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import MassAppealApi from '../../../api/massAppeal.js'
	import moment from 'moment'
	import IntegralApi from '../../../api/integral.js'
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
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					// keyWord: '',
				},
				value: '',
				value_startTime: '点击打开 picker',
				startDay: '2020-01',
				endDay: '',
				loadingText: "正在加载...",
				loadingVisible: false,
				afterHeaderOpacity: 1, //不透明度
				headerTop: null,
				clickDay: '',
				clickIntegral: '',
				showDayIntegralList: false,
				dayIntegralList: []
			}
		},
		computed: {

		},
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
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				IntegralApi.getPersonIntegralDayTotalRewardList().then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
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
			handleView(item) {
				this.clickDay = item.day
				this.clickIntegral = item.value
				IntegralApi.getDayTotalRewardDetail(item.day).then(res => {
					this.dayIntegralList = res.data.data
					this.showDayIntegralList = true
				})
			}
		}
	}
</script>

<style lang="scss">
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.title-text {
		font-size: 1rem;
		font-weight: bold;
		color: #000000;
	}
</style>
