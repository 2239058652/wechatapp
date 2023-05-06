<template>
	<view>
		<view class="icon-title">
			<u-icon name="edit-pen" size="45" />填报内容
		</view>
		<view class="report-viewarea">
			<view class="public-view-form">
				<u-form :model="dataTemp" ref="uForm" label-width="150" :error-type="errorType">
					<u-form-item label="诉求类型:">
						{{dataTemp.appealTypeDesc}}
					</u-form-item>
					<u-form-item label="诉求内容:">
						{{dataTemp.content}}
					</u-form-item>
					<u-form-item>
						<view class="upload-media">
							<view class="upload-video">
								<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @click="ViewImage" :data-url="imgList[index].imgPath">
									<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								</view>
								<view v-if="imgList.length<=0" class="solids uploadIcon">
									<u-icon class="icon" color="#8799a3" size="48" name="camera" label="未上传照片" label-pos="bottom"></u-icon>
								</view>
							</view>
						</view>
					</u-form-item>
					<u-form-item>
						<view class="upload-media">
							<view class="upload-video">
								<view class="bg-img item" v-for="(item,index) in videoList" :key="index" :data-url="videoList[index]">
									<video id="myVideo" :src="videoList[index].videoPath" x5-video-player-fullscreen="true"></video>
								</view>
								<view v-if="videoList.length<=0" class="solids uploadIcon">
									<u-icon class="icon" color="#8799a3" size="48" name="camera" label="未上传视频" label-pos="bottom"></u-icon>
								</view>
							</view>
						</view>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="icon-title">
			<u-icon name="chat" size="45" />回复内容
		</view>
		<view class="report-viewarea">
			<view v-if="dataTemp.appealOnekeyReportAnswers.length !== 0" class="answer-content">
				{{dataTemp.appealOnekeyReportAnswers[0].content}}
			</view>
			<view v-if="dataTemp.appealOnekeyReportAnswers.length === 0" class="answer-content">
				暂无回复内容，请您耐心等候......
			</view>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import MassAppealApi from '../../../api/massAppeal.js'
	export default {
		filters: {
			contentFilter(val) {
				if (!val) {
					return '无'
				}
				return val
			}
		},
		components: {},
		data() {
			return {
				dataTemp: {
					audioFiles: [],
					content: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					videoFiles: [],
					imageFiles: [],
					appealOnekeyReportAnswers: []
				},
				imgList: [],
				videoList: [],
				errorType: ['toast', 'border']
			}
		},
		onLoad(option) {
			this.reportId = option.id
			this.fetchDetail()
		},
		onShow() {},
		onReady() {},
		methods: {
			//加载一键举报信详情
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				MassAppealApi.getMassAppealDetail(this.reportId).then(res => {
					if (res.data.code == 0) {
						Object.assign(this.dataTemp, res.data.data)
						this.dataTemp.jsonGeo = {
							// lat: 22.016621,
							// lng: 100.806326
							lat:this.dataTemp.geometryWktY,
							lng: this.dataTemp.geometryWktX
						}
						this.dataTemp.videoFiles.forEach(item => {
							FileApi.downloadFileByUni(item.id).then(i => {
								_this.videoList.push({
									videoPath: i[1].tempFilePath,
									fileId: i[1].id
								})
							})
						})
						this.dataTemp.imageFiles.forEach(item => {
							FileApi.downloadFileByUni(item.id).then(i => {
								_this.imgList.push({
									imgPath: i[1].tempFilePath,
									fileId: i[1].id
								})
							})
						})
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			ViewImage(e) {
				let arr=Array.from(this.imgList,({imgPath})=>imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.public-view-form {
		padding: 0upx 40upx;
	}
	.report-viewarea {
		border-radius: 15px;
		border: 1px #909399 solid;
		margin:1% 2% 2% 2%;
		min-height: 350rpx;
		color: #000000;
	}
	.icon-title {
		padding: 0upx 20upx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
	}
	.answer-content {
		padding: 10px;
		text-indent: 2em;
		line-height: 50rpx;
	}
	.upload-media {
		// border: #F1F1F1 1upx solid;
		width: 100%;
		display: flex;
		align-items: center;
		justify-items: flex-start;
	}
	.uploadIcon {
		text-align: center;
		width: 25%;
		height: 150upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.icon {
			// margin-top: 40upx;
		}
		.uploadText {
			// margin-top: 75upx;
		}
	}
	.upload-video {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		flex: 1;
		padding: 10upx;

		.item {
			width: 150upx;
			height: 150upx;
		}

		video {
			border: #F1F1F1 1upx solid;
			width: 100%;
			height: 100%;
		}

		image {
			border: #F1F1F1 1upx solid;
			width: 100%;
			height: 100%;
		}
	}
	.actionPopup {
		padding: 20upx;
	}
	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 25rpx;
	}

	.u-order-title.unacive {
		color: rgb(150, 150, 150);
	}

	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 18rpx;
		margin-bottom: 6rpx;
	}
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 16rpx;
	}
	.tel {
		color: $u-type-primary;
	}
	.upload-files {
		border: #F1F1F1 1upx solid;
		width: 100%;
		display: flex;
		align-items: center;
		justify-items: flex-start;
		height: 100upx;

		.upload-files-img {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			flex: 1;
			padding: 10upx;
			width: 150upx;
			height: 110upx;

			.item {
				// width: 50upx;
				// height: 50upx;
			}
		}

		.uploadFileIcon {
			height: 90upx;
			width: 90upx;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		image {
			border: #F1F1F1 1upx solid;
			width: 90upx;
			height: 90upx;
		}

		.icon-file-delete {
			width: 30upx;
			height: 30upx;
			position: relative;
			right: 20upx;
			top: -75upx;
			// background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
			// border-top-right-radius: 20upx;
			// border-bottom-left-radius: 20upx;
		}

	}
</style>
