<template>
	<view class="content">
		<!-- <view class="toppicker" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }" hidden>
			<view class="flex justify-between align-center toppicker">
				<view class="">
					<view class="text-right text-grey padding text-xs" @tap="openFilter">
						
						<button class="cu-btn round sm bg-grey">筛选<text class="cuIcon-triangledownfill"></text></button>
					</view>
				</view>
				<view class="">
					<view class="text-grey padding-sm padding-right-sm text-xs">
						收入合同累计金额：¥ {{jinETotal}}
					</view>
				</view>
			</view>
		</view> -->
		<view class="toppicker">
			<view class="padding-lr">
				<u-search placeholder="通知标题、内容" v-model="query.keyWord" :show-action="false" @search="handleSearch"></u-search>
				<!-- <u-dropdown ref="uDropdown" @open="open">
					<u-dropdown-item v-model="query.workType" :title="query.workType?query.workType:'全部'" :options="typeList" @change="typeChange"></u-dropdown-item>
				</u-dropdown> -->
			</view>
			<view class="text-right text-grey padding text-xs">
				<u-button type="success" size="mini" shape="circle" @click="handEdit">
					<u-icon name="plus" color="#fff" label="发通知" label-color="#fff"></u-icon>
				</u-button>
			</view>

		</view>
		<!-- <view class="place"></view> -->
		<u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<view v-if="tabsIndex==0" class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
				<view class="content" @tap="handleView(item)">
					<view class="padding-tb-sm flex align-center">
						<view class="content margin-left-sm">
							<view>
								<text class="text-black">{{item.notify.title}}</text>
							</view>
							<view class="text-sm">
								<view class="text-black">
									级别：{{item.notify.notifyLevel}}
								</view>
								<view class="text-black">
									发送方：{{item.notify.sendOrgName}} 
								</view>
								<view class="text-grey">
									发送人：{{item.notify.sendUserName}}
								</view>
								<view class="text-grey">
									发送时间：{{item.notify.sendTime}}
								</view>
								<!-- <view class="text-black">
									接收方：{{item.receiveOrgName}}
								</view>
								<view class="text-gray">
									状态：{{ item.openedStatusDesc}}
									<text v-if="item.openedStatus==0" class="margin-left-sm">{{item.openedUserName}} 于 {{item.openedTime}} 阅</text>
								</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class=" action" style="margin-top: -40upx;">
					<view v-if="item.openedStatus ==0 " class="flex justify-end text-sm" style="width: 100%;color: #18B566;">
						{{ item.openedStatusDesc}}
					</view>
					<view v-if="item.openedStatus !=0 " class="flex justify-end text-sm" style="width: 100%;">
						{{ item.openedStatusDesc}}
					</view>
				</view>
			</view>
			<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
		</view>
		<view v-if="tabsIndex==1" class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
				<view class="content" @tap="handleView(item)">
					<view class="padding-tb-sm flex align-center">
						<view class="content margin-left-sm">
							<view>
								<text class="text-black">{{item.title}}</text>
							</view>
							<view class="text-sm">
								<view class="text-black">
									级别：{{item.notifyLevel}}
								</view>
								<view class="text-black">
									发送方：{{item.sendOrgName}} 
								</view>
								<view class="text-grey">
									发送人：{{item.sendUserName}}
								</view>
								<view class="text-grey">
									发送时间：{{item.sendTime}}
								</view>
								<view class="text-black">
									接收方：{{item.organization}}
								</view>
								<!-- <view class="text-gray">
									发送份数：{{item.sendCount}}(已阅读：{{item.openedCount}})
								</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class=" action" style="margin-top: -40upx;">
					<view class="flex justify-end text-sm" style="width: 100%;">
						发送：{{item.sendCount}} 份
					</view>
					<view class="text-sm">
						已读：{{item.openedCount}} 份
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
	import NoticetApi from '../../../api/noticemanagement.js'
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
						name: '收到的通知'
					},
					{
						name: '发出的通知'
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
			handleSearch() {
				this.fetchList()
			},
			tabsChange(index) {
				this.tabsIndex = index
				this.fetchList()
			},
			setStartDay() {
				// this.currentDate = moment().format('YYYY/MM')
				// this.endDay = moment().format('YYYY-MM')
				// this.query.year = moment().get('year');
				// this.query.month = moment().get('month') + 1;
				this.fetchList()
				// console.log(this.year + '-' + this.month)
			},
			handleView(e) {
				console.log(e)
				let type = 'receive'
				if (this.tabsIndex == 1) {
					type = 'send'
				}
				uni.navigateTo({
					url: '../detail/detail?type=' + type + '&id=' + e.id
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
					_this.query.sorts = '-openedStatus, -createdDate',
					NoticetApi.getNoticeReceiveList(_this.query).then(res => {
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
					_this.query.sorts = ''
					NoticetApi.getNoticeSendList(_this.query).then(res => {
						console.log('sendeventlist', res)
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
			handEdit() {
				uni.navigateTo({
					url: '../sendnotice/sendnotice'
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
		background-color: #fff;
		border-bottom: 5upx solid #f8f8f8;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20upx;
	}
</style>
