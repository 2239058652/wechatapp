<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view class="select_head">
					<view class="select_body">
						<u-form-item>
							<u-input type="select" v-model="dataTemp.workType"
								placeholder="请选择举报类型"
								@click="popupTypeShow=true">
							</u-input>
						</u-form-item>
					</view>
					<view class="select_text">|</view>
					<view class="select_body">
						<u-form-item>
							<u-input
								type="select"
								v-model="dataTemp.workType"
								placeholder="请选择举报对象"
								@click="popupObjectShow=true">
							</u-input>
						</u-form-item>
					</view>
				</view>
				<u-form-item prop="content">
					<u-input v-model="dataTemp.content" type="textarea"
						height="200" :border="true"
						placeholder="请填写举报说明,为利于反映的问题得到及时处理,请明确填写相关问题的时间地点 过程."
					/>
				</u-form-item>
				<!-- 联系方式 -->
				<u-form-item prop="title">
					<u-input v-model="dataTemp.title" autosize
					:border="true" placeholder="请输入联系方式" />
				</u-form-item>
				<!-- 图片 -->
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
				<!-- 视频 -->
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
			</u-form>
			<view>
				<u-button @click="saveData" :loading="buttonLoading">提交</u-button>
			</view>
		</view>
		<u-popup v-model="popupTypeShow" mode="bottom" height="600rpx">
			<view>
				<view style="height: 80rpx;font-size: 40rpx;font-weight: bold;padding: 2%;border-bottom: 8upx solid #f1f1f1;">
					选择举报类型
				</view>
				<view class="scenario-category">
					<view class="scenario-iconbox">
						<view class="category-list">
							<view class="icon-scenario" v-for="(item,index) in jbList" :key="item.id">
								<view>
									<div class="scenario-circle" :class="sstt[index]">
										<text>{{item.text}}</text>
									</div>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="popupObjectShow" mode="bottom" height="600rpx">
			<view>
				<view>
					选择举报对象
				</view>
				<view class="scenario-category">
					<view class="scenario-iconbox">
						<view class="category-list">
							<view class="icon-scenario" v-for="(item,index) in jjcdList" :key="item.id">
								<view>
									<div class="scenario-circle" :class="sstt[index]">
										<text>{{item.text}}</text>
									</div>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../api/fileupload.js'
	import DictionaryApi from '../../api/dictionary.js'
	import EventReportApi from '../../api/eventreportgrid.js'
	import RoleJS from '../../utils/role.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				hasAuth: false,
				popupTypeShow: false,
				popupObjectShow: false,
				jbList: [],
				jjcdList: [],
				dataTemp: {
					content: '',
					title: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					eventType: '',
					eventTypeCode: '',
					videoFiles: [],
					imageFiles: [],
					files: [],
					mapType: '',
				},
				departmentList: [],
				imgList: [],
				flList: [],
				fl2List: [],
				fl3List: [],
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
				errorType: ['toast', 'border'],
				buttonLoading: false,
				//直接办结附件列表
				imgFileList: [],
				sstt: [
					"ss1","ss2","ss3","ss4","ss5","ss6"
				]
			}
		},
		onShow() {
			uni.$on('selectedOrgTransmit', (org) => {
				this.setSelectedOrgTransmit(org)
			})
		},
		onLoad(option) {
			this.dataTemp.mapType = this.$MapType
			this.dataTemp.scenarioName = option.scenarioName
			this.dataTemp.scenarioId = option.scenarioId
			this.initAuth()
			this.fetchDir()
			this.getLocation()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
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
					this.dataTemp.title = this.encrypt(this.dataTemp.title)
					this.dataTemp.content = this.encrypt(this.dataTemp.content)
					this.dataTemp.eventClassificationCriteriaId = this.dataTemp.scenarioId
					this.dataTemp.eventClassificationCriteria = this.dataTemp.scenarioName
					if (valid) {
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
			}

		}
	}
</script>

<style lang="scss" scoped>
	.form {
		padding: 20upx 40upx;
	}
	.select_head {
		width: 100%;
		height: 110rpx;
		border-radius: 10px;
		display: flex;
	}
	.select_text {
		width: 4%;
		height: 110rpx;
		line-height: 110rpx;
		text-align: center;
		color: #AAAAAA;
		font-size: 45upx;
	}
	.select_body {
		width: 48%;
		margin: 5rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}
	.scenario-category {
		.scenario-iconbox {
			margin-top: 2%;
			.category-list {
				display: flex;
				flex-wrap: wrap;
				.icon-scenario {
					flex: 0 0 50%;
					text-align: center;	
					color: #666666;
					border-bottom: #f1f1f1 1px solid;
					view {
						display: flex;
						justify-content: center;
						padding: 7rpx;
					}
				}
			}
		}
		.scenario-circle{
			width:100%;
			height:100rpx;
			border: 2px solid #ececec;
			display: flex;
			font-size: 0.85em;
			font-weight: 550;
			align-items: center;
			justify-content: center;
			word-break:break-all;
		}
	}
	.ss1{
		background: #F5FAFF;
	}
	.ss2{
		background: #FFFAF5;
	}
	.ss3 {
		background: #F3FFFE;
	}
	.ss4{
		background: #F5FAFF;
	}
	.ss5{
		background: #FFFAF5;
	}
	.ss6{
		background: #F3FFFE;
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
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
		}
	}
</style>
