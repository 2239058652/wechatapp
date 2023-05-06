<template>
	<view>
		<view class="form">
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
				<u-form-item label="事件类别:">
					{{dataTemp.eventClassificationCriteria}}
				</u-form-item>
				<u-form-item label="事件内容:">
					{{dataTemp.content}}
				</u-form-item>
				<u-form-item label-position="top">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="item.imgPath" mode="aspectFill"></image>
							</view>
							<view v-if="dataTemp.imageFiles.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有照片" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
				<u-form-item label-position="top">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in videoList" :key="index" @tap="viewVideo" :data-url="videoList[index]">
								<video id="myVideo" :src="item.videoPath" x5-video-player-fullscreen="true"></video>
							</view>
							<view v-if="dataTemp.videoFiles.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有视频" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="flex justify-between button">
			<u-button type="success" @click="popupShow=true;currentFlowIndex='未选择'" :loading="buttonLoading">审批</u-button>
		</view>
		<u-popup v-model="popupShow" mode="center" width="600rpx" height="550rpx" z-index="99999">
			<view class="padding">
				<u-form :model="dataTempYJ" ref="uFormYJ" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item label="审批意见:" prop="content">
						<u-input v-model="dataTempYJ.content" type="textarea" height="250" :border="true" placeholder="请填写审批意见" />
					</u-form-item>
				</u-form>
				<u-button type="success" @click="saveDataFinish" :loading="buttonLoading">提交</u-button>
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
	export default {
		data() {
			return {
				submitOrgListShow: false,
				submitOrgList: [],
				popupAssignedShow: false,
				dataTempYJ: {
					content: '',
					operationNodeId: '',
					sourceNodeId: '',
					targetUserId: '',
					targetOrgId: ''
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
				rulesYj: {
					targetUserId: [{
						required: true,
						message: '请选择需要呈报的领导',
						trigger: 'change'
					}],
					targetOrgId: [{
						required: true,
						message: '请选择上报机构',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写审批意见',
						trigger: 'change'
					}],
				},
				errorType: ['toast'],
				buttonLoading: false,
				actionListShow: false,
				popupShow: false,
				currentFlowIndex: '未选择',
				leaderList: [],
				leaderListShow: false,
				nodeId: ''
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
			//加载事件详情
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				EventDetailApi.getEventNodeDetail(this.nodeId).then(res => {
					console.log('node', res)
					this.nodeTemp = res.data.data
				})
				EventDetailApi.getEventDetail(this.eventId).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						Object.assign(this.dataTemp, res.data.data)
						// 打开件
						EventWorkOutApi.openEventReportWorkOut(this.nodeId).then(res => {
							console.log('打开分流件', res)
						})
						// 读取事件分类级别
						let query = {
							code: res.data.data.eventTypeCode,
							dictSubjectId: 'dict_anshijian_fl'
						}
						// 加载图片及视频
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
						this.dataTemp.title = this.decrypt(this.dataTemp.title)
						this.dataTemp.content = this.decrypt(this.dataTemp.content)
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			//立即办结-领导审批直接调用办结接口
			saveDataFinish() {
				var _this = this
				this.$refs.uFormYJ.setRules(this.rulesYj);
				this.$refs.uFormYJ.validate(valid => {
					_this.dataTempYJ.operationNodeId = _this.nodeId
					if (valid) {
						_this.buttonLoading = true

						EventWorkOutApi.eventFinish(_this.dataTempYJ).then(res => {
							uni.showToast({
								title: '审批成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/main/main'
								});
							}, 1500)
						})
					} else {
						console.log('验证失败');
					}
				});
			},
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
</style>
