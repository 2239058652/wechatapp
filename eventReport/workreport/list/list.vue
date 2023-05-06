<template>
	<view class="content">
		<view class="toppicker" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<view class="padding-lr" style="width: 230rpx;">
				<u-input type="select" :select-open="workTypeShow" input-align="center" v-model="query.workTypeValue" :border="false"
				 placeholder="全部" @click="workTypeShow = true" />
				<u-picker mode="selector" range-key="label" :range="typeList" v-model="workTypeShow" @confirm="typeChange"></u-picker>
			</view>
			<view class="top-button text-right text-grey text-xs" @tap="openFilter">
				<u-button type="success" size="mini" shape="circle" @click="handEdit">
					<u-icon name="plus" color="#fff" label="新增" label-color="#fff"></u-icon>
				</u-button>
			</view>

		</view>
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in showList" :key="item.id" @click="handleAction"
		 :options="options" @open="handleOpen" @content-click="handleView(item)">
			<view class="padding item u-border-bottom">
				<view>
					<view>
						<span style="font-weight: bold;color: #000000;">标题</span>：{{item.title | titleFilter}}
					</view>
					<view>
						<span style="font-weight: bold;color: #000000;">内容</span>：{{item.content | titleFilter}}
					</view>
					<view>
						<span style="font-weight: bold;color: #000000;">填报时间</span>：{{item.createdDate}}
					</view>
				</view>
				<view class="action text-right">
					<u-tag :text="item.workType.substring(0,6)" mode="light" shape="circle" />
				</view>
			</view>
		</u-swipe-action>
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
				if (val.length > 15) {
					return val.substring(0, 15) + '...'
				}
				return val
			}
		},
		data() {
			return {
				workTypeShow: false,
				options: [{
					text: '修改',
					style: {
						backgroundColor: '#2979ff'
					}
				}, {
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
					workTypeValue: '全部',
					reporter: ''
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
			// console.log(this.showLen)
			setTimeout(function() {
				_this.showList = _this.showList.concat(_this.listData.slice(_this.showLen, _this.showLen + 10));
				_this.showLen = _this.showLen + 10
			}, 500);

		},
		methods: {
			handleOpen(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.showList[index].show = true;
				this.showList.map((val, idx) => {
					if (index != idx) this.showList[idx].show = false;
				})
			},
			handleAction(rowindex, actionIndex) {
				if (actionIndex == 0) {
					uni.navigateTo({
						url: '../detail/detail?id=' + this.showList[rowindex].id
					})
				} else {
					this.handleDelete(rowindex)
				}
			},
			handleDelete(rowindex) {
				var _this = this
				uni.showModal({
					content: '你即将删除该记录，确认吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('点击确认')
							WorkReportApi.deleteWorkReport(_this.showList[rowindex].id).then(res => {
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
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				_this.query.reporter = uni.getStorageSync('username')
				WorkReportApi.getWorkReportList(_this.query).then(res => {
					console.log('eventlist', res)
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.listData = res.data.data.content
							_this.listData.forEach(item => {
								_this.$set(item, 'show', false)
							})
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

		// /*  #ifdef  H5  */
		// top: 85upx;
		// /*  #endif  */
		// height: 100upx;
		// width: 100%;
		// z-index: 996;
		// background-color: #fff;
		// border-bottom: 5upx solid #f8f8f8;
		// display: flex;
		// justify-content: flex-start;
		// align-items: center;
		// padding-left: 20upx;
		.top-button {
			position: absolute;
			right: 10rpx;
			top: 20rpx;
		}
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.action {
		width: 30%;
		min-width: 200rpx;
	}
</style>
