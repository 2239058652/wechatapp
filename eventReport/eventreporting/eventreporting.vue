<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item :required="true" prop="scenarioName" :border-bottom="false">
					<u-input type="textarea" :select-open="flSelectShow" :border="true" v-model="dataTemp.scenarioName" placeholder="请选择事件分类"
					 @click="handleToScenarioIndex()"></u-input>
				</u-form-item>
				<u-form-item label="报送时间:" :required="true" prop="eventLevelCode">
					{{dateNow}}
				</u-form-item>
				<u-form-item label="事件级别:" :required="true" prop="eventLevelCode">
					<u-radio-group v-model="dataTemp.eventLevelCode" size="40rpx" width="50%">
						<u-radio @change="radioEventLevelChange(item)" v-for="(item, index) in jbList" :key="index" :name="item.innerId"
						 :innerId="item.innerId" :text="item.text">
							{{item.text}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="紧急程度:" :required="true" prop="eventUrgentCode">
					<u-radio-group v-model="dataTemp.eventUrgentCode" size="40rpx">
						<u-radio @change="radioEventUrgentChange(item)" v-for="(item, index) in jjcdList" :key="index" :name="item.innerId"
						 :innerId="item.innerId" :text="item.text">
							{{item.text}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item :required="true" prop="title">
					<u-input v-model="dataTemp.title" autosize :border="true" placeholder="请输入事件标题" />
				</u-form-item>
				<u-form-item :required="true" prop="content">
					<u-input v-model="dataTemp.content" type="textarea" height="150" :border="true" placeholder="请输入事件内容" />
				</u-form-item>
				<u-form-item>
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="ChooseImage">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
				<u-form-item>
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in videoList" :key="index" @tap="viewVideo" :data-url="videoList[index]">
								<video id="myVideo" :src="videoList[index].videoPath" x5-video-player-fullscreen="true"></video>
								<view class="cu-tag bg-red icon-delete" @tap.stop="delVideo" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="chooseVideo">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传视频" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
				<u-form-item :required="false" prop="eventLevelCode">
					<map id="mapInfo" ref="mapInfo" class="mapinfo" :enable-3D="false" :latitude="coordinate.lat" :longitude="coordinate.lng"
					 :markers="covers" :show-location="true" enable-overlooking="false" :scale="scale" :show-compass="true">
					</map>
				</u-form-item>
			</u-form>
		</view>
		<view v-if="situationType==1" class="flex justify-center bottombutton">
			<u-button type="success" :loading="buttonLoading" @click="handleOnkey">一键报平安</u-button>
		</view>
		<view v-else class="flex justify-between bottombutton">
			<u-button type="success" @click="popupShow=true" :loading="buttonLoading">直接办结</u-button>
			<!-- <u-button v-if="hasAuth" type="success" @click="popupFlowShow=true" :loading="buttonLoading">转交事件</u-button> -->
			<u-button type="primary" @click="saveData" :loading="buttonLoading">报送事件</u-button>
		</view>
		<u-popup v-model="popupShow" mode="bottom" width="600rpx" height="600rpx">
			<view class="padding">
				<u-form :model="dataTemp" ref="uFormBJ" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item label="办结结果:" prop="note">
						<u-input v-model="dataTemp.note" type="textarea" height="100" :border="true" placeholder="请填写办结结果" />
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
									<!-- <text class='cuIcon-cameraadd'></text> -->
									<!-- <view class="text-xs text-grey uploadText">上传照片</view> -->
									<u-icon class="fileIcon" color="#8799a3" size="40" name="camera" label="" label-pos="bottom"></u-icon>
								</view>
							</view>
						</view>
					</u-form-item>
				</u-form>
				<u-button type="success" @click="saveDataFinish" :loading="buttonLoading">提交</u-button>
			</view>
		</u-popup>
		<u-popup v-model="popupFlowShow" mode="bottom" width="600rpx" height="800rpx">
			<view class="padding">
				<u-form :model="dataTemp" ref="uFormZJ" label-width="120" :error-type="errorType" label-position="top">
					<u-form-item label="转交机构:" prop="targetOrgName">
						<u-input type="select" :border="true" v-model="dataTemp.targetOrgName" placeholder="请选择转交机构" @click="gotoSelectOrg('transmit')"></u-input>
						<!-- <u-select v-model="submitOrgListShow" value-name="id" label-name="name" :list="submitOrgList" @confirm="submitOrgSelectConfirm"></u-select> -->
					</u-form-item>
					<u-form-item label="转交意见:" prop="targetContent">
						<u-input v-model="dataTemp.targetContent" type="textarea" height="100" :border="true" placeholder="请填写办理意见" />
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
				<u-button type="success" @click="saveDataFlow" :loading="buttonLoading">提交</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../api/fileupload.js'
	import DictionaryApi from '../../api/dictionary.js'
	import EventReportApi from '../../api/eventreportgrid.js'
	import RoleJS from '../../utils/role.js'
	import moment from 'moment'
	export default {
		data() {
			return {
				scale: 16,
				coordinate: {
					lat: '22.009029',
					lng: '100.797071',
					mapType: ''
				},
				covers: [],
				dateNow: '',
				hasAuth: false,
				popupShow: false,
				popupFlowShow: false,
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
					eventTypeCode: '',
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
				jjcdList: [],
				flList: [],
				fl2List: [],
				fl3List: [],
				jbSelectShow: false,
				jjcdSelectShow: false,
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
					eventUrgent: [{
						required: true,
						message: '请选择事件紧急程度',
						trigger: ['change', 'blur'],
					}],
					scenarioName: [{
						required: true,
						message: '请选择事件分类',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写事件内容',
						trigger: 'change'
					}],
					title: [{
						required: true,
						message: '请填写事件标题',
						trigger: 'change'
					}],
				},
				rulesBJ: {
					note: [{
						required: true,
						message: '请填写办结结果',
						trigger: 'change'
					}],
				},
				rulesZJ: {
					targetOrgName: [{
						required: true,
						message: '请选择转交机构',
						trigger: 'change'
					}],
					targetContent: [{
						required: true,
						message: '请填写转交意见',
						trigger: 'change'
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				//直接办结附件列表
				imgFileList: [],
				situationType: '' //场景类别
			}
		},
		onShow() {
			uni.$on('selectedOrgTransmit', (org) => {
				this.setSelectedOrgTransmit(org)
			})
			this.getLocation()
			this.dateNow = new moment().format('YYYY年MM月DD日 HH时mm分')
		},
		onLoad(option) {
			this.dataTemp.mapType = this.$MapType
			this.dataTemp.scenarioName = option.scenarioName
			this.dataTemp.scenarioId = option.scenarioId
			this.situationType = option.situationType
			this.initAuth()
			this.fetchDir()
			this.getLocation()
			this.handleOnkeyInit()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			handleOnkeyInit() {
				if (this.situationType == 1) {
					this.dataTemp.title = '平安信息'
					this.dataTemp.content = '今日无事件'
				}
			},
			//处理一件报平安
			handleOnkey() {
				this.dataTemp.note = '平安'
				// this.popupShow = true
				this.saveDataFinish()
			},
			// 选中某个单选框时，由radio时触发
			radioEventLevelChange(e) {
				this.dataTemp.eventLevel = e.text
			},
			radioEventUrgentChange(e) {
				this.dataTemp.eventUrgent = e.text
			},
			// 事件分类
			handleToScenarioIndex() {
				uni.navigateTo({
					url: '/eventReport/scenario/index'
				});
			},
			setSelectedOrgTransmit(item) {
				this.$nextTick(function() {
					this.dataTemp.targetOrgId = item[0].id
					this.dataTemp.targetOrgName = item[0].name
				})
			},
			gotoSelectOrg(type) {
				uni.navigateTo({
					url: './selectOrg/selectOrg?type=' + type
				})
			},
			initAuth() {
				if (RoleJS.hasRoles('user')) {
					this.hasAuth = true
				}
			},
			//保存数据并流转
			saveDataFlow() {
				var _this = this
				// this.$refs.uForm.setRules(this.rulesYj);
				this.$refs.uForm.validate(async (valid) => {
					// 处理附件
					_this.imgFileList.forEach(item => {
						_this.dataTemp.files.push(item.fileId)
					})
					
					if (valid) {
						this.$refs.uFormZJ.setRules(this.rulesZJ);
						this.$refs.uFormZJ.validate(validZJ => {
							if (validZJ) {
								_this.dataTemp.title = _this.encrypt(_this.dataTemp.title)
								_this.dataTemp.content = _this.encrypt(_this.dataTemp.content)
								_this.dataTemp.eventClassificationCriteriaId = _this.dataTemp.scenarioId
								_this.dataTemp.eventClassificationCriteria = _this.dataTemp.scenarioName
								_this.buttonLoading = true
								EventReportApi.eventReportAndTransmit(_this.dataTemp).then(response => {
									if (response.data.code == 0) {
										uni.showToast({
											title: '转交成功',
											icon: 'none'
										})
										setTimeout(function() {
											uni.switchTab({
												url: '/pages/main/main'
											})
										}, 1500)
									} else {
										uni.showToast({
											title: '提交失败' + result.desc,
											icon: 'none'
										})
										_this.buttonLoading = false
									}
								})
							}
						})

					} else {
						console.log('验证失败');
					}
				});
			},
			saveDataFinish() {
				var _this = this
				this.$refs.uForm.validate(valid => {
					// 处理图片
					_this.imgList.forEach(item => {
						_this.dataTemp.imageFiles.push(item.fileId)
					})
					//处理视频
					_this.videoList.forEach(item => {
						_this.dataTemp.videoFiles.push(item.fileId)
					})
					// 处理办结的附件
					_this.imgFileList.forEach(item => {
						_this.dataTemp.files.push(item.fileId)
					})

					if (valid) {
						_this.buttonLoading = true
						if (!_this.situationType == 1) {
							this.$refs.uFormBJ.setRules(this.rulesBJ);
							this.$refs.uFormBJ.validate(validBJ => {
								if (validBJ) {
									_this.dataTemp.title = _this.encrypt(_this.dataTemp.title)
									_this.dataTemp.content = _this.encrypt(_this.dataTemp.content)
									_this.dataTemp.eventClassificationCriteriaId = _this.dataTemp.scenarioId
									_this.dataTemp.eventClassificationCriteria = _this.dataTemp.scenarioName
									
									console.log("this.dataTemp: ",this.dataTemp);
									EventReportApi.eventReportAndFinish(this.dataTemp).then(res => {
										console.log('报送结果111', res)
										if (res.data.code === 0) {
											uni.showToast({
												title: '报送成功',
												icon: 'none'
											})
											setTimeout(function() {
												uni.switchTab({
													url: '/pages/main/main'
												})
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
									_this.buttonLoading = false
								}
							})
						} else {
							_this.dataTemp.title = _this.encrypt(_this.dataTemp.title)
							_this.dataTemp.content = _this.encrypt(_this.dataTemp.content)
							_this.dataTemp.eventClassificationCriteriaId = _this.dataTemp.scenarioId
							_this.dataTemp.eventClassificationCriteria = _this.dataTemp.scenarioName
							EventReportApi.eventReportAndFinish(this.dataTemp).then(res => {
								console.log('报送结果', res)
								if (res.data.code === 0) {
									uni.showToast({
										title: '报送成功',
										icon: 'none'
									})
									setTimeout(function() {
										uni.switchTab({
											url: '/pages/main/main'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '报送失败:' + res.data.desc,
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})
						}

					} else {
						_this.buttonLoading = false
					}
				});
			},
			// 保存数据
			saveData() {
				var _this = this
				this.$refs.uForm.validate(valid => {
					// 处理图片
					_this.imgList.forEach(item => {
						_this.dataTemp.imageFiles.push(item.fileId)
					})
					//处理视频
					_this.videoList.forEach(item => {
						_this.dataTemp.videoFiles.push(item.fileId)
					})
					
					if (valid) {
						this.dataTemp.title = this.encrypt(this.dataTemp.title)
						this.dataTemp.content = this.encrypt(this.dataTemp.content)
						this.dataTemp.eventClassificationCriteriaId = this.dataTemp.scenarioId
						this.dataTemp.eventClassificationCriteria = this.dataTemp.scenarioName
						_this.buttonLoading = true
						EventReportApi.eventReport(this.dataTemp).then(res => {
							console.log('报送结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '报送成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.switchTab({
										url: '/pages/main/main'
									})
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
				//取事件类型
				DictionaryApi.getDictionariesTree({
					dictSubjectId: 'dict_anshijian_fl'
				}).then(res => {
					this.$nextTick(function() {
						_this.flList = res.data.data
					})
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
			jjcdSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.eventUrgent = val.label
					this.dataTemp.eventUrgentCode = val.value
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
			//选择图片表单中
			ChooseImage() {
				var _self = this
				uni.chooseImage({
					count: 9, //默认9
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
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			//直接办结的附件
			ChooseFileImage() {
				var _self = this
				uni.chooseImage({
					count: 9, //默认9
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
			viewFileImage(e) {
				uni.previewImage({
					urls: this.imgFileList,
					current: e.currentTarget.dataset.url
				});
			},
			// 直接办结附件选择 end
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
			// playVideo() {
			// 	this.videoContext = uni.createVideoContext('myVideo')
			// },
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
						_this.covers = []
						_this.covers.push({
							id: 1,
							longitude: _this.dataTemp.coordinate.lng,
							latitude: _this.dataTemp.coordinate.lat,
						})
						
						_this.coordinate.lat = _this.dataTemp.coordinate.lat
						_this.coordinate.lng = _this.dataTemp.coordinate.lng

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

	.bottombutton {
		width: 90%;
		margin: 0 auto;
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

	.mapinfo {
		height: 240rpx;
		width: 100%;
	}
</style>
