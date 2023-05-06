<template>
	<view>
		<u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<view v-show="tabsIndex==2" class="">
			<view class="org text-blue text-bold">
				{{org.name}}
			</view>
			<view class="org">
				<view class="title">
					<u-icon name="grid-fill" color="#2979ff" size="28" class="margin-right-xs"></u-icon>
					下级机构情况
				</view>
				<view class="content">
					<view v-for="(item,index) in orgData" :key="index" class="item">
						<text>{{item.category}}:</text>
						<text>{{item.count}} 个</text>

					</view>
				</view>
			</view>
			<view class="org">
				<view class="title">
					<u-icon name="grid-fill" color="#2979ff" size="28" class="margin-right-xs"></u-icon>
					下级机构人员情况
				</view>
				<view class="content">
					<view v-for="(item,index) in teamData" :key="index" class="item">
						<text>{{item.category}}:</text>
						<text>{{item.count}}人</text>

					</view>
				</view>
			</view>
		</view>
		<view v-show="tabsIndex==0" class="">
			<view class="event">
				<!-- <view class="title">
					<u-icon name="grid-fill" color="#2979ff" size="28" class="margin-right-xs"></u-icon>
					事件报送情况：
				</view> -->
				<view class="content">
					<view class="subtitle">
						报送事件总数：{{eventTotal}}
					</view>
				</view>

			</view>
			<view class="">
				<canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchRing"></canvas>
			</view>
			<view class="event">
				<view class="content">
					<view v-for="(item,index) in arrPressed" :key="index" class="item" @click="gotoList(item.category)">
						<text>{{item.category}}:</text>
						<text>{{item.count}}</text>
					</view>
				</view>
				<view class="content">
					<view v-for="(item,index) in arrBePressed" :key="index" class="item" @click="gotoList(item.category)">
						<text>{{item.category}}:</text>
						<text>{{item.count}}</text>
					</view>
				</view>
				<view class="content">
					<view v-for="(item,index) in arrTodo" :key="index" class="item" @click="gotoList(item.category)">
						<text>{{item.category}}:</text>
						<text>{{item.count}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-show="tabsIndex==1" class="">
			<view class="event">
				<!-- <view class="title">
					<u-icon name="grid-fill" color="#2979ff" size="28" class="margin-right-xs"></u-icon>
					事件报送分类：
				</view> -->
				<view class="content">
					<!-- <view class="item">
						<text>事件报送总数:</text>
						<text>{{eventTypeTotal}}</text>
					</view> -->
				</view>

			</view>
			<view class="">
				<canvas canvas-id="canvasTypeRing" id="canvasTypeRing" class="charts" @touchstart="touchTypeRing"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import DataVisualization from '../../../api/datavisualization.js';
	import uCharts from '@/components/u-charts/u-charts.min.js';

	var _self;
	var canvaRing = null;
	var canvaTypeRing = null;

	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		components: {},
		filters: {
			countFilter(val) {
				return val + 1
			}
		},
		data() {
			return {
				popupShow: false,
				eventList: [],
				tabsList: [{
						name: '事件报送数量'
					},
					{
						name: '事件分类统计'
					},
					{
						name: '组织机构情况'
					}
				],
				tabsIndex: 0,
				org: '',
				query: {
					org_code: '',
					event_type_level: ["01", "02"]
				},
				orgData: [],
				teamData: [],
				eventData: [],
				eventTypeData: [],
				eventTypeTotal: 0,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				arrPressed: [],
				arrBePressed: [],
				arrTodo: [],
				eventTotal: 0,
				valueList: [
					'报送事件总数',
					'办理中',
					'待分流',
					'已办结',
					'催办事件总数',
					'督办事件总数',
					'催办次数',
					'督办次数',
					'被催办事件总数',
					'被督办事件总数',
					'被催办次数',
					'被督办次数',
					'待办理事项总数',
					'已处理事项总数',
				]
			}
		},
		onLoad() {
			// this.checkLogin()
			// let org = uni.getStorageSync("org")
			_self = this;
			this.org = uni.getStorageSync("org")
			this.query.org_code = this.org.id
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(550);
			this.fetchData()
			// uni.getSystemInfo({
			// 	success: res => {
			// 		// 需要使用箭头函数,swiper 高度才能设置成功
			// 		this.swiperHeight = res.windowHeight - uni.upx2px(85);
			// 	}
			// });
		},
		onShow() {
			// this.checkLogin()
		},
		methods: {
			tabsChange(index) {
				this.tabsIndex = index
				this.fetchData()
			},
			fetchData() {
				uni.showLoading({
					title: '读取中...'
				})
				// 组织机构情况
				if (this.tabsIndex == 2) {
					DataVisualization.getOrgSummary(this.query).then(res => {
						console.log('data1', res)
						this.orgData = res.data.data
					})

					DataVisualization.getTeamSummary(this.query).then(res => {
						this.teamData = res.data.data
						uni.hideLoading()
					})
				}
				//报送数量
				if (this.tabsIndex == 0) {
					DataVisualization.getEventSummary(this.query).then(res => {
						this.eventData = res.data.data
						console.log(JSON.stringify(res.data.data))
						let arr = []
						let arrPress = []
						let totle = 0
						this.eventData.forEach((item, index) => {
							if (item.category == "报送事件总数") {
								this.eventTotal = item.count
							} else {
								if (index >= 1 && index <= 3) {
									arr.push({
										name: item.category.replace(/事件总数/, ""),
										data: item.count,
										// textColor:'red',
										// format:function(item){
										// 	console.log(item)
										// 	return item*100
										// }
									})
								}
							}
						})
						this.arrPressed = this.eventData.slice(4, 8)
						this.arrBePressed = this.eventData.slice(8, 12)
						this.arrTodo = this.eventData.slice(-2)
						// console.log('asdfasdf', arr)
						_self.showRing("canvasRing", arr, totle);
						uni.hideLoading()
					})
				}

				// 报送分类
				if (this.tabsIndex == 1) {
					DataVisualization.getEventTypeSummary(this.query).then(res => {
						console.log('123type', res)
						this.eventTypeData = res.data.data.anshijian_fl_01_name
						let arr = []
						this.eventTypeData.forEach(item => {
							arr.push({
								name: item.name,
								data: item.value
							})
							_self.eventTypeTotal += item.value
						})
						_self.showTypeRing("canvasTypeRing", arr, _self.eventTypeTotal);
						uni.hideLoading()
					})
				}

			},
			showRing(canvasId, chartData, totle) {
				canvaRing = new uCharts({
					$this: _self,
					canvasId: canvasId,
					padding: [20, 0, 10, 0],
					type: 'pie',
					fontSize: 12,
					color: "#000",
					legend: {
						show: true,
						fontColor: '#000',
					},
					title: {
						name: totle,
						color: '#7cb5ec',
						fontSize: 15 * _self.pixelRatio,
						offsetY: -5 * _self.pixelRatio,
					},
					subtitle: {
						name: '总数',
						color: '#666666',
						fontSize: 10 * _self.pixelRatio,
						offsetY: 5 * _self.pixelRatio,
					},
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 25 * _self.pixelRatio,
							labelWidth: 15
						},
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
				});
			},
			showTypeRing(canvasId, chartData, totle) {
				canvaTypeRing = new uCharts({
					$this: _self,
					canvasId: canvasId,
					padding: [20, 0, 10, 0],
					type: 'ring',
					fontSize: 11,
					color: "#000",
					legend: {
						show: true,
						fontColor: '#000',
						// margin:20,
						lineHeight: 20,
						itemGap: 10,
					},
					title: {
						name: totle,
						color: '#7cb5ec',
						fontSize: 17 * _self.pixelRatio,
						offsetY: -5 * _self.pixelRatio,
					},
					subtitle: {
						name: '总数',
						color: '#7cb5ec',
						fontSize: 11 * _self.pixelRatio,
						offsetY: 5 * _self.pixelRatio,
					},
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 25 * _self.pixelRatio,
							labelWidth: 15
						}
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
				});
			},
			checkLogin() {
				if (CheckUser.isLoginExpired()) {
					uni.redirectTo({
						url: '../../login/login'
					})
				}
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			touchRing(e) {
				let name = -1
				console.log('eeeeee', e)
				canvaRing.showToolTip(e, {
					format: function(item) {
						name = item.name
						return item.name + ' : ' + item.data
					}
				});
				this.gotoList(name)
			},
			gotoList(name) {
				console.log(name)
				let index = this.valueList.findIndex((value) => value === name)
				uni.navigateTo({
					url: '../eventlist/eventlist?typename=' + name + '&orgId=' + this.query.org_code + '&value=' + index
				})
			},
			touchTypeRing(e) {
				canvaTypeRing.showToolTip(e, {
					format: function(item) {
						return item.name + ' : ' + item.data
					}
				});

			},
		}
	};
</script>

<style scoped lang="scss">
	.org {
		padding: 30rpx 30rpx 0 30rpx;

		.title {
			padding: 10rpx 0;
			// border-bottom: #e1e1e1 5rpx solid;
			margin-bottom: 10rpx;
			// background-color: #F1F1F1;
		}

		.content {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.item {
				width: 50%;
				padding: 10rpx;
				border-bottom: #F1F1F1 1rpx solid;

				text {
					padding: 0 5rpx;
					letter-spacing: 1rpx;
					font-size: 0.8em;

					&:last-child {
						color: #2B85E4;
						font-size: 1em;
						font-weight: bold;
					}
				}
			}
		}
	}

	.event {
		padding: 50rpx 30rpx 0 30rpx;

		.title {
			padding: 10rpx 0;
			border-bottom: #e1e1e1 5rpx solid;
			margin-bottom: 10rpx;
			// background-color: #F1F1F1;
		}

		.content {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			border-top: #F1F1F1 1rpx solid;
			padding-top: 30rpx;

			.subtitle {
				display: flex;
				justify-content: center;
				font-size: 1.1em;
				text-align: center;
				font-weight: bold;
				width: 100%;
			}

			.item {
				width: 50%;
				padding: 10rpx;
				// border-bottom: #F1F1F1 1rpx solid;

				text {
					padding: 0 5rpx;
					letter-spacing: 1rpx;
					font-size: 0.9em;

					&:last-child {
						color: #2B85E4;
						font-size: 1.1em;
						font-weight: bold;
					}
				}
			}
		}
	}

	.charts {
		width: 750upx;
		height: 550upx;
		background-color: #FFFFFF;
	}
</style>
