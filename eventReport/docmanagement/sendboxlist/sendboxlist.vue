<template>
	<view class="content">
		<view class="toppicker">
			<view class="padding-lr">
				<u-search placeholder="邮件标题、内容" v-model="query.keyWord" :show-action="false" @search="handleSearch"></u-search>
			</view>
			<view class="text-right text-grey padding text-xs" @tap="openFilter">
				<!-- <button class="cu-btn round sm bg-grey">筛选<text class="cuIcon-triangledownfill"></text></button> -->
				<u-button type="success" size="mini" shape="circle" @click="actionShow=true">
					<u-icon name="plus" color="#fff" label="写邮件" label-color="#fff"></u-icon>
				</u-button>
			</view>

		</view>
		<!-- <view class="place"></view> -->
		<u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<view class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
				<view class="content" @tap="handleView(item)">
					<view class="padding-tb-sm flex align-center">
						<view class="content margin-left-sm">
							<view>
								<text class="text-black">{{item.title}}</text>
							</view>
							<view class="text-sm">
								<view class="text-black">
									级别：{{item.docLevel}} 类型：{{item.docType}}
								</view>
								<view class="text-gray">
									发件方：{{item.sendOrgName}}
								</view>
								<view class="text-gray">
									发送人：{{item.sendUserName}}
								</view>
								<view class="text-gray">
									发送时间：{{item.sendTime}}
								</view>
								<!-- <view class="text-gray">
									发送份数：{{item.sendCount}} （已签收：{{item.signedCount}}）
								</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class=" action" style="margin-top: -40upx;">
					<view class="flex justify-end text-sm" style="width: 100%;">
						共：{{item.sendCount}} 份
					</view>
					<view class="text-sm">
						签收：{{item.signedCount}} 份
					</view>
				</view>
			</view>
			<view v-if="loadingVisible" class="loading-text">{{loadingText}}</view>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
		<u-action-sheet :list="actionList" v-model="actionShow" @click="hanldEdit"></u-action-sheet>
	</view>
</template>

<script>
	import DocManagementApi from '../../../api/docmanagement.js'
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
				actionList: [{
					text: '发送给个人'
				}, {
					text: '发送给机构'
				}],
				actionShow: false,
				tabsList: [{
						name: '个人发件'
					},
					{
						name: '机构发件'
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
			hanldEdit(index) {
				let action = this.actionList[index].text
				console.log(index)
				if (action == '发送给个人') {
					uni.navigateTo({
						url: "../sendperson/sendperson"
					})
				}
				if (action == '发送给机构') {
					uni.navigateTo({
						url: '../sendorg/sendorg'
					})
				}
			},
			handleSearch() {
				this.fetchList()
			},
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
				let type = 'person'
				if (this.tabsIndex == 1) {
					type = 'org'
				}
				uni.navigateTo({
					url: '../senddetail/senddetail?type='+type+'&id=' + e.id
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
					DocManagementApi.getDocSendListPersonal(_this.query).then(res => {
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
					DocManagementApi.getDocSendListOrg(_this.query).then(res => {
						console.log('eventlist', res)
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
		background-color: #fff;
		border-bottom: 5upx solid #f8f8f8;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20upx;
	}
</style>
