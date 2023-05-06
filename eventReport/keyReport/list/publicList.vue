<template>
	<view class="content">
		<view class="cu-list menu sm-border">
			<view v-for="(item,index) in showList" :key="item.id" class="cu-item">
				<view class="content" @tap="handleView(item)">
					<view class="padding-tb-sm flex align-center">
						<view class="content margin-left-sm">
							<view>
								<text class="text-black" style="font-weight: bold;font-size: 34rpx;">举报对象所属组织：{{item.objectDesc}}</text>
							</view>
							<view class="text-sm">
								<view class="text-gray">
									联系方式：{{item.contact}}
								</view>
								<view class="text-gray">
									填报时间：{{item.createdDate}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class=" action" style="margin-top: -40upx;">
					<view class="flex justify-end text-sm" style="width: 100%;">
						<u-tag :text="item.typeDesc" mode="dark" :type="item.statusDescType" />
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
	import KeyReportApi from '../../../api/keyReport.js'
	import DictionaryApi from '../../../api/dictionary.js'
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
				reportTypeShow:false,
				reportTypeList: [],
				typeText: '',
				reportObjectShow: false,
				reportObjectList: [],
				reportObjectText: '',
				tabsIndex: 0,
				showList: [],
				showLen: 0,
				listData: [],
				query: {
					sorts: '-createdDate',
					reportOpenid: ''
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
			this.fetchList()
		},
		onLoad() {
			this.headerTop = this.CustomBar
			// #ifdef MP-ALIPAY
			this.headerTop = 0
			// #endif
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			this.fetchDir()
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
			fetchDir() {
				var _this = this
				// 取举报类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_onekey_report_type'
				}).then(res => {
					this.$nextTick(function() {
						res.data.data.forEach(item => {
							this.reportTypeList.push({
								label: item.text,
								value: item.innerId
							})
						})
						this.reportTypeList.unshift({
							label: '举报类型',
							value: '举报类型'
						})
					})
				})
				// 取举报对象
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_onekey_report_object'
				}).then(res => {
					this.$nextTick(function() {
						res.data.data.forEach(item => {
							this.reportObjectList.push({
								label: item.text,
								value: item.innerId
							})
						})
						this.reportObjectList.unshift({
							label: '举报对象所属组织',
							value: '举报对象所属组织'
						})
					})
				})
			},
			handleView(e) {
				uni.navigateTo({
					url: '../view/publicView?id=' + e.id
				})
			},
			reportTypeChange(e) {
				if (this.reportTypeList[e[0]].label == '举报类型') {
					this.typeText = '举报类型'
					this.query.type = ''
				} else {
					this.typeText = this.reportTypeList[e[0]].label
					this.query.type = this.reportTypeList[e[0]].value
				}
				this.fetchList()
			},
			reportObjectChange(e) {
				if (this.reportObjectList[e[0]].label == '举报对象所属组织') {
					this.reportObjectText = '举报对象所属组织'
					this.query.reportObject = ''
				} else {
					this.reportObjectText = this.reportObjectList[e[0]].label
					this.query.reportObject = this.reportObjectList[e[0]].value
				}
				this.fetchList()
			},
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				_this.loadingVisible = false
				let reportOpenid = uni.getStorageSync('openId')
				// let reportOpenid = 'o7sy_4tkoUTKKQcLCFRFUmPqzTPY'
				_this.query.reportOpenid = reportOpenid
				KeyReportApi.getKeyReportPublicList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.listData = res.data.data.content
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.content.slice(0, len))
							_this.showList.forEach(function(item) {
								if (item.type == '2') { item.statusDescType = 'warning'}
								else { item.statusDescType = 'error'}
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
		height: 85rpx;
		text-align: center;
		width: 100%;
		background-color: #f8f8f8;
		display: flex;
	}
	.select_text {
		width: 10%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #AAAAAA;
		margin-left: 5%;
		font-size: 45upx;
	}
</style>
