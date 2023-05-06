<template>
	<view class="content">
		<view class="toppicker" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<view class="padding-lr" style="width: 230rpx;">
				<u-input type="select" :select-open="workTypeShow" input-align="center" v-model="query.workTypeValue" :border="false"
				 placeholder="全部" @click="workTypeShow = true" />
				<u-picker mode="selector" range-key="label" :range="typeList" v-model="workTypeShow" @confirm="typeChange"></u-picker>
			</view>
			<view class="text-right text-grey padding text-xs" @tap="openFilter">
				<u-search placeholder="上报人姓名" v-model="query.reporter" :show-action="false" @search="handleSearch"></u-search>
			</view>

		</view>
		<!-- <view class="place"></view> -->
		<view :index="index" v-for="(item, index) in showList" :key="item.id" @click="handleView(item)" :options="options">
			<view class="padding item u-border-bottom">
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="title-wrap">
					<view>
						<view>
							<span style="font-weight: bold;color: #000000;">标题</span>：{{item.title | titleFilter}}
						</view>
						<view>
							<span style="font-weight: bold;color: #000000;">填报人</span>：{{item.reporter | titleFilter}}
						</view>
						<view>
							<span style="font-weight: bold;color: #000000;">填报时间</span>：{{item.createdDate}}
						</view>
						<view>
							<span style="font-weight: bold;color: #000000;">所属组织</span>：{{item.orgName | titleFilter}}
						</view>
					</view>
				</view>
				<view class="">
					<u-tag :text="item.workType" mode="light" shape="circle" />
				</view>
			</view>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import WorkReportApi from '../../../api/workreport.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import moment from 'moment'
	export default {
		filters: {
			titleFilter(val) {
				if (val.length > 10) {
					return val.substring(0, 10) + '...'
				}
				return val
			}
		},
		data() {
			return {
				workTypeShow:false,
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
					workType: '',
					reporter: '',
					workTypeValue:'全部'
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
				condition: {}
			}
		},
		computed: {

		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchList()
			this.fetchDir()
		},
		onLoad() {
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
			setTimeout(function() {
				_this.showList = _this.showList.concat(_this.listData.slice(_this.showLen, _this.showLen + 10));
				_this.showLen = _this.showLen + 10
			}, 500);

		},
		methods: {
			handleDelete(index, index1) {
				var _this = this
				console.log(index, index1)
				uni.showModal({
					content: '你即将删除该记录，确认吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('点击确认')
							WorkReportApi.deleteWorkReport(_this.showList[index].id).then(res => {
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
				this.query.year = moment().get('year');
				this.query.month = moment().get('month') + 1;
				this.fetchList()
			},
			handleView(e) {
				console.log(e)
				uni.navigateTo({
					url: '../view/view?id=' + e.id
				})
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false

				WorkReportApi.getWorkReportList(_this.query).then(res => {
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
				if (this.typeList[e[0]].label == '全部') {
					this.query.workType = ''
				} else {
					console.log(this.query)
					this.query.workType = this.typeList[e[0]].label
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

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
