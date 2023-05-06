<template>
	<view class="content">
		<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body">
					<!-- 第一行 显示头-->
					<view class="show-head-title">
						<view class="titleLeft">
							<u-icon name="calendar-fill" size="35" style="margin-right: 3%;" />
							{{ item.createdDate }}
						</view>
						<view class="titleRight">
							<u-tag :text="item.statusDesc" size="mini" shape="circle" type="primary" />
						</view>
					</view>
					<!-- 第二行 信息行-->
					<view class="show-body">
						<view class="bodyTop">
							<u-icon name="order" size="35" style="margin-right: 3%;" />
							{{ item.typeDesc }}
						</view>
						<view class="bodyBottom u-line-2">{{ item.question }}</view>
					</view>
					<view style="margin-top: 1vh;text-align: right;">
						<view style="margin-top: 1vh;text-align: right;">
							<u-button type="success" size="mini" style="height: 65rpx;" @click="handleView(item)">查看咨询</u-button>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<view v-if="showList.length == 0" class="text-center justify-center flex flex-wrap padding align-center nodata" style="background-color: #FFFFFF;height: 100vh;">
			<u-empty text="还没有法律服务问题咨询记录..." mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import LegalAdvice from '../../../../../api/legalAdvice.js'
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
				typeText: '',
				tabsIndex: 0,
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					status: 2,
					openId: ''
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
		computed: {},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchList()
		},
		created() {
			this.openId = uni.getStorageSync('openId')
			// #ifdef MP-WEIXIN
			if (!this.openId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
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
			handleView(e) {
				uni.navigateTo({
					url: './view?id=' + e.id
				})
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				let openid = uni.getStorageSync('openId')
				_this.query.openId = openid
				LegalAdvice.getoWnerList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.listData = res.data.data.content
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.content.slice(0, len))
							_this.showList.forEach(element => {
								element.typeDesc = element.type.text
							})
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
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.show-head-title {
		border-bottom: 1px #ececec solid;
		height: 50rpx;
		width: 100%;
		display: flex;
		.titleLeft {
			width: 70%;
			text-align: left;
			font-weight: bold;
		}
		.titleRight {
			width: 30%;
			text-align: right;
		}
	}
	.show-body {
		border-bottom: 1px #ececec solid;
		min-height: 100rpx;
		.bodyTop {
			height: 55rpx;
			line-height: 55rpx;
			text-align: left;
			font-weight: bold;
		}
		.bodyBottom {
			font-weight: 100;
			line-height: 55rpx;
			text-indent:2em;
		}
	}
</style>
