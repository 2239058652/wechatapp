<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item label="工作标题:">
					{{dataTemp.title}}
				</u-form-item>
				<u-form-item label="上报人:">
					{{dataTemp.reporter}}
				</u-form-item>
				<u-form-item label="所属单位:">
					{{dataTemp.orgName}}
				</u-form-item>
				<u-form-item label="上报时间:">
					{{dataTemp.createdDate}}
				</u-form-item>
				<u-form-item label="工作类型:">
					{{dataTemp.workType}}
				</u-form-item>
				<u-form-item label="上报内容:">
					<u-parse :html="dataTemp.content"></u-parse>
				</u-form-item>
				<u-form-item label="附件:">
					<view class="upload-files">
						<view class="upload-item-media">
							<view class="bg-img " v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="item.imgPath">
								<view v-if="item.fileType=='img'" class="item">
									<image :src="item.imgPath" mode="aspectFill"></image>
								</view>
								<view v-if="item.fileType=='video'" class="item">
									<video id="myVideo" :src="item.imgPath" x5-video-player-fullscreen="true"></video>
								</view>
							</view>
						</view>
						<view class="upload-item-file">
							<view class="bg-img " v-for="(item,index) in fileList" :key="index" :data-url="item.id" @click="handleOpenFile(item)">
								<view class="item">
									{{item.name}}
								</view>
								<!-- <view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view> -->
							</view>

						</view>
						<view v-if="dataTemp.files.length<=0" class="solids nofile">
							<u-icon class="icon" color="#8799a3" size="48" label-size="20" name="file-text" label="没有附件" label-pos="bottom"></u-icon>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="flex justify-between button">
			<!-- <u-button type="success" @click="saveData" :loading="buttonLoading">提交</u-button> -->
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import WorkReportApi from '../../../api/workreport.js'
	import JsUtils from '../../../utils/index.js'
	export default {
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
				rules: {
					workType: [{
						required: true,
						message: '请选择工作类型',
						trigger: ['change', 'blur'],
					}],
					reporterDate: [{
						required: true,
						message: '请选择上报时间',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写上报内容',
						trigger: 'change'
					}],
				},
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
				id: ''
			}
		},
		onLoad(option) {
			if (option.id) {
				this.id = option.id
			}
			this.fetchDir()
			this.fetchDetail()
		},
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			handleOpenFile(item) {
				console.log(item)
				let ext = JsUtils.getFileExt(item.name)
				let extArr = JsUtils.getFileExtSupport()
				if (extArr.indexOf(ext.toLowerCase()) != -1) {
					uni.showLoading({
						title: '读取中...'
					})
					FileApi.downloadFileByUni(item.id).then(i => {
						console.log(i)
						if (i[1].statusCode == 200) {
							uni.openDocument({
								filePath: i[1].tempFilePath,
								success: function(res) {
									console.log('打开文档成功');
								},
								complete: function(res) {
									uni.hideLoading()
								}
							});
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '下载失败，请重试'
							})
						}

					})
				} else {
					uni.showModal({
						title: '该文件不支持在线打开，保存到本地吗？',
						success: function(res) {
							if (res.confirm) {
								uni.showLoading({
									title: '读取中...'
								})
								FileApi.downloadFileByUni(item.id).then(i => {
									if (i[1].statusCode = 200) {
										uni.saveFile({
											tempFilePath: i[1].tempFilePath,
											success: function(res) {
												console.log('文件保存', res)
												var savedFilePath = res.savedFilePath;
												uni.hideLoading()
											},
											complete: function(res) {
												uni.hideLoading()
											}
										});
									} else {
										uni.hideLoading()
										uni.showToast({
											title: '下载失败，请重试'
										})
									}

								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				}

			},
			fetchDetail() {
				var _this = this
				WorkReportApi.getWorkReportDetail(this.id).then(res => {
					console.log(res)
					_this.dataTemp = Object.assign({}, res.data.data)
					_this.dataTemp.files.forEach(item => {
						// FileApi.downloadFileByUni(this.dataTemp.picture).then(i => {
						// 	_this.imgList.push({
						// 		imgPath: i[1].tempFilePath,
						// 		fileId: this.dataTemp.picture
						// 	})
						// })
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
					console.log('_this.fileList', _this.fileList)
				})
			},
			// 保存数据
			saveData() {
				var _this = this
				this.$refs.uForm.validate(valid => {
					// 处理图片
					_this.imgList.forEach(item => {
						_this.dataTemp.picture = item.fileId
					})
					// console.log('valid', valid)
					if (valid) {
						_this.buttonLoading = true
						WorkReportApi.addWorkReport(this.dataTemp).then(res => {
							console.log('上报结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '上报成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									});
								}, 1500)
							} else {
								uni.showToast({
									title: '报送失败:' + res.data.desc,
									icon: 'none'
								})
								_this.buttonLoading = false
							}
						})
						console.log('验证通过');
						console.log(this.dataTemp)
					} else {
						console.log('验证失败');
						_this.buttonLoading = false
					}
				});
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 取事件级别
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_gongzuo_qksb'
				}).then(res => {
					this.$nextTick(function() {
						this.typeList = res.data.data
					})

				})
			},
			typeSelectConfirm(e) {
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTemp.workType = val.label
					this.dataTemp.workTypeCode = val.value
				})
			},
			//选择图片表单中
			ChooseImage() {
				var _self = this

				uni.chooseImage({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(item => {
							FileApi.uploadFileByUni(item).then(resupload => {
								console.log(resupload[1])
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
									_self.imgList.length = 0
									_self.imgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
								}
							})
						})
						// if (this.imgList.length != 0) {
						// 	this.imgList = this.imgList.concat(res.tempFilePaths)
						// } else {
						// 	this.imgList = res.tempFilePaths
						// }
						console.log('选择的图片', res)


					}
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			ViewImage(e) {
				console.log(e)
				console.log(this.imgList)
				let arr = Array.from(this.imgList, ({
					imgPath
				}) => imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			},
			dateSelectConfirm(e) {
				this.dataTemp.reporterDate = e.year + '-' + e.month + '-' + e.day
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

	.upload-files {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		// flex: 1;
		flex-wrap: wrap;
		padding: 10upx;

		.upload-item-media {
			display: flex;
			flex: 1;
			flex-wrap: wrap;

			image {
				width: 120upx;
				height: 120upx;
			}
		}

		.nofile {
			width: 120rpx;
			height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
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
</style>
