<template>
	<view>
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent==0" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="150" :error-type="errorType">
				<u-form-item label="事件类别:">
					<u-input type="textarea" :select-open="flSelectShow" :border="true" v-model="dataTemp.scenarioName" placeholder="请选择事件分类"
					 @click="handleToScenarioIndex()"></u-input>
				</u-form-item>
				<u-form-item label="事件级别:">
					<u-radio-group v-model="dataTemp.eventLevelCode" size="40rpx" width="50%">
						<u-radio @change="radioEventLevelChange(item)" v-for="(item, index) in jbList" :key="index" :name="item.innerId"
						 :innerId="item.innerId" :text="item.text">
							{{item.text}}
						</u-radio>
					</u-radio-group>
					<!-- {{dataTemp.eventLevel}} -->
				</u-form-item>
				<u-form-item label="紧急程度:">
					<u-radio-group v-model="dataTemp.eventUrgentCode" size="40rpx">
						<u-radio @change="radioEventUrgentChange(item)" v-for="(item, index) in jjcdList" :key="index" :name="item.innerId"
						 :innerId="item.innerId" :text="item.text">
							{{item.text}}
						</u-radio>
					</u-radio-group>
					<!-- {{dataTemp.eventUrgent}} -->
				</u-form-item>
				<u-form-item label="事件标题:">
					<u-input v-model="dataTemp.title" autosize :border="true" placeholder="请输入事件标题" />
					<!-- {{dataTemp.title}} -->
				</u-form-item>
				<u-form-item label="事件内容:">
					<u-input v-model="dataTemp.content" type="textarea" height="150" :border="true" placeholder="请输入事件内容" />
					<!-- {{dataTemp.content}} -->
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
		<view v-if="sectionCurrent==0" class="flex justify-between button" style="margin-bottom: 2%;">
			<u-action-sheet :list="actionList" v-model="actionListShow" @click="handleFlow"></u-action-sheet>
			<u-button type="info" @click="handleEventFix()" :loading="buttonLoading">内容修正</u-button>
			<u-button v-if="dataTemp.transfer!=0" type="primary" @click="handleAction" :loading="buttonLoading">流转办理</u-button>
			<u-button type="success" @click="popupShow=true;currentFlowIndex='未选择'" :loading="buttonLoading">立即办结</u-button>
		</view>
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
		<view v-if="sectionCurrent==2" class="">
			<MapView ref="mapView" :coordinate="(dataTemp.jsonGeo)"></MapView>
		</view>
		<!-- 其他流转弹窗 -->
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
				<u-button v-if="currentFlowIndex!='未选择'" type="success" @click="saveDataFlow" :loading="buttonLoading">{{currentFlowIndex}}</u-button>
				<u-button v-else type="success" @click="saveDataFinish" :loading="buttonLoading">提交</u-button>
			</view>

		</u-popup>
		<!-- 交办弹窗 -->
		<u-popup v-model="popupAssignedShow" mode="bottom" width="600rpx" height="1200rpx">
			<view class="padding">
				<u-form :model="dataTempJB" ref="uFormJB" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item v-if="currentFlowIndex=='交办'" label="主办单位:" prop="targetOrgName">
						<u-input type="select" :border="true" v-model="dataTempJB.targetOrgName" placeholder="请选择主办单位" @click="gotoSelectOrg('main')"></u-input>
					</u-form-item>
					<u-form-item v-if="currentFlowIndex=='交办'" label="协办单位:" prop="assistOrgName">
						<u-input type="select" :border="true" v-model="dataTempJB.assistOrgName" placeholder="请选择协办单位" @click="gotoSelectOrg('assist')"></u-input>
					</u-form-item>
					<u-form-item label="交办意见:" prop="targetContent">
						<u-input v-model="dataTempJB.targetContent" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
					</u-form-item>
					<!-- <u-form-item label="协办意见:" prop="assistContent">
						<u-input v-model="dataTempJB.assistContent" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
					</u-form-item> -->
					<u-form-item label="办理时限:" prop="limitTime">
						<u-input type="select" :select-open="limitshow" v-model="dataTempJB.limitTime" :border="true" placeholder="请填写办理时限"
						 @click="limitshow = true" />
						<u-picker mode="time" v-model="limitshow" :params="limitParams" :start-year="startYear" @confirm="limitSelectConfirm"></u-picker>
					</u-form-item>
				</u-form>
				<u-button v-if="currentFlowIndex!='未选择'" type="success" @click="saveDataFlowAssign" :loading="buttonLoading">{{currentFlowIndex}}</u-button>
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
	import moment from 'moment'
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
				timelineList: [],
				sectionCurrent: 0,
				tabsList: [{
					name: '事件详情'
				}, {
					name: '办理情况'
				}, {
					name: '事件位置'
				}],
				limitParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
				},
				startYear: '',
				limitshow: false,
				submitOrgListShow: false,
				submitOrgList: [],
				popupAssignedShow: false,
				dataTempYJ: {
					content: '',
					operationNodeId: '',
					sourceNodeId: '',
					targetUserId: '',
					targetOrgId: '',
					files: [],
					targetContent: '',
					targetOrgName: ''
				},
				dataTempJB: {
					sourceNodeId: '',
					assistContent: '',
					assistOrgIds: [],
					targetContent: '',
					targetOrgIds: '',
					targetOrgName:'',
					targetOrgNameList: [],
					assistOrgName: '',
					assistOrgNameList: [],
					limitTime: ''
				},
				dataTemp: {
					audioFiles: [],
					content: '',
					title: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					eventLevel: '一般',
					eventLevelCode: '04',
					eventUrgent: '一般',
					eventUrgentCode: '01',
					eventType: '',
					videoFiles: [],
					scenarioName: '',
					scenarioId: '',
					eventType1: '',
					eventType2: '',
					eventType3: '',
					imageFiles: [],
					note: '', //办结结果
					files: [],
					mapType: '',
					targetContent: '', //转交内容
					targetOrgId: '', //转交机构编码
					targetOrgName: '' //转交机构名称
				},
				departmentList: [],
				imgList: [],
				jbList: [],
				flList: [],
				fl2List: [],
				fl3List: [],
				jjcdList: [],
				jbSelectShow: false,
				flSelectShow: false,
				fl2SelectShow: false,
				fl3SelectShow: false,
				videoList: [],
				rules: {
					eventLevel: [{
						required: true,
						message: '请选择事件级别',
						trigger: ['change', 'blur'],
					}],
					eventType: [{
						required: true,
						message: '请选择事件分类',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写事件内容',
						trigger: 'change'
					}],
				},
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
					targetOrgName: [{
						required: true,
						message: '请选择主办机构',
						trigger: 'change'
					}]
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
				imgFileList: [],
				timeQuery: {
					eventId: '',
					sort: 0
				},
				remindId: '',
				scenarioName: '',
				scenarioId: ''
			}
		},
		onLoad(option) {
			if(option.eventId != undefined) {
				this.eventId = option.eventId
			} else {
				this.eventId = option.id
			}
			if(option.nodeId != undefined) {
				this.nodeId = option.nodeId
			} else {
				this.nodeId = option.nodeid
			}
			this.nodeId = option.nodeid
			this.remindId = option.remindid
			this.startYear = new moment().format('YYYY')
			this.fetchDir()
			this.fetchDetail()
			if(option.scenarioName != undefined) {
				this.scenarioName = option.scenarioName
			}
			if(option.scenarioId != undefined) {
				this.scenarioId = option.scenarioId
			}
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
			fetchDir() {
				var _this = this
				// 取事件级别
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_anshijian_jb'
				}).then(res => {
					this.$nextTick(function() {
						this.jbList = res.data.data
					})
				})
				// 取事件紧急程度
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_anshijian_jjcd'
				}).then(res => {
					this.$nextTick(function() {
						this.jjcdList = res.data.data
					})
				})
			},
			// 事件级别
			radioEventLevelChange(e) {
				this.dataTemp.eventLevel = e.text
			},
			// 事件紧急程度
			radioEventUrgentChange(e) {
				this.dataTemp.eventUrgent = e.text
			},
			// 事件内容修正
			handleEventFix() {
				this.dataTemp.title = this.encrypt(this.dataTemp.title)
				this.dataTemp.content = this.encrypt(this.dataTemp.content)
				EventHandleApi.fixEventReport(this.dataTemp).then(res => {
					console.log('修正结果1111111111', res)
					if (res.data.code === 0) {
						uni.showToast({
							title: '修正成功',
							icon: 'none'
						})
						setTimeout(function() {
							uni.navigateTo({
								url: '/eventReport/eventhandle/index'
							})
						}, 1500)
					} else {
						uni.showToast({
							title: '修正失败:' + res.data.desc,
							icon: 'none'
						})
						_this.buttonLoading = false
					}
				})
			},
			// 跳转事件分类
			handleToScenarioIndex() {
				uni.navigateTo({
					url: '/eventReport/eventhandle/detail/scenarioIndex?eventId=' 
					+ this.eventId  + '&nodeId=' + this.nodeId
				});
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			setSelectedOrgTransmit(item) {
				this.$nextTick(function() {
					this.dataTempYJ.targetOrgId = item[0].id
					this.dataTempYJ.targetOrgName = item[0].name
				})
			},
			setSelectedOrgSubmit(item) {
				this.$nextTick(function() {
					this.dataTempJB.targetOrgId = item.id
					this.dataTempJB.targetOrgName = item.name
				})
			},
			// 主办单位
			setSelectedOrg(item) {
				this.$nextTick(function() {
					// this.dataTempJB.targetOrgId = item[0].id
					// this.dataTempJB.targetOrgName = item[0].name
					this.dataTempJB.targetOrgIds = Array.from(item, ({
						id
					}) => id)
					this.dataTempJB.targetOrgNameList = Array.from(item, ({
						name
					}) => name)
					for (let i = 0, length = this.dataTempJB.targetOrgNameList.length; i < length; i++) {
						this.dataTempJB.targetOrgName += this.dataTempJB.targetOrgNameList[i] + '、'
					}
					this.dataTempJB.targetOrgName = this.dataTempJB.targetOrgName.substring(0, this.dataTempJB.targetOrgName.lastIndexOf('、'))
				})

			},
			// 协办单位
			setSelectedOrgAssist(item) {
				this.$nextTick(function() {
					this.dataTempJB.assistOrgIds = Array.from(item, ({
						id
					}) => id)
					this.dataTempJB.assistOrgNameList = Array.from(item, ({
						name
					}) => name)
					for (let i = 0, length = this.dataTempJB.assistOrgNameList.length; i < length; i++) {
						this.dataTempJB.assistOrgName += this.dataTempJB.assistOrgNameList[i] + '、'
					}
					this.dataTempJB.assistOrgName = this.dataTempJB.assistOrgName.substring(0, this.dataTempJB.assistOrgName.lastIndexOf('、'))
				})
			},
			gotoSelectOrg(type) {
				uni.navigateTo({
					url: '../selectOrg/selectOrg?type=' + type + '&targetOrgIds=' + this.dataTempJB.targetOrgIds + '&assistOrgIds=' + this.dataTempJB.assistOrgIds
				})
			},
			submitOrgSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTempYJ.targetOrgName = val.label
					this.dataTempYJ.targetOrgId = val.value
				})
			},
			leaderSelectConfirm(e) {
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTempYJ.targetUserName = val.label
					this.dataTempYJ.targetUserId = val.value
				})
			},
			handleFlow(index) {
				this.currentFlowIndex = this.actionList[index].text
				if (this.currentFlowIndex == '办理') {
					this.popupShow = true
				}
				if (this.currentFlowIndex == '退件') {
					this.popupShow = true
				}
				if (this.currentFlowIndex == '呈报') {
					this.popupShow = true
					EventHandleApi.getTargetLeader().then(res => {
						this.leaderList = res.data.data
					})
				}
				if (this.currentFlowIndex == '交办') {
					this.dataTempJB = {
					sourceNodeId: '',
					assistContent: '',
					assistOrgIds: [],
					targetContent: '',
					targetOrgIds: '',
					targetOrgName:'',
					targetOrgNameList: [],
					assistOrgName: '',
					assistOrgNameList: [],
					limitTime: ''
				},
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
			},
			handleAction() {
				this.actionListShow = true
			},
			// 加载权限按钮
			initAuth() {
				var _this = this
				this.actionList = []
				// 综治中心网格长 管理员 工作人员
				if (RoleJS.hasRoles('gird_manage') || RoleJS.hasRoles('grid_admin') || RoleJS.hasRoles('grid')) {
					this.actionList = [{
						text: '办理'
					}, {
						text: '呈报'
					}, {
						text: '交办'
					}, {
						text: '上报'
					}]
				}
				// 自治组织 管理员 领导 工作人员
				if (RoleJS.hasRoles('group_admin') || RoleJS.hasRoles('group_manage') || RoleJS.hasRoles('group')) {
					console.log('this.nodeTemp.bizCode', _this.nodeTemp)
					if (this.nodeTemp.bizCode == '2000') {
						this.actionList = [{
							text: '办理'
						}, {
							text: '呈报'
						}, {
							text: '退件'
						}]
					} else {
						this.actionList = [{
							text: '办理'
						}]
					}

				}
				// 政法委 领导 工作人员 管理员
				if (RoleJS.hasRoles('manage') || RoleJS.hasRoles('user') || RoleJS.hasRoles('admin')) {
					this.actionList = [{
						text: '办理'
					}, {
						text: '呈报'
					}, {
						text: '交办'
					}, {
						text: '上报'
					}]
					// if (RoleJS.hasRoles('user')) {
					// 	this.actionList.push({
					// 		text: '转交'
					// 	})
					// }
				}
			},
			//加载事件详情
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				// 读时间线
				this.timeQuery.eventId = this.eventId
				EventDetailApi.getEventTimeline(this.timeQuery).then(res => {
					this.$nextTick(function() {
						this.timelineList = res.data.data.timeline
					})

				})
				// 获取节点信息
				EventDetailApi.getEventNodeDetail(this.nodeId).then(res => {
					this.nodeTemp = res.data.data
					this.initAuth()
				})
				// 打开催办信息
				if (this.remindId) {
					EventWorkOutApi.openPressEvent(this.remindId).then(res => {
						console.log('打开提醒', res)
					})
				}
				// 获取事件详情
				EventDetailApi.getEventDetail(this.eventId).then(res => {
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
						this.dataTemp.scenarioName = this.dataTemp.eventClassificationCriteria
						if(this.scenarioName != '') {
							this.dataTemp.scenarioName = this.scenarioName
							this.dataTemp.eventClassificationCriteria = this.scenarioName
						}
						if(this.scenarioId != '') {
							this.dataTemp.eventClassificationCriteriaId = this.scenarioId
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
					_this.targetContent = _this.content
					// 处理附件
					_this.imgFileList.forEach(item => {
						_this.dataTempYJ.files.push(item.fileId)
					})
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
							case '转交':
								result = await EventWorkOutApi.eventTransmit(_this.dataTempYJ).then(response => {
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
								uni.reLaunch({
									url: '/pages/main/main'
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
				console.log("sdfasdfasdfasdf", !this.$u.test.isEmpty(this.dataTempJB.assistOrgIds));
				var _this = this
				this.$refs.uFormJB.setRules(this.rulesJB);
				this.$refs.uFormJB.validate(valid => {
					_this.dataTempJB.sourceNodeId = _this.nodeId
					if (valid) {
						_this.buttonLoading = true
						EventWorkOutApi.eventAssign(_this.dataTempJB).then(res => {
							uni.showToast({
								title: '交办成功',
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
			//立即办结
			saveDataFinish() {
				var _this = this
				this.$refs.uFormYJ.setRules(this.rulesYj);
				this.$refs.uFormYJ.validate(valid => {
					_this.dataTempYJ.operationNodeId = _this.nodeId
					// 处理附件
					_this.imgFileList.forEach(item => {
						_this.dataTempYJ.files.push(item.fileId)
					})
					if (valid) {
						_this.buttonLoading = true
						EventWorkOutApi.eventFinish(_this.dataTempYJ).then(res => {
							uni.showToast({
								title: '已成功办结。',
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
						console.log('选择的图片', res)
					}
				});
			},
			delFileImg(e) {
				this.imgFileList.splice(e.currentTarget.dataset.index, 1)
			},
			ViewImage(e) {
				let arr=Array.from(this.imgList,({imgPath})=>imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			},
			// 直接办结附件选择 end
			limitSelectConfirm(e) {
				console.log(e)
				this.dataTempJB.limitTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00'
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
		width: 100%;
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
			// background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
			// border-top-right-radius: 20upx;
			// border-bottom-left-radius: 20upx;
		}

	}
</style>
