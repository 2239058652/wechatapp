<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<u-sticky>
			<u-tabs
				:list="tabsList"
				:is-scroll="true"
				:offset=[5,50]
				:active-color="activeColor"
				count="cate_count"
				:current="tabsIndex"
				@change="tabsChange" />
		</u-sticky>
		<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body">
					<!-- 第一行 显示头-->
					<view class="show-head-title">
						<view class="titleLeft">
							<u-icon name="calendar-fill" size="35" style="margin-right: 3%;" />
							{{ item.createdDate }}
						</view>
						<view v-if="item.valueStatus == 0" class="titleRight">
							<u-tag :text="item.valueStatusDesc" size="mini" shape="circle" type="success" />
						</view>
						<view v-if="item.valueStatus == 1" class="titleRight">
							<u-tag :text="item.valueStatusDesc" size="mini" shape="circle" type="warning" />
						</view>
					</view>
					<!-- 第二行 信息行-->
					<view v-if="item.valueStatus == 0" class="show-body">
						<view class="bodyTop">
							<u-icon name="integral" size="35" style="margin-right: 3%;" />
							入账平安豆: {{ item.value }}
						</view>
						<view class="bodyTop">
							<u-icon name="order" size="35" style="margin-right: 3%;" />
							入账说明: {{ item.reason }}
						</view>
					</view>
					<view v-if="item.valueStatus == 1" class="show-body">
						<view class="bodyTop">
							<u-icon name="integral" size="35" style="margin-right: 3%;" />
							支出平安豆: {{ item.value }}
						</view>
						<view class="bodyTop">
							<u-icon name="order" size="35" style="margin-right: 3%;" />
							支出说明: {{ item.reason }}
						</view>
						<view class="bodyTop">
							<u-icon name="map" size="35" style="margin-right: 3%;" />
							支出地点: {{ item.reason }}
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
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
				tabsList: [
					{name: '全部'},
					{name: '登录入账'},
					{name: '问题隐患报送入账'},
					{name: '问题隐患报送并办结入账'},
					{name: '问题隐患办结入账'},
					{name: '工作上报入账'},
					{name: '工作圈查看入账'},
					{name: '兑换支出'}
				],
				tabsIndex: 0,
				activeColor: '#297fff',
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					consumerType: ''
				},
				value: '',
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
			// 选项卡切换
			tabsChange(index) {
				var _this = this
				_this.tabsIndex = index
				if (index == 0) {
					_this.activeColor = '#297fff'
					_this.query.consumerType = ''
					_this.query.rewardType = ''
				} else if (index == 1) {
					_this.activeColor = '#18b556'
					_this.query.rewardType = 0
					_this.query.consumerType = ''
				} else if (index == 2) {
					_this.activeColor = '#18b556'
					_this.query.rewardType = 1
					_this.query.consumerType = ''
				} else if (index == 3) {
					_this.activeColor = '#18b556'
					_this.query.rewardType = 4
					_this.query.consumerType = ''
				} else if (index == 4) {
					_this.activeColor = '#18b556'
					_this.query.rewardType = 5
					_this.query.consumerType = ''
				} else if (index == 5) {
					_this.activeColor = '#18b556'
					_this.query.rewardType = 2
					_this.query.consumerType = ''
				} else if (index == 6) {
					_this.activeColor = '#18b556'
					_this.query.rewardType = 3 
					_this.query.consumerType = ''
				} else if (index == 7) {
					_this.activeColor = '#ff9900'
					_this.query.rewardType = ''
					_this.query.consumerType = 10
				}
				_this.fetchList()
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				IntegralApi.handleUserPingandHistory(_this.query).then(res => {
					console.log('1111111111', res)
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.listData = res.data.data.content
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.content.slice(0, len))
							_this.showList.forEach(element => {
								if (element.value > 0) {
									element.valueStatus = 0
									element.valueStatusDesc = '入账'
								} else {
									element.valueStatus = 1
									element.valueStatusDesc = '支出'
								}
							})
							_this.showLen = len
							if (_this.showLen < 15 && _this.showLen > 0) {
								_this.$nextTick(function() {
									_this.loadingText = '没有更多了'
								})
							}
							var totalArr = res.data.data.content.length
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
