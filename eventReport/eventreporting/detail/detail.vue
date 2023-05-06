<template>
	<view>
		<!-- <u-tabs name="cate_name" :list="tabsList" :is-scroll="false" :current="current" @change="change"></u-tabs> -->
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent==1" class="form">
			<u-time-line>
				<u-time-line-item v-for="(item,index) in timelineList" :key="index">
					<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
					<template v-slot:node>
						<view class="u-node" style="background: #FFFFFF;">
							<!-- 此处为uView的icon组件 -->
							<u-icon name="arrow-down-fill" color="#19be6b" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">{{item.description}}</view>
							<view class="u-order-desc">{{item.content | contentFilter}}</view>
							<view class="u-order-time">{{item.recordTime}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
		<view v-if="sectionCurrent==0" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
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
				<!-- <u-form-item label="事件级别:" :required="true" prop="eventLevel">
					<u-input type="select" :select-open="jbSelectShow" :border="true" v-model="dataTemp.eventLevel" placeholder="请选择事件级别"
					 @click="jbSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="jbList" v-model="jbSelectShow"
					 @confirm="jbSelectConfirm"></u-select>
				</u-form-item> -->
				<!-- <u-form-item label="分类一级:" :required="true" prop="eventType" :border-bottom="false">
					<u-input type="select" :select-open="flSelectShow" :border="true" v-model="dataTemp.eventType1" placeholder="请选择事件分类一级"
					 @click="flSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="flList" v-model="flSelectShow"
					 @confirm="flSelectConfirm"></u-select>
				</u-form-item> -->
				<!-- <u-form-item label="分类二级:">
					<u-input type="select" :select-open="fl2SelectShow" :border="true" v-model="dataTemp.eventType2" placeholder="请选择事件类型二级"
					 @click="fl2SelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="fl2List" v-model="fl2SelectShow"
					 @confirm="fl2SelectConfirm"></u-select>
				</u-form-item> -->
				<!-- <u-form-item label="分类三级:">
					<u-input type="select" :select-open="fl3SelectShow" :border="true" v-model="dataTemp.eventType3" placeholder="请选择事件类型三级"
					 @click="fl3SelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="fl3List" v-model="fl3SelectShow"
					 @confirm="fl3SelectConfirm"></u-select>
				</u-form-item> -->
				<u-form-item label="事件内容:">
					{{dataTemp.content}}
				</u-form-item>
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
				<!-- <u-form-item>
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<audio :src="imgList[index].imgPath"></audio>
								<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="ChooseImage">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传录音" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item> -->
			</u-form>
		</view>
		<view v-if="sectionCurrent==0" class="flex justify-between button">
			<u-action-sheet :list="actionList" v-model="actionListShow" @click="handleFlow"></u-action-sheet>
			<u-button type="primary" @click="handleAction" :loading="buttonLoading">流转办理</u-button>
			<u-button type="success" @click="popupShow=true;currentFlowIndex=-1" :loading="buttonLoading">立即办结</u-button>
			<!-- <u-button type="primary" @click="saveDataFinish" :loading="buttonLoading">报送社区</u-button> -->
		</view>
		<u-popup v-model="popupShow" mode="bottom" width="600rpx" height="800rpx">
			<view class="padding">
				<u-form :model="dataTempYJ" ref="uFormYJ" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item v-if="currentFlowIndex=='上报'" label="上报机构:" prop="targetOrgId">
						<u-input type="select" :selectOpen="submitOrgListShow" :border="true" v-model="dataTempYJ.targetOrgName"
						 placeholder="请选择上报机构" @click="submitOrgListShow = true"></u-input>
						<u-select v-model="submitOrgListShow" value-name="id" label-name="name" :list="submitOrgList" @confirm="submitOrgSelectConfirm"></u-select>
					</u-form-item>
					<u-form-item v-if="currentFlowIndex=='转交'" label="转交机构:" prop="targetOrgId">
						<u-input type="select" :border="true" v-model="dataTempYJ.targetOrgName" placeholder="请选择转交机构" @click="gotoSelectOrg('transmit')"></u-input>
						<!-- <u-select v-model="submitOrgListShow" value-name="id" label-name="name" :list="submitOrgList" @confirm="submitOrgSelectConfirm"></u-select> -->
					</u-form-item>
					<u-form-item v-if="currentFlowIndex=='呈报'" label="呈报领导:" prop="targetUserId">
						<u-input type="select" :select-open="leaderListShow" :border="true" v-model="dataTempYJ.targetUserName"
						 placeholder="请选择要呈报的领导" @click="leaderListShow = true"></u-input>
						<u-select v-model="leaderListShow" value-name="id" label-name="name" :list="leaderList" @confirm="leaderSelectConfirm"></u-select>
					</u-form-item>
					<u-form-item label="办理意见:" prop="content">
						<u-input v-model="dataTempYJ.content" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
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
				<u-button v-if="currentFlowIndex!=-1" type="success" @click="saveDataFlow" :loading="buttonLoading">{{currentFlowIndex}}</u-button>
				<u-button v-else type="success" @click="saveDataFinish" :loading="buttonLoading">提交</u-button>
			</view>

		</u-popup>
		<!-- 交办弹窗 -->
		<u-popup v-model="popupAssignedShow" mode="bottom" width="600rpx" height="1200rpx">
			<view class="padding">
				<u-form :model="dataTempJB" ref="uFormJB" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item v-if="currentFlowIndex=='交办'" label="主办单位:" prop="targetOrgId">
						<u-input type="select" :border="true" v-model="dataTempJB.targetOrgName" placeholder="请选择主办单位" @click="gotoSelectOrg('main')"></u-input>
						<!-- <u-select v-model="leaderListShow" value-name="id" label-name="name" :list="leaderList" @confirm="leaderSelectConfirm"></u-select> -->
					</u-form-item>
					<u-form-item v-if="currentFlowIndex=='交办'" label="协办单位:" prop="assistOrgName">
						<u-input type="select" :border="true" v-model="dataTempJB.assistOrgName" placeholder="请选择协办单位" @click="gotoSelectOrg('assist')"></u-input>
						<!-- <u-select v-model="leaderListShow" value-name="id" label-name="name" :list="leaderList" @confirm="leaderSelectConfirm"></u-select> -->
					</u-form-item>
					<u-form-item label="主办意见:" prop="targetContent">
						<u-input v-model="dataTempJB.targetContent" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
					</u-form-item>
					<u-form-item label="协办意见:" prop="assistContent">
						<u-input v-model="dataTempJB.assistContent" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
					</u-form-item>
					<u-form-item label="办理时限:" prop="limitTime">
						<u-input type="select" :select-open="limitshow" v-model="dataTempJB.limitTime" :border="true" placeholder="请填写办理时限"
						 @click="limitshow = true" />
						<u-picker mode="time" v-model="limitshow" :params="limitParams" :start-year="startYear" @confirm="limitSelectConfirm"></u-picker>
					</u-form-item>
				</u-form>
				<u-button v-if="currentFlowIndex!=-1" type="success" @click="saveDataFlowAssign" :loading="buttonLoading">{{currentFlowIndex}}</u-button>
			</view>
		</u-popup>
		<view v-if="sectionCurrent==2" class="">
			<MapView ref="mapView" :coordinate="(dataTemp.jsonGeo)"></MapView>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import EventDetailApi from '../../../api/eventdetail.js'
	import EventHandleApi from '../../../api/eventhandle.js'
	import moment from 'moment'
	import RoleJS from '../../../utils/role.js'
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
				timelineList: [],
				sectionCurrent: 0,
				imgFileList: [],
				submitOrgListShow: false,
				submitOrgList: [],
				popupAssignedShow: false,
				dataTempYJ: {
					content: '',
					eventId: '',
					targetUserId: '',
					targetOrgId: '',
					files: [],
					targetOrgName: '',
					targetContent: ''
				},
				dataTempJB: {
					eventId: '',
					assistContent: '',
					assistOrgIds: [],
					targetContent: '',
					targetOrgId: '',
					targetOrgName: '',
					assistOrgName: [],
					limitTime: '',
					files: []
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
				rules: {},
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
						message: '请填写办理意见',
						trigger: 'change'
					}],
				},
				rulesJB: {
					targetOrgId: [{
						required: true,
						message: '请选择主办机构',
						trigger: 'change'
					}],
					assistOrgName: [{
						required: true,
						message: '请选择协办机构',
						trigger: 'change',
						type: 'array'
					}],
					targetContent: [{
						required: true,
						message: '请填写主办意见',
						trigger: 'change'
					}],
					assistContent: [{
						required: true,
						message: '请填写协办意见',
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
				currentFlowIndex: -1,
				leaderList: [],
				leaderListShow: false,
				contentType: 'textarea',
				contentShow: true,
				limitshow: false,
				limitParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
				},
				startYear: '',
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
			}
		},
		watch: {
			popupShow(val) {
				if (val) {
					this.contentShow = false
				} else {
					this.contentShow = true
				}
			},
			popupAssignedShow(val) {
				if (val) {
					this.contentShow = false
				} else {
					this.contentShow = true
				}
			}
		},
		onLoad(option) {
			// console.log(option)
			this.eventId = option.id
			this.startYear = new moment().format('YYYY')
			this.initAuth()
			this.fetchDir()
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
			uni.$on('selectedOrgTransmit', (org) => {
				this.setSelectedOrgTransmit(org)
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			// this.$refs.uFormJB.setRules(this.rulesJB);

		},
		methods: {
			initAuth() {
				if (RoleJS.hasRoles('user')) {
					this.actionList.push({
						text: '转交'
					})
				}
			},
			setSelectedOrgTransmit(item) {
				// console.log('123123123', item)
				this.$nextTick(function() {
					this.dataTempYJ.targetOrgId = item[0].id
					this.dataTempYJ.targetOrgName = item[0].name
				})
			},
			setSelectedOrgSubmit(item) {
				this.$nextTick(function() {
					// console.log('进1', item)
					this.dataTempJB.targetOrgId = item.id
					this.dataTempJB.targetOrgName = item.name
				})
			},
			setSelectedOrg(item) {
				this.$nextTick(function() {
					// console.log('进1', item)
					this.dataTempJB.targetOrgId = item[0].id
					this.dataTempJB.targetOrgName = item[0].name
				})

			},
			//协办单位
			setSelectedOrgAssist(item) {
				this.$nextTick(function() {
					// console.log('进2', item)
					// this.dataTempJB.assistOrgIds.push(item.id)
					// this.dataTempJB.assistOrgName = item.name
					this.dataTempJB.assistOrgIds = Array.from(item, ({
						id
					}) => id)
					this.dataTempJB.assistOrgName = Array.from(item, ({
						name
					}) => name)
					// console.log('进2', this.dataTempJB)
				})
			},
			gotoSelectOrg(type) {
				uni.navigateTo({
					url: '../selectOrg/selectOrg?type=' + type
				})
			},
			submitOrgSelectConfirm(e) {
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTempYJ.targetOrgName = val.label
					this.dataTempYJ.targetOrgId = val.value
				})
			},
			leaderSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTempYJ.targetUserName = val.label
					this.dataTempYJ.targetUserId = val.value
				})
			},
			limitSelectConfirm(e) {
				// console.log(e)
				this.dataTempJB.limitTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00'
			},
			handleFlow(index) {
				this.currentFlowIndex = this.actionList[index].text
				console.log(this.actionList[index].text)
				if (this.currentFlowIndex == '办理') {
					this.popupShow = true
				}
				if (this.currentFlowIndex == '呈报') {
					this.popupShow = true
					EventHandleApi.getTargetLeader().then(res => {
						this.leaderList = res.data.data
					})
				}
				if (this.currentFlowIndex == '交办') {
					this.popupAssignedShow = true
				}
				if (this.currentFlowIndex == '上报') {
					this.popupShow = true
					EventHandleApi.getSubmitOrgList().then(res => {
						this.submitOrgList = res.data.data
					})
				}
				if (this.currentFlowIndex == '转交') {
					this.popupShow = true
				}

				// console.log(this.currentFlowIndex)
			},
			handleAction() {
				this.actionListShow = true
			},
			//加载事件详情
			fetchDetail() {
				var _this = this
				this.timeQuery.eventId = this.eventId
				uni.showLoading({
					title: '读取中',
				})
				// 读时间线
				EventDetailApi.getEventTimeline(this.timeQuery).then(res => {
					console.log('timeline', res)
					this.$nextTick(function() {
						this.timelineList = res.data.data.timeline
					})

				})
				// 读事件详情
				EventDetailApi.getEventDetail(this.eventId).then(res => {
					console.log('事件详情', res)
					if (res.data.code == 0) {
						Object.assign(this.dataTemp, res.data.data)
						// 打开件
						EventHandleApi.openEventReportSplit(this.dataTemp).then(res => {
							// console.log('打开分流件', res)
						})
						// 读取事件分类级别
						let query = {
							code: res.data.data.eventTypeCode,
							dictSubjectId: 'dict_anshijian_fl'
						}
						this.dataTemp.jsonGeo = {
							// lat: 22.016621,
							// lng: 100.806326
							lat:this.dataTemp.geometryWktY,
							lng: this.dataTemp.geometryWktX
						}
						this.dataTemp.title = this.decrypt(this.dataTemp.title)
						this.dataTemp.content = this.decrypt(this.dataTemp.content)
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
						//读取二三级分类
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
				this.$refs.uFormYJ.validate(valid => {
					_this.dataTempYJ.eventId = _this.eventId
					// 处理附件
					_this.imgFileList.forEach(item => {
						_this.dataTempYJ.files.push(item.fileId)
					})
					_this.dataTempYJ.targetContent = _this.dataTempYJ.content
					if (valid) {
						_this.buttonLoading = true
						this.dataTemp.title = this.encrypt(_this.dataTemp.title)
						this.dataTemp.content = this.encrypt(_this.dataTemp.content)
						EventHandleApi.fixEventReport(this.dataTemp).then(async (res) => {
							if (res.data.code === 0) {
								// console.log(res.data.code)
								let result = {}
								switch (_this.currentFlowIndex) {
									case '办理':
										// 启动办理
										result = await EventHandleApi.eventStartAndHandle(_this.dataTempYJ).then(response => {
											return response.data
										})
										break;
									case '呈报':
										// 启动呈报领导
										result = await EventHandleApi.eventStartAndSubmit(_this.dataTempYJ).then(response => {
											return response.data
										})
										break;
									case '上报':
										//启动上报
										result = await EventHandleApi.eventStartAndSubmitOrg(_this.dataTempYJ).then(response => {
											return response.data
										})
										break;
									case '转交':
										//启动转交
										result = await EventHandleApi.eventStartAndTransmitOrg(_this.dataTempYJ).then(response => {
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
											url: '../todolist/todolist'
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
								uni.showToast({
									title: '报送失败:' + res.data.desc,
									icon: 'none'
								})
								_this.buttonLoading = false
							}
						})
						console.log('验证通过');
						// console.log(this.dataTemp)
					} else {
						console.log('验证失败');
					}
				});
			},
			// 交办 上报
			async saveDataFlowAssign() {
				var _this = this
				this.$refs.uFormJB.setRules(this.rulesJB);
				this.$refs.uFormJB.validate(valid => {
					_this.dataTempJB.eventId = _this.eventId
					if (valid) {
						_this.buttonLoading = true
						this.dataTemp.title = this.encrypt(_this.dataTemp.title)
						this.dataTemp.content = this.encrypt(_this.dataTemp.content)
						EventHandleApi.fixEventReport(this.dataTemp).then(async (res) => {
							// console.log('报送结果', res)
							if (res.data.code === 0) {
								// console.log(res.data.code)
								let result = {}
								switch (_this.currentFlowIndex) {

									case '交办':
										//启动交办
										_this.dataTempJB.eventId = _this.eventId
										result = await EventHandleApi.eventStartAndAssign(_this.dataTempJB).then(response => {
											return response.data
										})
										break;
									case 3:
										// 启动上报
										break;
								}
								if (result.code == 0) {
									uni.showToast({
										title: '办理成功',
										icon: 'none'
									})
									uni.redirectTo({
										url: '../todolist/todolist'
									})
								} else {
									uni.showToast({
										title: '提交失败' + result.desc,
										icon: 'none'
									})
									_this.buttonLoading = false
								}
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
			//保存数据并办结，立即办结
			saveDataFinish() {
				var _this = this
				this.$refs.uFormYJ.setRules(this.rulesYj);
				this.$refs.uFormYJ.validate(valid => {
					_this.dataTempYJ.eventId = _this.eventId
					// 处理办结的附件
					_this.imgFileList.forEach(item => {
						_this.dataTempYJ.files.push(item.fileId)
					})
					if (valid) {
						_this.buttonLoading = true
						this.dataTemp.title = this.encrypt(_this.dataTemp.title)
						this.dataTemp.content = this.encrypt(_this.dataTemp.content)
						EventHandleApi.fixEventReport(this.dataTemp).then(res => {
							console.log('报送结果', res)
							if (res.data.code === 0) {
								console.log(res.data.code)
								EventHandleApi.eventStartAndFinish(_this.dataTempYJ).then(res => {
									uni.showToast({
										title: '报送成功',
										icon: 'none'
									})
									setTimeout(function() {
										uni.redirectTo({
											url: '../todolist/todolist',
										});
									}, 1500)
								})
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
			//取数据字典
			fetchDir() {
				var _this = this
				// 取事件级别
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_anshijian_jb'
				}).then(res => {
					this.jbList = res.data.data
				})
				//取事件类型
				DictionaryApi.getDictionariesTree({
					dictSubjectId: 'dict_anshijian_fl'
				}).then(res => {
					console.log(res)
					_this.flList = res.data.data
				})
			},
			//直接取子值
			fetchChildren(parentId, list) {
				DictionaryApi.getDictionariesTree({
					dictSubjectId: 'dict_anshijian_fl',
					parentId: parentId
				}).then(res => {
					list = res.data.data
				})
			},
			//递归方法
			fetchChildrenRecursive(item) {
				let _this = this
				return DictionaryApi.getDictionariesTree({
					dictSubjectId: 'dict_anshijian_fl',
					parentId: item.innerId
				}).then(res => {
					// console.log('child', res)
					if (res.data.data.length > 0) {
						let arr = []
						res.data.data.forEach(i => {
							arr.push(i)
							_this.fetchChild(i)
						})
						// console.log(arr)
						arr.push({
							innerId: 'sss',
							text: '不选择'
						})
						item.children = arr
						return arr;
					}
				})
			},
			jbSelectConfirm(e) {
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTemp.eventLevel = val.label
					this.dataTemp.eventLevelCode = val.value
				})
			},
			flSelectConfirm(e) {
				var _this = this
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTemp.eventType = val.label
					this.dataTemp.eventTypeCode = val.value
					//设置显示
					this.dataTemp.eventType1 = val.label
					DictionaryApi.getDictionariesTree({
						dictSubjectId: 'dict_anshijian_fl',
						parentId: val.value
					}).then(res => {
						_this.$nextTick(function() {
							_this.dataTemp.eventType2 = ''
							_this.dataTemp.eventType3 = ''
							_this.fl2List = res.data.data

						})
					})
				})
			},
			fl2SelectConfirm(e) {
				var _this = this
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTemp.eventType = val.label
					this.dataTemp.eventTypeCode = val.value
					//设置显示
					this.dataTemp.eventType2 = val.label
					DictionaryApi.getDictionariesTree({
						dictSubjectId: 'dict_anshijian_fl',
						parentId: val.value
					}).then(res => {
						_this.$nextTick(function() {
							_this.dataTemp.eventType3 = ''
							_this.fl3List = res.data.data

						})
					})
				})
			},
			fl3SelectConfirm(e) {
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTemp.eventType = val.label
					this.dataTemp.eventTypeCode = val.value
					//设置显示
					this.dataTemp.eventType3 = val.label
				})
			},
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
									console.log('转换', i)
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
			// ViewImage(e) {
			// 	console.log('this.imgList', this.imgList)
			// 	let arr = []
			// 	this.imgList.forEach(item => {
			// 		arr.push(item.imgPath)
			// 	})
			// 	uni.previewImage({
			// 		urls: arr,
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
			chooseVideo() {
				var _this = this
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						console.log(res)
						FileApi.uploadFileByUni(res.tempFilePath).then(resupload => {
							console.log('resupload[1]', resupload)
							if (resupload[1].statusCode == 200) {
								var i = JSON.parse(resupload[1].data)
								console.log('转换', i)
								_this.videoList.push({
									videoPath: res.tempFilePath,
									fileId: i.data.fileId
								})
							}
						})
					}
				});
			},
			viewVideo() {},
			delVideo(e) {
				console.log(e)
				this.videoList.splice(e.currentTarget.dataset.index, 1)
			},
			getLocation() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						_this.dataTemp.coordinate.lat = res.latitude
						_this.dataTemp.coordinate.lng = res.longitude
						console.log(_this.dataTemp)
					}
				});
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
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
									_self.imgFileList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
								}
							})
						})
					}
				});
			},
			delFileImg(e) {
				this.imgFileList.splice(e.currentTarget.dataset.index, 1)
			},
			viewFileImage(e) {
				uni.previewImage({
					urls: this.imgFileList,
					current: e.currentTarget.dataset.url
				});
			},
			// 直接办结附件选择 end
			sectionChange(index) {
				this.sectionCurrent = index
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
		color: #FFFFFF;
		z-index: 999;
		border-radius: 50px;
	}

	.button {
		width: 70%;
		margin: 0 auto;
	}

	.actionPopup {
		padding: 20upx;
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
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
		}

	}

	.u-node {
		width: 44rpx;
		height: 44rpx;
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
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}

	.tel {
		color: $u-type-primary;
	}
</style>
