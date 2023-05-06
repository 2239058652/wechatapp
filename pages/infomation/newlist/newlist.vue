<template>
	<view>
		<view class="wrap">
			<u-swiper :list="bgImageList" mode="none"></u-swiper>
		</view>
		<u-swipe-action
			:show="item.show"
			:index="index"
			v-for="(item, index) in showList"
			:key="item.id"
		>
			<view class="body-title">
				<view style="height: 100rpx;width: 100rpx;">
					<div class="scenario-circle">
						<text style="width: 60rpx;">{{item.reporter | nameFilter}}</text>
					</div>
				</view>
				<view style="width: 85%;margin-left: 1%;">
					<view @click="handleDetail(item)">
						<view class="title-text" style="min-height: 50rpx;">
							{{item.reporter}}
							<u-tag :text="item.rolesNmae" bg-color="#1941A0" size="mini" mode="dark" shape="circle" style="margin-left: 5%;" />
						</view>
						<view style="min-height: 50rpx;color: #AAAAAA;">
							{{item.orgName}}
						</view>
						<view style="padding: 0 5% 0 0;">
							<view>
								<text class="title-text">工作标题：</text>{{item.title | titleFilter}}
							</view>
							<view>
								<text class="title-text">工作类型：</text>{{item.workType}}
							</view>
							<view style="text-indent: 2em;">
								{{item.content}}
							</view>
						</view>
					</view>
					<view class="upload-files">
						<view class="upload-item-media">
							<view class="bg-img" v-for="(element,index) in item.imgList" :key="element.fileId" @click="ViewImage(item, element)" :data-url="element">
								<view class="item">
									<image
										:src="element.imgPath"
										mode="aspectFill"
										:lazy-load="true"
										@load="onoff='1'">
									</image>
								</view>
							</view>
						</view>
					</view>
					<!-- 时间和操作按钮 -->
					<view class="data-handle">
						<view style="width: 82%;">{{item.createdDate}}</view>
						<view hidden style="width: 18%;" class="u-flex u-row-between">
							<u-icon name="thumb-up" size="38" style="margin-right: 2%;" @click="give()" />
							<u-icon name="chat" size="38" style="margin-right: 2%;"  @click="comments()" />
						</view>
					</view>
					<!-- 点赞及评论展示 -->
					<view hidden class="thumbUpComments" @click="handleDetail(item)">
						<!-- 点赞 -->
						<view class="give u-line-3">
							<u-icon name="thumb-up" size="32" style="margin-right: 2%;" />{{ dianzanName }}
						</view>
						<u-gap height="3" bg-color="#bbb"></u-gap>
						<!-- 评论展示 -->
						<view class="comments" v-for="comment in commentList" :key="comment.id">
							<view>{{ comment.userName }}:<text style="color: #000000;margin-left: 1%;">{{ comment.content }}</text></view>
						</view>
					</view>
				</view>
			</view>
		</u-swipe-action>
		<view v-if="showList.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="暂无平安动态数据" mode="data"></u-empty>
		</view>

		<u-modal
			v-model="showInput"
			:show-cancel-button="true"
			@confirm="confirmCancle"
			title="想说点什么呢..."
			>
				<view class="slot-content">
					<view style="padding: 20rpx;">
						<view style="margin-top: 1vh;">
							<u-input v-model="evaluationContent" type="textarea"
								height="280" :border="true"
								placeholder="想说点什么呢..........."
							/>
						</view>
					</view>
				</view>
		</u-modal>
	</view>
</template>

<script>
	import WorkReportApi from '../../../api/workreport.js'
	import FileApi from '../../../api/fileupload.js'
	import JsUtils from '../../../utils/index.js'
	import UserApi from '../../../api/user.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		filters: {
			nameFilter(val) {
				return val.substring(val.length-2)
			},
			titleFilter(val) {
				if (val == null) {
					return val = '工作上报'
				} else if (val.length > 15) {
					return val.substring(0, 15) + '...'
				}
				return val
			}
		},
		data() {
			return {
				bgImageList: [
					{image: '/static/img/padt.png'}
				],
				showList: [],
				showTempList: [],
				isPreview: false,
				totalPages: 1,
				query: {
					page: 1,
					limit: 10,
				},
				loadingText: "正在加载...",
				loadingVisible: false,
				afterHeaderOpacity: 1, //不透明度
				openId: '',
				commentList: [
					{id: '2', userName: '网格员一', content: '饭块好了，抓紧过来吃点，不然待会就没有了噶'},
					{id: '3', userName: '工作人员一', content: '老铁、可以可以'},
					{id: '4', userName: '领导一', content: '继续观察，仔细认真'}
				],
				dianzanName: '网格员1，网格员2，网格员3，网格长1，网格长2，网格长3，网格长4、工作人员1,工作人员2，工作人员3，工作人员2，工作人员3，领导1，领导2、领导3，领导4,领导1，领导2、领导3，领导4，工作人员2，工作人员3，领导1，领导2、领导3，领导4',
				showInput: false,
				evaluationContent: ''
			}
		},
		onShow() {},
		onLoad() {
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
			this.fetchList()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.query.page = 1
			this.query.limit = 15
			this.showList = []
			this.totalPages = 1
			this.fetchList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			var _this = this
			this.loadingVisible = true
			if (this.query.page == this.totalPages) {
				this.loadingText = '没有更多了！'
				return false;
			}
			setTimeout(function() {
				_this.query.page += 1
				_this.fetchList()
			}, 500)
		},
		methods: {
			// 获取工作上报列表
			fetchList() {
				var _this = this
				uni.showLoading({
					title: '获取平安动态...',
					mask: true
				})
				WorkReportApi.getPublicWorkReportList(_this.query).then(res => {
					if (res.data.code == 0) {
						_this.showTempList = res.data.data.content
						_this.showTempList.forEach(element => {
							element.rolesNmae = element.roles[0].name
							this.$set(element,'imgList',[])
							element.files.forEach(item => {
								this.$set(item, 'fileType', JsUtils.getFileType(item.name))
								FileApi.downloadFileByUni(item.id).then(i => {
									element.imgList.push({
										imgPath: i[1].tempFilePath,
										fileId: item.id,
										fileType: item.fileType
									})
								})
							})
							_this.showList.push(element)
						})
						_this.totalPages = res.data.data.totalPages
						if (_this.totalPages == this.query.page) {
							_this.loadingText = '没有更多了！'
						}
						if (_this.showList.length <= 0) {
							_this.loadingVisible = false
						}
						setTimeout(function() {
							uni.hideLoading()
						}, 1500);
					}
				})
			},
			// 点赞
			give() {
				uni.showToast({
					title: '赞了他一下！',
					icon: 'none'
				})
			},
			// 评论
			comments() {
				this.showInput = true; //调起input框
			},
			confirmCancle() {
				this.showInput = true; //调起input框
			},
			// 查看详情
			handleDetail(item) {
				this.openId = uni.getStorageSync('openId')
				if (this.openId != '') {
					uni.navigateTo({
						url: './view?id=' + item.id + '&openId=' + this.openId
					})
				}
			},
			// 查看图片
			ViewImage(e, v) {
				this.isPreview = true
				let arr = Array.from(e.imgList, ({
					imgPath
				}) => imgPath)
				uni.previewImage({
					urls: arr,
					current: v.imgPath
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 40rpx;
	}
	.nodata {
		height: calc(70vh);
		flex-direction: column;
		image {
			width: 100upx;
			height: 0;
		}
	}
	.body-title {
		display: flex;
		width: 100%;
		border-bottom: 5upx solid #f1f1f1;
		border-top: 5upx solid #f1f1f1;
		padding: 2% 0 2% 5%;
	}
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.action{
		width: 30%;
		min-width: 200rpx;
	}
	.scenario-circle{
		width:85rpx;
		height:85rpx;
		border: 2px solid #ececec;
		display: flex;
		color: #ffffff;
		font-size: 1em;
		background-color: #1941A0;
		font-weight: 550;
		align-items: center;
		justify-content: center;
		word-break:break-all;
		border-radius: 20%;
	}
	.upload-files {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-top: 1%;
		.upload-item-media {
			display: flex;
			flex: 1;
			flex-wrap: wrap;
			image {
				width: 185upx;
				height: 185upx;
				padding: 2%;
			}
		}
	}
	.title-text {
		font-weight: bold;
		color: #000000;
	}
	.data-handle {
		margin-top: 1vh;
		width: 92%;
		display: flex;
		color: #AAAAAA;
	}
	.thumbUpComments {
		margin-top: 1vh;
		border-radius: 5px;
		background-color: #ececec;
		color: #1261D4;
		width: 92%;
		.give {
			font-size: small;
			height: 9vh;
			line-height: 3vh;
		}
		.comments {
			line-height: 3vh;
		}
	}
</style>
