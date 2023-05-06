<template>
	<view class="content">
		<view class="toppicker" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<view class="padding-lr" style="width: 40%;">
				<!-- <u-dropdown ref="uDropdown" @open="open">
					<u-dropdown-item v-model="query.workType" :title="query.workType?query.workType:'全部'" :options="typeList" @change="typeChange"></u-dropdown-item>
				</u-dropdown> -->
				<u-input type="select" :select-open="dateShow" v-model="dateValue" :border="false" placeholder="填报年月" @click="dateShow = true" />
				<u-picker mode="time" v-model="dateShow" :params="limitParams" @confirm="dateSelectConfirm"></u-picker>
			</view>
			<view class="text-right text-grey padding text-xs">
				<u-search placeholder="上报人姓名" v-model="query.reporter" :show-action="true" @search="handleSearch"></u-search>
				<!-- <button class="cu-btn round sm bg-grey">筛选<text class="cuIcon-triangledownfill"></text></button> -->
				<!-- <u-button type="success" size="mini" shape="circle" @click="handEdit">
					<u-icon name="plus" color="#fff" label="新增" label-color="#fff"></u-icon>
				</u-button> -->
			</view>
		</view>
		<u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<view v-if="tabsIndex==0" class="">
			<!-- <view class="place"></view> -->
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in showList" :key="item.id" @click="handleDelete"
			 :options="options" @content-click="handleDetailEdit(item)">
				<view>
					<view class="padding item u-border-bottom">
						<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
						<view class="title-wrap">
							<view class="padding-tb-xs">
								填报年月：{{item.submissionDate | dateFilter}}
								<u-tag :text="item.isHistoryDesc" size="mini" :type="item.isHistory?'info':'success'" style="margin-left: 15upx;" />
							</view>
							<view class="">
								<view class="text-black">
									组织名称：{{item.orgName}}
								</view>
							</view>
							<view class="text-sm padding-tb-xs">
								{{item.reporter}} 于
								{{item.createdDate}} 汇总
							</view>

						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view v-if="tabsIndex==1" class="">
			<view class="padding">
				应报组织：{{reportStatus.reportall}} 个; 已报：{{reportStatus.reported}} 个; 未报：{{reportStatus.unreported}} 个
				<text class="text-blue" @click="openList">查看</text>
			</view>
			<u-gap height="3" bg-color="#bbb"></u-gap>
			<!-- <view class="place"></view> -->
			<view v-for="(item, index) in showList" :key="item.id" :index="index">
				<view class="padding item u-border-bottom">
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="">
						<u-checkbox @change="checkboxChange" v-model="showList[index].checked" :key="item.id" :name="item.id"></u-checkbox>
					</view>
					<view class="title-wrap" @click="handleDetail(item)">
						<view class="padding-tb-xs">
							上报年月：{{item.submissionDate | dateFilter}}
							<u-tag v-if='item.isHistory' :text="item.isHistory" size="mini" :type="item.isHistory=='最新记录'?'success':'info'"
							 style="margin-left: 15upx;" />
						</view>
						<view class="">
							<view class="text-black">
								上报机构：{{item.orgName}}
							</view>
						</view>
						<view class="text-sm padding-tb-xs">
							{{item.reporter}} 于
							{{item.createdDate}} 上报
						</view>
					</view>

				</view>
			</view>
			<view class="bottom">
				<view class="" @click="popupShow=true">
					已选择：{{selectedList.length}} 条数据
					<u-icon v-if="selectedList.length>0" name="trash" label="清空" label-color="#2b85e4" margin-left="3" size="28" color="#2b85e4"
					 style="margin-left: 15upx;" @click="clearSelected">清空</u-icon>
				</view>
				<view class="">
					<u-button class="bottonbottom" type="primary" @click="handleSummarize">汇总({{selectedList.length}}个)</u-button>
				</view>
			</view>
		</view>
		<view v-if="listData.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="没有数据" mode="data"></u-empty>
		</view>
		<u-popup v-model="showUnreportedList" mode="center" width="600rpx" height="1100upx">
			<view class="padding">
				<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
					<block v-for="(item,index) in unreportedList" :key="index">
						<view :class="'indexItem-' + item.id" :id="'indexes-' + item.id" :data-index="item.id">
							<view class="cu-list menu padding-xs">
								<view class="cu-item listitem">
									<view class="content">
										<view class="text-black"><text class="text-abc">名称：{{item.name}}</text></view>
										<!-- <view class="text-black" @click="makeCall(item.mobile)">
											<text>电话：{{item.mobile}} </text>
											<u-icon class="padding-lr-xs" name="phone-fill" color="#2979ff" margin-left="60rpx"></u-icon>
										</view> -->
										<view class="text-gray text-sm">
											<!-- 所属机构：{{item.organization.name}} -->
										</view>
									</view>
									<view class="action" @click="deleteItem(item)">
										<!-- <u-icon name="bell" color="#2979ff" size="28" label="提醒" label-color="#2979ff"></u-icon> -->
									</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import KeyDataReport from '../../../api/keydatareport.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import moment from 'moment'
	export default {
		filters: {
			dateFilter(val) {
				return new moment(val).format("YYYY年MM月")
			},
			contentFilter(val) {
				if (val.length > 20) {
					return val.substring(0, 20) + '...'
				}
				return val
			}
		},
		data() {
			return {
				checkedList: [],
				selectedList: [],
				buttonLoading: false,
				dateShow: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				tabsList: [{
						name: '汇总数据'
					},
					{
						name: '下级上报数据'
					}
				],
				typeList: [],
				tabsIndex: 0,
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					sorts: '+createdDate',
					year: '',
					month: ''
				},
				dateValue: '',
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
					day: false,
				},
				reportStatus: {
					reported: 0,
					unreported: 0,
					reportall: 0
				},
				showUnreportedList: false,
				unreportedList: []
			}
		},
		computed: {

		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			// console.log(currPage)
			// console.log(currPage.query); //这就是传递的参数	
			// this.fetchList()
			this.fetchDir()
		},
		onLoad() {
			this.headerTop = this.CustomBar
			// #ifdef MP-ALIPAY
			this.headerTop = 0
			// #endif
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];

			// 设置初始值
			this.dateValue = new moment().format('YYYY年MM月')
			this.query.year = new moment().format('YYYY')
			this.query.month = new moment().format('MM')
			// 读列表
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
				_this.showList.forEach(i => {
					// _this.selectedList.push(i)
					_this.$set(i, 'checked', false)
				})
			}, 500);

		},
		methods: {
			handleDelete(index, index1) {
				var _this = this
				// console.log(index, index1)
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
					},
				})
			},
			handleSummarize() {
				if (this.selectedList.length == 0) {
					uni.showToast({
						title: '请选择要汇总的数据',
						icon: 'none'
					})
					return
				}
				console.log('this.selectedList', this.selectedList)
				KeyDataReport.summarizeData(this.selectedList).then(res => {
					// console.log('huizong ', res)
					if (res.data.code == 0) {
						uni.showToast({
							title: '汇总成功'
						})
					} else {
						uni.showToast({
							title: '操作失败，请重试！'
						})
					}
				})
			},
			clearSelected() {
				this.selectedList = []
				this.showList.forEach(item => {
					item.checked = false
				})
			},
			checkboxChange(e) {
				if (e.value) {
					this.selectedList.push(this.showList.find(i => i.id == e.name))
				} else {
					this.selectedList.splice(this.selectedList.findIndex(i => i.id == e.id), 1)
				}
			},
			makeCall(phoneNo) {
				if (phoneNo) {
					uni.makePhoneCall({
						// 手机号
						phoneNumber: phoneNo,
						// 成功回调
						success: (res) => {
							console.log('调用成功!')
						},
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}

					});
				}

			},
			// 打开未填报人员列表
			openList() {
				console.log('eeee')
				this.showUnreportedList = true
			},
			// 查询日期选择
			dateSelectConfirm(e) {
				// console.log(e)
				// this.dataTempJB.limitTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00'
				this.query.year = e.year
				this.query.month = e.month
				this.dateValue = e.year + '年' + e.month + '月'
				this.fetchList()
			},
			// 打开详情
			handleDetail(item) {
				uni.navigateTo({
					url: '../view/view?id=' + item.id
				})
			},
			handleDetailEdit(item) {
				uni.navigateTo({
					url: '../detail/detail?formType=sum&id=' + item.id
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
				this.showList = []
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
				// Bill.getTradeHistoryList(this.query).then(res => {
				// 	console.log('historybill', res)
				// })
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				if (this.tabsIndex == 0) {
					// 读取当前汇总数据
					KeyDataReport.getKeyDataReportGridList(_this.query).then(res => {
						// console.log('keydatalist', res)
						if (res.data.code == 0) {
							// _this.$nextTick(function() {
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
							// })
							if (res.data.data.content.length > 0) {
								_this.loadingVisible = true
							}
						}
						uni.hideLoading()
					})
				} else {
					// 读取下级上报数据
					KeyDataReport.getKeyDataReportList(_this.query).then(res => {
						console.log('keydatalist', res)
						if (res.data.code == 0) {
							// _this.$nextTick(function() {
							_this.listData = JSON.parse(JSON.stringify(res.data.data.keyDataList))
							//赋值选中
							_this.listData.map(item => {
								_this.$set(item, "checked", false)
								// item.checked = false
							})
							// console.log('_this.listXXX', _this.listXXX)
							// _this.listData = arr
							_this.reportStatus.reportall = res.data.data.allOrgCount
							_this.reportStatus.unreported = res.data.data.notReportOrgCount
							_this.reportStatus.reported = res.data.data.reportedOrgCount
							_this.unreportedList = res.data.data.notReportOrgList
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.keyDataList.slice(0, len))
							_this.showLen = len
							//处理选中
							_this.selectedList = []
							_this.showList.forEach(i => {
								// _this.selectedList.push(i)
								_this.$set(i, 'checked', false)
							})
							console.log('_this.selectedList', _this.selectedList)
							if (_this.showLen < 15 && _this.showLen > 0) {
								_this.$nextTick(function() {
									_this.loadingText = '没有更多了'
								})
							}
							// })
							if (res.data.data.keyDataList.length > 0) {
								_this.loadingVisible = true
							}
						}
						uni.hideLoading()
					})
				}


			},
			// 获取网格员报送情况
			fetcheSubmitStatus() {
				KeyDataReport.getKeyDataReportCheck().then(res => {
					console.log(res)
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

	.bottom {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15upx 30upx;
		width: 100%;
		background-color: #F1F1F1;

		.bottonbottom {
			// margin-top: 20upx;
			width: 95%;
		}
	}

	.item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
