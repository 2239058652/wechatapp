<template>
	<view>
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent == 0" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="150" :error-type="errorType">
				<u-form-item label="举报类型:">
					{{dataTemp.typeDesc}}
				</u-form-item>
				<u-form-item label="举报对象所属组织:" label-width="250">
					{{dataTemp.objectDesc}}
				</u-form-item>
				<u-form-item label="联系方式:">
					{{dataTemp.contact}}
				</u-form-item>
				<u-form-item label="举报内容:">
					{{dataTemp.content}}
				</u-form-item>
				<u-form-item label="照片附件:">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @click="ViewImage" :data-url="imgList[index].imgPath">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
							</view>
							<view v-if="imgList.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="未上传" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="视频附件:">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in videoList" :key="index" :data-url="videoList[index]">
								<video id="myVideo" :src="videoList[index].videoPath" x5-video-player-fullscreen="true"></video>
							</view>
							<view v-if="videoList.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="未上传" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view v-if="sectionCurrent == 1" class="form">
			<u-time-line>
				<view v-if="timelineList.length != 0">
					<u-time-line-item v-for="(item,index) in timelineList" :key="index">
						<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
						<template v-slot:node>
							<view class="u-node" style="background: #FFFFFF;">
								<!-- 此处为uView的icon组件 -->
								<u-icon name="arrow-down-fill" color="#19be6b" :size="24"></u-icon>
							</view>
						</template>
						<template v-slot:content>
							<u-card :show-head="false" margin="0rpx 0rpx 0 0rpx" style="width: 100%;">
								<view class="content" slot="body">
									<view style="color: #000000;font-weight: 600;">回复内容：{{item.content}}</view>
									<view>{{item.orgName}} —— {{item.userName}}于{{item.createdDate}}回复。</view>
								</view>
							</u-card>
						</template>
					</u-time-line-item>
				</view>
				<view class="flex justify-between button" style="margin-bottom: 2%;">
					<view v-if="timelineList.length == 0">暂无回复内容....</view>
					<u-button type="primary" @click="popupShow = true" :loading="buttonLoading">添加回复</u-button>
				</view>
			</u-time-line>
		</view>
		<view v-if="sectionCurrent == 2" class="">
			<MapView ref="mapView" :coordinate="(dataTemp.jsonGeo)"></MapView>
		</view>
		<u-popup v-model="popupShow" mode="bottom" height="600rpx">
			<view class="padding">
				<u-form :model="anwserDataTemp" ref="uFormYJ" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item prop="content">
						<u-input v-model="anwserDataTemp.content" type="textarea" height="300" :border="true" placeholder="请填写回复内容" />
					</u-form-item>
				</u-form>
				<view style="margin-top: 100rpx;">
					<u-button type="primary" @click="handelAnswer()" :loading="buttonLoading">提交</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import KeyReportApi from '../../../api/keyReport.js'
	import MapView from '../../eventhandle/mapview/mapview'
	export default {
		filters: {
			contentFilter(val) {
				if (!val) {
					return '无'
				}
				return val
			}
		},
		components: {
			MapView
		},
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
				},
				timelineList: [],
				buttonLoading: false,
				popupShow: false,
				anwserDataTemp: {
					content: '',
					sourceId: '',
					sourceType: 0
				},
				imgList: [],
				videoList: [],
				errorType: ['toast', 'border'],
				tabsList: [
					{ name: '填报信息' },
					{ name: '回复情况' },
					{ name: '地理位置' },
				],
				sectionCurrent: 0
			}
		},
		onLoad(option) {
			this.reportId = option.id
			this.anwserDataTemp.sourceId = option.id
			this.fetchDetail()
		},
		onShow() {},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			//加载一键举报信详情
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				KeyReportApi.getKeyReportDetail(this.reportId).then(res => {
					console.log('getEventDetail',res)
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
						this.timelineList = this.dataTemp.appealOnekeyReportAnswers
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			// 回复
			handelAnswer() {
				if (this.anwserDataTemp.content == '') {
					uni.showToast({
						title: '请填写回复内容。',
						icon: 'none'
					})
				} else{
					KeyReportApi.appealReportAnswer(this.anwserDataTemp).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: '回复成功。',
								icon: 'none'
							})
							this.popupShow = false
						} else {
							uni.showToast({
								title: '加载失败，请返回后重试',
								icon: 'none'
							})
						}
					})
				}
			},
			sectionChange(index) {
				this.sectionCurrent = index
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
	.form {
		padding: 20upx 40upx;
	}

	.upload-media {
		border: #F1F1F1 1upx solid;
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

	.icon-delete {
		width: 30upx;
		height: 30upx;
		position: relative;
		right: -110upx;
		top: -185upx;
		// background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
		color: #FFFFFF;
		z-index: 999;
		border-radius: 50px;
		// border-top-right-radius: 20upx;
		// border-bottom-left-radius: 20upx;
	}

	.button {
		width: 70%;
		margin: 0 auto;
	}

	.actionPopup {
		padding: 20upx;
	}

	.wrap {
		padding: 24rpx 24rpx 24rpx 40rpx;
	}

	.u-node {
		width: 16rpx;
		height: 16rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
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
