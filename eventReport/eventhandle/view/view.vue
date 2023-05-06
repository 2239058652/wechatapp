<template>
	<view>
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent==0" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="150" :error-type="errorType">
				<u-form-item label="事件标题:">
					{{dataTemp.title}}
				</u-form-item>
				<u-form-item label="事件级别:">
					{{dataTemp.eventLevel}}
				</u-form-item>
				<u-form-item label="紧急程度:">
					{{dataTemp.eventUrgent}}
				</u-form-item>
				<u-form-item label="事件类别:" :border-bottom="false">
					{{dataTemp.eventClassificationCriteria}}
				</u-form-item>
				<!-- <u-form-item label="分类三级:">
					{{dataTemp.eventType3}}
				</u-form-item> -->
				<u-form-item label="事件内容:">
					{{dataTemp.content}}
				</u-form-item>
				<!--<u-form-item label-position="top">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
							</view>
							<view v-if="imgList.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有照片" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
				 <u-form-item label-position="top">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in videoList" :key="index" @tap="viewVideo" :data-url="videoList[index]">
								<video id="myVideo" :src="videoList[index].videoPath" x5-video-player-fullscreen="true"></video>
							</view>
							<view v-if="videoList.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有视频" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item> -->
				<u-form-item label="照片附件:">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @click="ViewImage" :data-url="imgList[index].imgPath">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view> -->
							</view>
							<!-- <view class="solids uploadIcon" @tap="ChooseImage">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
							</view> -->
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
								<!-- <view class="cu-tag bg-red icon-delete" @tap.stop="delVideo" :data-index="index">
									<text class='cuIcon-close'></text>
								</view> -->
							</view>
							<!-- <view class="solids uploadIcon" @tap="chooseVideo">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传视频" label-pos="bottom"></u-icon>
							</view> -->
							<view v-if="videoList.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="未上传" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view v-if="sectionCurrent==1" class="form">
			<u-time-line>
				<u-time-line-item v-for="(item,index) in timelineList" :key="index">
					<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
					<template v-slot:node>
						<view v-if="item.status==2101" class="u-node" style="background: #e54d42;">
							<!-- 此处为uView的icon组件 -->

						</view>
						<view v-else class="u-node" style="background: #FFFFFF;">
							<!-- 此处为uView的icon组件 -->
							<u-icon name="arrow-down-fill" color="#19be6b" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view v-if="item.status==2101">
							<view class="u-order-title">{{item.sourceOrgName}}{{item.nodeFeatureDesc}},状态：{{item.openStatusDesc}}-{{item.overtimeDesc}}</view>
							<view class="u-order-desc">
								交办意见：{{item.note | contentFilter}}
							</view>
							<view class="u-order-desc">
								受理单位：{{item.targetOrgName}}
							</view>
							<view class="u-order-time">办理时限：{{item.limitTime}}
								<u-button v-if="handleIsAuth(item)" class="margin-lr-xs" type="warning" :plain="true" @click="handlePresse(item)">催办</u-button>
							</view>

						</view>
						<view v-else>
							<view class="u-order-title">{{item.description}}</view>
							<view class="u-order-desc">{{item.content | contentFilter}}</view>
							<view class="u-order-time">{{item.recordTime}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
		<view v-if="sectionCurrent==2" class="">
			<MapView ref="mapView" :coordinate="(dataTemp.jsonGeo)"></MapView>
		</view>
		<!-- 催办弹窗 -->
		<u-popup v-model="popupShow" mode="bottom" width="600rpx" height="800rpx">
			<view class="padding">
				<u-form :model="dataTempCB" ref="uFormCB" label-width="120" :error-type="errorType" label-position="top" :border-bottom="false">

					<u-form-item label="催办意见:" prop="node">
						<u-input v-model="dataTempCB.node" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
					</u-form-item>
					<u-form-item label="办理时限:" prop="limitTime">
						<u-input type="select" :select-open="limitshow" v-model="dataTempCB.limitTime" :border="true" placeholder="请填写办理时限"
						 @click="limitshow = true" />
						<u-picker mode="time" v-model="limitshow" :params="limitParams" @confirm="limitSelectConfirm"></u-picker>
					</u-form-item>
					<u-form-item label="附件:" prop="files">
						<view class="upload-files">
							<view class="upload-files-img">
								<view class="bg-img item" v-for="(item,index) in imgFileList" :key="index" @tap="viewFileImage" :data-url="imgFileList[index]">
									<image :src="imgFileList[index].imgPath" mode="aspectFill"></image>
									<view class="cu-tag bg-red icon-file-delete" @tap.stop="delFileImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids uploadFileIcon" @tap="ChooseFileImage">
									<u-icon class="fileIcon" color="#8799a3" size="40" name="camera" label="" label-pos="bottom"></u-icon>
								</view>
							</view>
						</view>
					</u-form-item>
				</u-form>
				<u-button type="success" @click="handleSubmit" :loading="buttonLoading">提交</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import EventDetailApi from '../../../api/eventdetail.js'
	import EventWorkOutApi from '../../../api/eventworkout.js'
	import EventHandleApi from '../../../api/eventhandle.js'
	import RoleJS from '../../../utils/role.js'
	import MapView from '../mapview/mapview'
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
				imgFileList: [],
				startYear: '',
				limitParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
				},
				limitshow: false,
				popupShow: false,
				submitOrgListShow: false,
				submitOrgList: [],
				popupAssignedShow: false,
				dataTempCB: {
					files: [],
					limitTime: '',
					node: '',
					nodeId: '',
				},
				dataTemp: {
					audioFiles: [],
					content: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					eventLevel: '',
					eventLevelCode: '',
					eventType: '',
					eventTypeCode: '',
					videoFiles: [],
					eventType1: '',
					eventType2: '',
					eventType3: '',
					imageFiles: [],

				},
				departmentList: [],
				imgList: [],
				jbList: [],
				flList: [],
				fl2List: [],
				fl3List: [],
				jbSelectShow: false,
				flSelectShow: false,
				fl2SelectShow: false,
				fl3SelectShow: false,
				videoList: [],
				rules: {
					node: [{
						required: true,
						message: '请填写催办意见',
						trigger: ['change', 'blur'],
					}],
					limitTime: [{
						required: true,
						message: '请填写办理时限',
						trigger: 'change'
					}],
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				actionList: [{
					text: '办理'
				}, {
					text: '呈报'
				}, {
					text: '交办'
				}, {
					text: '上报'
				}],
				actionListShow: false,
				popupShow: false,
				currentFlowIndex: '未选择',
				leaderList: [],
				leaderListShow: false,
				nodeId: '',
				timeQuery: {
					eventId: '',
					sort: 0
				},
				tabList: [{
					name: '事件详情'
				}, {
					name: '办理流程'
				}, ],
				timelineList: [],
				tabsList: [{
					name: '事件详情'
				}, {
					name: '办理情况'
				}, {
					name: '事件位置'
				}],
				timeQuery: {
					eventId: '',
					sort: 0
				},
				sectionCurrent: 0
			}
		},
		onLoad(option) {
			console.log(option)
			this.eventId = option.id
			this.nodeId = option.nodeid
			this.fetchDetail()
		},
		onShow() {
			uni.$on('selectedOrg', (org) => {
				this.setSelectedOrg(org)
			})
			uni.$on('selectedOrgAssist', (org) => {
				this.setSelectedOrgAssist(org)
			})
			uni.$on('selectedOrgSubmit', (org) => {
				this.setSelectedOrgSubmit(org)
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			// this.$refs.uFormJB.setRules(this.rulesJB);

		},
		methods: {
			handleIsAuth(e) {
				if (RoleJS.hasRoles('gird_manage') || RoleJS.hasRoles('grid')||RoleJS.hasRoles('manage') || RoleJS.hasRoles('user')) {
					if (e.bizCode == 2000) {
						return true
					}
				}
				return false
			},
			//加载事件详情
			fetchDetail() {
				var _this = this
				this.timeQuery.eventId = this.eventId
				uni.showLoading({
					title: '读取中',
				})
				EventDetailApi.getEventTimeline(this.timeQuery).then(res => {
					console.log('timeline', res)
					this.$nextTick(function() {
						// this.timelineList = res.data.data.timeline
						let arr = []
						res.data.data.timeline.forEach(item => {
							// arr.push({
							// 	content: item.content,
							// 	recordTime: item.recordTime,
							// 	description: item.description,
							// 	id: item.id,
							// 	typeDesc: item.typeDesc,
							// 	nodeType:'已完成'
							// })
							arr.push(item)
						})
						res.data.data.currentNode.forEach(item => {
							// arr.push({
							// 	content: item.content,
							// 	recordTime: item.recordTime,
							// 	description: item.description,
							// 	id: item.id,
							// 	typeDesc: item.typeDesc
							// })
							arr.push(item)
						})
						this.timelineList = arr
						console.log('this.timelineList', this.timelineList)
					})

				})
				EventDetailApi.getEventDetail(this.eventId).then(res => {
					console.log('getEventDetail',res)
					if (res.data.code == 0) {
						Object.assign(this.dataTemp, res.data.data)
						// 打开件
						EventWorkOutApi.openEventReportWorkOut(this.nodeId).then(res => {
							console.log('打开分流件', res)
						})
						this.dataTemp.jsonGeo = {
							// lat: 22.016621,
							// lng: 100.806326
							lat:this.dataTemp.geometryWktY,
							lng: this.dataTemp.geometryWktX
						}
						this.dataTemp.title = this.decrypt(this.dataTemp.title)
						this.dataTemp.content = this.decrypt(this.dataTemp.content)
						
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
						// 读取事件分类级别
						let query = {
							code: res.data.data.eventTypeCode,
							dictSubjectId: 'dict_anshijian_fl'
						}
						// DictionaryApi.getDictionariesSelf(query).then(res => {
						// 	res.data.data.forEach((item, index) => {
						// 		_this.dataTemp['eventType' + (index + 1)] = item.text
						// 		if (index == 0) {
						// 			DictionaryApi.getDictionariesTree({
						// 				dictSubjectId: item.dictSubjectId,
						// 				parentId: item.innerId
						// 			}).then(res => {
						// 				_this.fl2List = res.data.data
						// 			})
						// 		}
						// 		if (index == 1) {
						// 			DictionaryApi.getDictionariesTree({
						// 				dictSubjectId: item.dictSubjectId,
						// 				parentId: item.innerId
						// 			}).then(res => {
						// 				_this.fl3List = res.data.data
						// 			})
						// 		}
						// 	})
						// })
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			//保存数据并流转
			async saveDataFlow() {
				var _this = this
				this.$refs.uFormYJ.setRules(this.rulesYj);
				this.$refs.uFormYJ.validate(async (valid) => {
					_this.dataTempYJ.operationNodeId = _this.nodeId
					_this.dataTempYJ.sourceNodeId = _this.nodeId
					if (valid) {
						_this.buttonLoading = true

						let result = {}
						switch (_this.currentFlowIndex) {
							case '办理':
								// 启动办理
								result = await EventWorkOutApi.eventDealWith(_this.dataTempYJ).then(response => {
									return response.data
								})
								break;
							case '呈报':
								// 启动呈报领导
								result = await EventWorkOutApi.eventSubmitLeader(_this.dataTempYJ).then(response => {
									return response.data
								})
								break;
							case '上报':
								//启动上报
								result = await EventWorkOutApi.eventSubmitOrg(_this.dataTempYJ).then(response => {
									return response.data
								})
								break;
							case '退件':
								result = await EventWorkOutApi.eventReturn(_this.dataTempYJ).then(response => {
									return response.data
								})
								break;
						}
						if (result.code == 0) {
							uni.showToast({
								title: '办理成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../index'
								});
							}, 1500)
						} else {
							uni.showToast({
								title: '提交失败' + result.desc,
								icon: 'none'
							})
							_this.buttonLoading = false
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			// 交办
			async saveDataFlowAssign() {
				console.log("sdfasdfasdfasdf", !this.$u.test.isEmpty(this.dataTempJB.notifyOrgIds));
				var _this = this
				this.$refs.uFormJB.setRules(this.rulesJB);
				this.$refs.uFormJB.validate(valid => {
					_this.dataTempJB.sourceNodeId = _this.nodeId
					if (valid) {
						_this.buttonLoading = true
						console.log('datatempyj', _this.dataTempJB)
						this.dataTemp.title = this.encrypt(_this.dataTemp.title)
						this.dataTemp.content = this.encrypt(_this.dataTemp.content)
						EventHandleApi.fixEventReport(this.dataTemp).then(async (res) => {
							console.log('报送结果', res)
							if (res.data.code === 0) {
								console.log(res.data.code)
								let result = {}
								switch (_this.currentFlowIndex) {
									case '交办':
										//交办
										_this.dataTempJB.eventId = _this.eventId
										result = await EventWorkOutApi.eventAssign(_this.dataTempJB).then(response => {
											return response.data
										})
										break;
								}
								if (result.code == 0) {
									uni.showToast({
										title: '办理成功',
										icon: 'none'
									})
									uni.redirectTo({
										url: '../index'
									})
								} else {
									uni.showToast({
										title: '提交失败' + result.desc,
										icon: 'none'
									})
									_this.buttonLoading = false
								}
								// EventHandleApi.eventStartAndFinish(_this.dataTempYJ).then(res => {
								// 	uni.showToast({
								// 		title: '报送成功',
								// 		icon: 'none'
								// 	})
								// 	setTimeout(function() {
								// 		uni.redirectTo({
								// 			url: '../todolist/todolist',
								// 		});
								// 	}, 1500)
								// })
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
					}
				});
			},
			//立即办结
			saveDataFinish() {
				var _this = this
				this.$refs.uFormYJ.setRules(this.rulesYj);
				this.$refs.uFormYJ.validate(valid => {
					_this.dataTempYJ.operationNodeId = _this.nodeId
					if (valid) {
						_this.buttonLoading = true

						EventWorkOutApi.eventFinish(_this.dataTempYJ).then(res => {
							uni.showToast({
								title: '提交成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../donelist/donelist',
								});
							}, 1500)
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			handlePresse(item) {
				this.popupShow = true
				this.dataTempCB.nodeId = item.id
				console.log('123123', item)

			},
			limitSelectConfirm(e) {
				this.dataTempCB.limitTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00'
			},
			//直接办结的附件
			ChooseFileImage() {
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
									console.log('转换', i)
									_self.imgFileList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
									console.log(_self.imgFileList)
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
			delFileImg(e) {
				this.imgFileList.splice(e.currentTarget.dataset.index, 1)
			},
			// viewFileImage(e) {
			// 	uni.previewImage({
			// 		urls: this.imgFileList,
			// 		current: e.currentTarget.dataset.url
			// 	});
			// },
			ViewImage(e) {
				let arr=Array.from(this.imgList,({imgPath})=>imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			},
			// 直接办结附件选择 end
			handleSubmit() {
				var _this = this
				this.$refs.uFormCB.setRules(this.rules);
				this.$refs.uFormCB.validate(valid => {
					// 处理附件
					_this.imgFileList.forEach(item => {
						_this.dataTempCB.files.push(item.fileId)
					})
					if (valid) {
						_this.buttonLoading = true
						EventWorkOutApi.eventPress(_this.dataTempCB).then(res => {
							uni.showToast({
								title: '保存成功，已办结',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../index',
								});
							}, 1500)
						})
					} else {
						console.log('验证失败');
					}
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
