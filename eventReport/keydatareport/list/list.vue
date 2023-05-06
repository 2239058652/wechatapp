<template>
	<view class="content">
		<view class="toppicker" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<view class="padding-lr" style="width: 230rpx;">
				<!-- <u-search placeholder="工作类型" v-model="query.workType" :show-action="false" @search="handleSearch"></u-search> -->
				<u-input type="select" :select-open="dateShow" input-align="center" v-model="query.dateText" :border="false" placeholder="填报年月" @click="dateShow = true" />
				<u-picker mode="time" v-model="dateShow" :params="limitParams" @confirm="dateSelectConfirm"></u-picker>
			</view>
			<view class="text-right text-grey padding text-xs" @tap="openFilter">
				<!-- <button class="cu-btn round sm bg-grey">筛选<text class="cuIcon-triangledownfill"></text></button> -->
				<u-button type="primary" size="mini" shape="circle" @click="handEdit">
					<u-icon name="plus" color="#fff" label="新增" label-color="#fff"></u-icon>
				</u-button>
			</view>

		</view>
		<!-- <view class="place"></view> -->
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in showList" :key="item.id" @click="handleDelete"
		 :options="options" @content-click="handleDetail(item)">
			<view class="padding item u-border-bottom">
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="title-wrap">
					<view class="padding-tb-xs">
						填报年月：{{item.submissionYearMonth}}
					</view>
					<view class="padding-tb-xs">
						{{item.reporter}} 于

						{{item.createdDate}} 上报
						
					</view>
					<view class="text-sm">
						<view class="text-black">
							上报网格：{{item.orgName}}
						</view>
					</view>
				</view>
			</view>
		</u-swipe-action>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import KeyDataReport from '../../../api/keydatareport.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import moment from 'moment'
	export default {
		filters: {
			// dateFilter(val){
			// 	return val.replace('-','年')
			// }
			contentFilter(val) {
				if (val.length > 20) {
					return val.substring(0, 20) + '...'
				}
				return val
			}
		},
		data() {
			return {
				dateShow: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				typeList: [],
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
					sorts: '-createdDate',
					year:'',
					month:'',
					workType: '',
					dateText: '全部',
				},
				value: '',
				currentDate: '',
				value_startTime: '点击打开 picker',
				startDay: '2020-01',
				endDay: '',
				loadingText: "正在加载...",
				loadingVisible: false,
				afterHeaderOpacity: 1, //不透明度
				// headerPosition: 'fixed',
				headerPosition: '',
				headerTop: null,
				jinETotal: 0,
				condition: {},
				limitParams: {
					year: true,
					month: true,
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
			this.fetchDir()
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
			// this.fetchDir()
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
			// 填报年月选择
			dateSelectConfirm(e) {
				console.log(e)
				this.query.year = e.year
				this.query.month = e.month
				this.query.dateText = e.year + '-' + e.month
				this.fetchList()
			},
			handleDetail(item) {
				uni.navigateTo({
					url: '../detail/detail?id=' + item.id
				})
			},
			handleDelete(index, index1) {
				var _this = this
				console.log(index, index1)
				uni.showModal({
					content: '你即将删除该记录，确认吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('点击确认')
							KeyDataReport.deleteKeyDataReport(_this.showList[index].id).then(res => {
								if (res.data.code == 0) {
									uni.showToast({
										title: '删除成功'
									})
									_this.fetchList()
								} else {
									uni.showToast({
										title: '删除失败',
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}

				})
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 取事件级别
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_gongzuo_qksb'
				}).then(res => {
					this.$nextTick(function() {
						res.data.data.forEach(item => {
							this.typeList.push({
								label: item.text,
								value: item.text
							})
						})
						this.typeList.unshift({
							label: '全部',
							value: '全部'
						})
					})

				})
			},
			tabsChange(index) {
				this.tabsIndex = index
				this.fetchList()
			},
			setStartDay() {
				this.currentDate = moment().format('YYYY/MM')
				this.endDay = moment().format('YYYY-MM')
				this.query.year = '';
				this.query.month = '';
				this.fetchList()
				// console.log(this.year + '-' + this.month)
			},
			handleView(e) {
				console.log(e)
				uni.navigateTo({
					url: '../view/view?id=' + e.id
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

				KeyDataReport.getKeyDataReportGridList(_this.query).then(res => {
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
						})
						if (res.data.data.content.length > 0) {
							_this.loadingVisible = true
						}
					}
					uni.hideLoading()
				})

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
			},
			handleSearch(e) {
				console.log(e)
				this.fetchList()
			},
			handEdit() {
				uni.navigateTo({
					url: '../detail/detail'
				})
			},
			typeChange(e) {
				if (e == '全部') {
					this.query.workType = ''
				}
				this.fetchList()
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
