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
		<!-- 纠纷列表 -->
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
								<u-tag :text="item.statusDesc" size="mini" shape="circle" type="info" />
							</view>
						</view>
						<!-- 第二行 信息行-->
						<view class="show-body">
							<view class="bodyTop" v-if="item.registNo != null">
								<u-icon name="bookmark" size="35" style="margin-right: 3%;" />
								服务编号: {{ item.registNo }}
							</view>
							<view class="bodyTop u-line-1" v-if="item.address != null">
								<u-icon name="map" size="35" style="margin-right: 3%;" />
								事件发生地: {{ item.address }}
							</view>
							<view class="bodyTop">
								<u-icon name="account-fill" size="35" style="margin-right: 3%;" />
								申报人: {{ item.linkman }}
							</view>
							<view class="bodyTop">
								<u-icon name="phone" size="35" style="margin-right: 3%;" />
								联系电话: {{item.mobile }}</view>
							<view class="bodyTop">
								<u-icon name="order" size="35" style="margin-right: 3%;" />
								服务类型: {{ item.type.text }}
							</view>
							<view class="bodyTop">
								<u-icon name="integral" size="35" style="margin-right: 3%;" />
								紧急程度: {{ item.emergencyLevelDesc }}
							</view>
							<view style="font-weight: 700;">
								<u-icon name="file-text-fill" size="35" style="margin-right: 3%;" />
								简要情况:
								<view class="bodyBottom u-line-2">{{ item.briefContent }}</view>
							</view>
						</view>
						<!-- 第三行 操作行 -->
						<view style="margin-top: 1vh;text-align: right;">
							<u-button v-if="item.status == 4 && item.evaluateStatus == 1" type="warning" size="mini" :custom-style="customStyle" @click="evaluation(item)">立即评价</u-button>
							<u-button type="success" size="mini" :custom-style="customStyle" style="margin-left: 5%;" @click="handleView(item)">查看详情</u-button>
						</view>
					</view>
				</u-card>
			</view>
			<view v-if="showList.length == 0" class="text-center justify-center flex flex-wrap padding align-center nodata" style="background-color: #FFFFFF;height: 100vh;">
				<u-empty text="暂无相应综治服务记录哦..." mode="data"></u-empty>
			</view>
		</view>
		<u-modal
			v-model="evaluationShow"
			:show-cancel-button="true"
			@confirm="confirmCancle"
			title="综治服务办理评价"
			>
			<view class="slot-content">
				<view style="padding: 20rpx;">
					<view style="height: 60rpx;">
						满意度:
						<u-rate
							:count="evaluationCount"
							v-model="evaluationValue"
							active-color="#ff9900"
							inactive-color="#b2b2b2"
							size="40"
						></u-rate>
					</view>
					<view style="margin-top: 1vh;">
						<u-input v-model="evaluationContent" type="textarea"
							height="280" :auto-height="autoHeight" :border="true"
							placeholder="请评价"
						/>
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import ZongZhiService from '@/api/zongZhiService.js'
	import moment from 'moment'
	
	export default {
		components: {},
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {
				customStyleLink: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				customStyle: {
					height: '75rpx'
				},
				tabsList: [
					{name: '全部'},
					{name: '待受理'},
					{name: '受理被拒'},
					{name: '待办理'},
					{name: '办理中'},
					{name: '待评价'},
					{name: '待回复'},
					{name: '已完成'}
				],
				tabsIndex: 0,
				activeColor: '#000000',
				showList: [],
				showLen: 0,
				listData: [],
				autoHeight: true,
				query: {
					status: '',
					openId: ''
				},
				loadingText: "正在加载...",
				loadingVisible: false,
				headerTop: null,
				jinETotal: 0,
				evaluationCount: 5,
				evaluationValue: 2,
				evaluationContent: '',
				evaluationShow: false,
				registrationId: '',
				tempFilePath: ''
			}
		},
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
			// 选项卡切换
			tabsChange(index) {
				var _this = this
				_this.tabsIndex = index
				if (index == 0) {
					_this.activeColor = '#000000'
					_this.query.status = ''
				} else if (index == 1) {
					_this.activeColor = '#000000'
					_this.query.status = 0
				} else if (index == 2) {
					_this.activeColor = '#fa3354'
					_this.query.status = 3
				} else if (index == 3) {
					_this.activeColor = '#297fff'
					_this.query.status = 1
				} else if (index == 4) {
					_this.activeColor = '#297fff'
					_this.query.status = 2
				} else if (index == 5) {
					_this.activeColor = '#ff9900'
					_this.query.status = 4
					_this.query.evaluateStatus = 1
				} else if (index == 6) {
					_this.activeColor = '#297fff'
					_this.query.status = 4
					_this.query.replyStatus = 1
				} else if (index == 7) {
					_this.activeColor = '#18b556'
					_this.query.status = 4
					_this.query.evaluateStatus = 0
					_this.query.replyStatus = 0
				}
				_this.fetchList()
			},
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
				ZongZhiService.getzzfwList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.$nextTick(function() {
							_this.listData = res.data.data.content
							var len = 0
							_this.listData.length < 15 ? len = _this.listData.length : len = 15
							_this.showList = [].concat(res.data.data.content.slice(0, len))
							_this.showList.forEach(element => {
								if (element.type != null) {
									element.typeDesc = element.type.text
								} else {
									element.typeDesc = null
								}
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
			},
			evaluation(item) {
				this.evaluationShow = true
				this.evaluationContent = ''
				this.evaluationValue = 2
				this.registrationId = item.id
			},
			confirmCancle() {
				var _self = this
				let openid = uni.getStorageSync('openId')
				ZongZhiService.zzfwRegist({
					registrationId: _self.registrationId,
					content: _self.evaluationContent,
					openId: openid,
					star: _self.evaluationValue}).then(res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '评价成功！',
							icon: 'none'
						})
						_self.fetchList()
					} else {
						uni.showToast({
							title: '评价失败。',
							icon: 'none'
						})
					}
				})
			},
			handleResult(item) {
				var _this = this
				DisputesResolvePlatform.exportMediateResult(item.id).then(res => {
					if (res.statusCode === 200) {
						_this.tempFilePath = res
						wx.saveFile({
						  tempFilePath: _this.tempFilePath,
						  success: function (res) {
							const savedFilePath = res.savedFilePath;
							// 打开文件
							wx.openDocument({
								filePath: savedFilePath,
								showMenu: true,
								success: function (res) {
									console.log('打开文档成功')
								},
							})
						  },
						  fail: function (err) {
							console.log('保存失败：', err)
						  }
						})
					} else {
						uni.showToast({
							title: '导出失败。',
							icon: 'none'
						})
					}
				})
			},
			linkMediateOnWechat() {
				uni.navigateTo({
					url: './linkMediate'
				})
			}
		}
	}
</script>

<style lang="scss">
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
	.parties-body {
		padding: 0rpx 20rpx 0rpx 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 1px #ececec solid;
	}
</style>
