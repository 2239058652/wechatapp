<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item label="工作标题:" :required="true" prop="title">
					<u-input v-model="dataTemp.title" autosize :border="true" placeholder="请输入工作标题" />
				</u-form-item>
				<u-form-item label="工作类型:" :required="true" prop="workType">
					<u-input type="select" :select-open="typeSelectShow" :border="true" v-model="dataTemp.workType" placeholder="请选择类型"
					 @click="typeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="typeList" v-model="typeSelectShow"
					 @confirm="typeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="上报时间:" :required="true" prop="reporterDate">
					<u-input type="select" :select-open="reportDateShow" v-model="dataTemp.reporterDate" :border="true" placeholder="请填写上报时间"
					 @click="reportDateShow = true" />
					<u-calendar v-model="reportDateShow" mode="date" @change="dateSelectConfirm"></u-calendar>
				</u-form-item>
				<u-form-item label="上报内容:" :required="true" prop="content">
					<u-input v-model="dataTemp.content" type="textarea" height="150" :border="true" placeholder="请填写工作情况上报内容" />
				</u-form-item>
				<u-form-item label="工作照片:">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="item.imgPath">
								<image :src="item.imgPath" mode="aspectFill"></image>
								<view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="ChooseImage">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="点击添加" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="button">
			<u-button type="primary" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
		<view style="padding: 5%;">
			<u-checkbox-group>
				<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in whetherThePublicList" :key="index"
				 :name="item.name">{{item.name}}</u-checkbox>
			</u-checkbox-group>
		</view>
		<u-action-sheet :list="fileActionList" v-model="fileActionShow" @click="handleFileChoose"></u-action-sheet>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import WorkReportApi from '../../../api/workreport.js'
	import moment from 'moment'
	export default {
		data() {
			return {
				fileActionShow: false,
				fileActionList: [{
					text: '照片',
				}, {
					text: '视频'
				}, {
					text: '其他文件'
				}],
				whetherThePublicList: [{
					name: '同意公开工作情况上报内容',
					checked: true
				}],
				reportDateShow: false,
				dataTemp: {
					title: '',
					workType: '',
					workTypeCode: '',
					reporterDate: '',
					fileIds: [],
					content: '',
					publicFlag: ''
				},
				imgList: [],
				typeList: [],
				typeSelectShow: false,
				rules: {
					title: [{
						required: true,
						message: '请填写工作标题',
						trigger: 'change'
					}],
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
		onLoad() {
			this.dataTemp.reporterDate = new moment().format('YYYY-MM-DD')
			this.fetchDir()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 同意公开工作情况上报内容
			checkboxChange(e) {
				// console.log(e);
			},
			// 保存数据
			// saveData() {
			// 	var _this = this
			// 	this.$refs.uForm.validate(valid => {
			// 		if (valid) {
			// 			// 处理图片
			// 			_this.imgList.forEach(item => {
			// 				_this.dataTemp.fileIds.push(item.fileId)
			// 			})
			// 			if (this.whetherThePublicList[0].checked == true) {
			// 				_this.dataTemp.publicFlag = 0
			// 			} else if (this.whetherThePublicList[0].checked == false) {
			// 				_this.dataTemp.publicFlag = 1
			// 			} else {
			// 				_this.dataTemp.publicFlag = 0
			// 			}
			// 			WorkReportApi.addWorkReport(this.dataTemp).then(res => {
			// 				if (res.data.code === 0) {
			// 					uni.showToast({
			// 						title: '上报成功',
			// 						icon: 'none'
			// 					})
			// 					setTimeout(function() {
			// 						uni.navigateBack({
			// 							delta: 1
			// 						});
			// 					}, 1500)
			// 				} else {
			// 					uni.showToast({
			// 						title: '报送失败:' + res.data.desc,
			// 						icon: 'none'
			// 					})
			// 					_this.buttonLoading = false
			// 				}
			// 			})
			// 		} else {
			// 			console.log('验证失败');
			// 		}
			// 	});
			// },
			// 保存数据
			saveData() {
				var _this = this
				if (this.dataTemp.workTypeCode == '04') {
					if (this.dataTemp.content.indexOf('巡逻') != -1 || this.dataTemp.content.indexOf('巡查') != -1 ||
						this.dataTemp.content.indexOf('网格') != -1) {
						uni.showModal({
							title: '温馨提示',
							content: '您当前选择的工作类型是“其他日常工作情况”，是否考虑选择“网格巡查”再提交？',
							success: function(i) {
								if (i.confirm == true) {
									_this.$refs.uForm.validate(valid => {
										if (valid) {
											// 处理图片
											_this.imgList.forEach(item => {
												_this.dataTemp.fileIds.push(item.fileId)
											})
											if (_this.whetherThePublicList[0].checked == true) {
												_this.dataTemp.publicFlag = 0
											} else if (_this.whetherThePublicList[0].checked == false) {
												_this.dataTemp.publicFlag = 1
											} else {
												_this.dataTemp.publicFlag = 0
											}
											WorkReportApi.addWorkReport(_this.dataTemp).then(res => {
												if (res.data.code === 0) {
													uni.showToast({
														title: '工作上报填报成功，又是努力工作的一天，加油哦！',
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
										} else {
											console.log('验证失败');
										}
									});
								}
							}
						})
					} else if (this.dataTemp.content.indexOf('特殊') != -1 || this.dataTemp.content.indexOf('人群') != -1 ||
						this.dataTemp.content.indexOf('重点') != -1 || this.dataTemp.content.indexOf('管理') != -1) {
						uni.showModal({
							title: '温馨提示',
							content: '您当前选择的工作类型是“其他日常工作情况”，是否考虑选择“重点人群管理”再提交？',
							success: function(i) {
								if (i.confirm == true) {
									_this.$refs.uForm.validate(valid => {
										if (valid) {
											// 处理图片
											_this.imgList.forEach(item => {
												_this.dataTemp.fileIds.push(item.fileId)
											})
											if (_this.whetherThePublicList[0].checked == true) {
												_this.dataTemp.publicFlag = 0
											} else if (_this.whetherThePublicList[0].checked == false) {
												_this.dataTemp.publicFlag = 1
											} else {
												_this.dataTemp.publicFlag = 0
											}
											WorkReportApi.addWorkReport(_this.dataTemp).then(res => {
												if (res.data.code === 0) {
													uni.showToast({
														title: '工作上报填报成功，又是努力工作的一天，加油哦！',
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
										} else {
											console.log('验证失败');
										}
									});
								}
							}
						})
					} else if (this.dataTemp.content.indexOf('法治') != -1 || this.dataTemp.content.indexOf('宣传') != -1 ||
						this.dataTemp.content.indexOf('宣讲') != -1) {
						uni.showModal({
							title: '温馨提示',
							content: '您当前选择的工作类型是“其他日常工作情况”，是否考虑选择“法治宣传”再提交？',
							success: function(i) {
								if (i.confirm == true) {
									_this.$refs.uForm.validate(valid => {
										if (valid) {
											// 处理图片
											_this.imgList.forEach(item => {
												_this.dataTemp.fileIds.push(item.fileId)
											})
											if (_this.whetherThePublicList[0].checked == true) {
												_this.dataTemp.publicFlag = 0
											} else if (_this.whetherThePublicList[0].checked == false) {
												_this.dataTemp.publicFlag = 1
											} else {
												_this.dataTemp.publicFlag = 0
											}
											WorkReportApi.addWorkReport(_this.dataTemp).then(res => {
												if (res.data.code === 0) {
													uni.showToast({
														title: '工作上报填报成功，又是努力工作的一天，加油哦！',
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
										} else {
											console.log('验证失败');
										}
									});
								}
							}
						})
					} else {
						_this.$refs.uForm.validate(valid => {
							if (valid) {
								// 处理图片
								_this.imgList.forEach(item => {
									_this.dataTemp.fileIds.push(item.fileId)
								})
								if (_this.whetherThePublicList[0].checked == true) {
									_this.dataTemp.publicFlag = 0
								} else if (_this.whetherThePublicList[0].checked == false) {
									_this.dataTemp.publicFlag = 1
								} else {
									_this.dataTemp.publicFlag = 0
								}
								WorkReportApi.addWorkReport(_this.dataTemp).then(res => {
									if (res.data.code === 0) {
										uni.showToast({
											title: '工作上报填报成功，又是努力工作的一天，加油哦！',
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
							} else {
								console.log('验证失败');
							}
						});
					}
				} else {
					_this.$refs.uForm.validate(valid => {
						if (valid) {
							// 处理图片
							_this.imgList.forEach(item => {
								_this.dataTemp.fileIds.push(item.fileId)
							})
							if (_this.whetherThePublicList[0].checked == true) {
								_this.dataTemp.publicFlag = 0
							} else if (_this.whetherThePublicList[0].checked == false) {
								_this.dataTemp.publicFlag = 1
							} else {
								_this.dataTemp.publicFlag = 0
							}
							WorkReportApi.addWorkReport(_this.dataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '工作上报填报成功，又是努力工作的一天，加油哦！',
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
						} else {
							console.log('验证失败');
						}
					});
				}
			},
			// 取数据字典
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
					this.dataTemp.workType = val.label
					this.dataTemp.workTypeCode = val.value
				})
			},
			handleFileChoose(index) {
				let action = this.fileActionList[index].text
				switch (action) {
					case '照片':
						this.ChooseImage()
						break;
					case '视频':
						this.ChooseImage()
						break;
				}
			},
			//选择图片表单中
			ChooseImage() {
				var _self = this
				uni.chooseImage({
					count: 9, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(item => {
							FileApi.uploadFileByUni(item).then(resupload => {
								console.log(resupload[1])
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
									_self.imgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
									console.log(_self.imgList)
								}
							})
						})
					}
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			dateSelectConfirm(e) {
				console.log("e: ", e);
				this.dataTemp.reporterDate = e.result
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
		flex: 1;
		flex-wrap: wrap;
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
		width: 90%;
		margin: 0 auto;
	}
</style>
