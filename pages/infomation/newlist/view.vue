<template>
	<view>
		<view>
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view style="display: flex;width: 100%;padding: 0 0 2% 2%;">
					<view style="height: 100rpx;width: 100rpx;">
						<div class="scenario-circle">
							<text style="width: 60rpx;">{{dataTemp.reporter | nameFilter}}</text>
						</div>
					</view>
					<view style="width: 85%;margin-left: 1%;">
						<view>
							<view style="min-height: 50rpx;color: #000000;font-weight: 600;">
								{{dataTemp.reporter}}
							</view>
							<view style="min-height: 50rpx;color: #AAAAAA;">
								{{dataTemp.orgName}}
							</view>
							<view style="padding: 0 5% 0 0;">
								<view>
									<text style="color: #000000;font-weight: 600;">工作标题：</text>{{dataTemp.title}}
								</view>
								<view>
									<text style="color: #000000;font-weight: 600;">工作类型：</text>{{dataTemp.workType}}
								</view>
								<view style="text-indent: 2em;">
									{{dataTemp.content}}
								</view>
							</view>
						</view>
						<view class="upload-files">
							<view class="upload-item-media">
								<view class="bg-img " v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="item.imgPath">
									<view class="item">
										<image :src="item.imgPath" mode="aspectFill"></image>
									</view>
								</view>
							</view>
						</view>
						<view style="margin-top: 2%;margin-bottom: 1%;color: #AAAAAA;">
							{{dataTemp.createdDate}}
						</view>
						<view hidden class="thumbUpComments">
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
			</u-form>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import WorkReportApi from '../../../api/workreport.js'
	import moment from 'moment'
	import JsUtils from '../../../utils/index.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		filters: {
			nameFilter(val) {
				if (val != null) {
					return val.substring(val.length-2)
				}
			}
		},
		data() {
			return {
				reportDateShow: false,
				dataTemp: {
					workType: '',
					workTypeCode: '',
					reporterDate: '',
					picture: '',
					content: '',
					picture: '',
					files: []
				},
				imgList: [],
				videoList: [],
				fileList: [],
				typeList: [],
				typeSelectShow: false,
				errorType: ['toast', 'border'],
				buttonLoading: false,
				limitParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
				},
				startYear: '',
				id: '',
				openId: '',
				commentList: [
					{id: '2', userName: '网格员一', content: '饭块好了，抓紧过来吃点，不然待会就没有了噶'},
					{id: '3', userName: '工作人员一', content: '老铁、可以可以'},
					{id: '4', userName: '领导一', content: '继续观察，仔细认真'}
				],
				dianzanName: '网格员1，网格员2，网格员3，网格长1，网格长2，网格长3，网格长4、工作人员1,工作人员2，工作人员3，工作人员2，工作人员3，领导1，领导2、领导3，领导4,领导1，领导2、领导3，领导4，工作人员2，工作人员3，领导1，领导2、领导3，领导4'
			}
		},
		onLoad(option) {
			if (option.id) {
				this.id = option.id
				this.openId = option.openId
			}
			this.fetchDetail()
		},
		onReady() {},
		methods: {
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				WorkReportApi.getWorkReportDetailByOpenId({
					id: this.id,
					openId: this.openId
				}).then(res => {
					console.log(res)
					_this.dataTemp = Object.assign({}, res.data.data)
					_this.dataTemp.files.forEach(item => {
						_this.$set(item, 'fileType', JsUtils.getFileType(item.name))
						if (item.fileType == 'img') {
							FileApi.downloadFileByUni(item.id).then(i => {
								_this.imgList.push({
									imgPath: i[1].tempFilePath,
									fileId: item.id,
									fileType: item.fileType
								})
							})
						} else if (item.fileType == 'video') {
							FileApi.downloadFileByUni(item.id).then(i => {
								_this.videoList.push({
									imgPath: i[1].tempFilePath,
									fileId: item.id,
									fileType: item.fileType
								})
							})
						} else {
							_this.fileList.push(item)
						}
					})
					uni.hideLoading()
				})
			},
			ViewImage(e) {
				let arr = Array.from(this.imgList, ({
					imgPath
				}) => imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
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
