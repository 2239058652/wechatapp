<template>
	<view>
		<view class="index-head">
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的填报" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view class="select_head">
					<view class="select_body">
						<u-form-item :required="true" prop="reportType" :border-bottom="false">
							<u-input type="select" v-model="dataTemp.reportType" :border="true" placeholder="请选择举报类型"
							 @click="popupTypeShow=true"></u-input>
						</u-form-item>
					</view>
					<view class="select_text">|</view>
					<view class="select_body">
						<u-form-item :required="true" prop="reportObjectCode" :border-bottom="false">
							<u-input type="select" v-model="dataTemp.reportObjectCode" :border="true" placeholder="举报对象所属机构"
							 @click="popupObjectShow=true"></u-input>
						</u-form-item>
					</view>
				</view>
				<u-form-item :required="true" prop="occurredDate">
					<u-input type="select" :select-open="reportDateShow" v-model="dataTemp.occurredDate" :border="true" placeholder="请选择事件发生时间"
					 @click="reportDateShow = true" />
					<u-calendar v-model="reportDateShow" mode="date" @change="dateSelectConfirm"></u-calendar>
				</u-form-item>
				<u-form-item :required="true" prop="content">
					<u-input v-model="dataTemp.content" type="textarea"
						height="250" :border="true"
						placeholder="请填写举报说明,为利于您反映的意见和建议得到及时处理,请明确填写相关问题的时间、地点、事件过程。"
					/>
				</u-form-item>
				<view class="u-flex u-row-between">
					<view>是否实名举报</view>
					<view><u-switch v-model="checked" /></view>
				</view>
				<!-- 姓名 -->
				<u-form-item v-if="checked" :required="true" prop="name">
					<u-input v-model="dataTemp.name" :border="true" placeholder="请输入姓名"/>
				</u-form-item>
				<!-- 身份证件号 -->
				<u-form-item v-if="checked" :required="true" prop="idCard">
					<u-input v-model="dataTemp.idCard" :border="true" placeholder="请输入身份证件号"/>
				</u-form-item>
				<!-- 联系方式 -->
				<u-form-item :required="true" prop="contact">
					<u-input type="number" v-model="dataTemp.contact" autosize maxlength="11" :border="true" placeholder="请输入联系方式"/>
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
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
		<u-popup v-model="popupTypeShow" mode="bottom" height="600rpx">
			<view>
				<view style="height: 80rpx;font-size: 40rpx;font-weight: bold;padding: 2%;border-bottom: 8upx solid #f1f1f1;">
					选择举报类型
				</view>
				<view class="scenario-category">
					<view class="scenario-iconbox">
						<view class="category-list">
							<view class="icon-scenario" v-for="(item,index) in reportTypeList" :key="index">
								<view>
									<div class="scenario-circle" :class="sstt[index]" @click="chooseReportType(item)">
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
				<view style="height: 80rpx;font-size: 40rpx;font-weight: bold;padding: 2%;border-bottom: 8upx solid #f1f1f1;">
					选择举报对象所属机构
				</view>
				<view class="scenario-category">
					<view class="scenario-iconbox">
						<view class="category-list">
							<view class="icon-scenario" v-for="(item,index) in reportObjectList" :key="index" @click="chooseReportObject(item)">
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
	import KeyReportApi from '../../api/keyReport.js'
	import RoleJS from '../../utils/role.js'
	import moment from 'moment'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				checked: true,
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '100rpx'
				},
				reportDateShow: false,
				hasAuth: false,
				popupTypeShow: false,
				popupObjectShow: false,
				reportTypeList: [],
				reportObjectList: [],
				dataTemp: {
					type: '',
					reportObject: '',
					reportObjectCode: '',
					content: '',
					contact: '',
					openid: '',
					videoFiles: [],
					imageFiles: [],
					occurredDate: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					mapType: 2
				},
				imgList: [],
				videoList: [],
				rules: {
					reportType: [{
						required: true,
						message: '请选择举报类型',
						trigger: ['change', 'blur'],
					}],
					reportObjectCode: [{
						required: true,
						message: '请选择举报对象',
						trigger: ['change', 'blur'],
					}],
					occurredDate: [{
						required: true,
						message: '请选择事件发生时间',
						trigger: ['change', 'blur'],
					}],
					content: [{
						required: true,
						message: '请填写举报说明',
						trigger: 'change'
					}],
					name: [{
						required: true,
						message: '请填写姓名',
						trigger: 'change'
					}],
					idCard: [
						{ required: true, message: '请填写您的身份证号', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.idCard(value)},
							message: '身份证件号不正确'}
					],
					contact: [
						{
							required: true,
							message: '请填写联系方式',
							trigger: 'change'
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						}
					]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				sstt: [
					"ss1","ss2","ss3","ss4","ss5","ss6"
				]
			}
		},
		onShow() {},
		onLoad() {
			this.openId = uni.getStorageSync('openId')
			// #ifdef MP-WEIXIN
			if (!this.openId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
			this.dataTemp.mapType = this.$MapType
			this.dataTemp.occurredDate = new moment().format('YYYY-MM-DD')
			this.fetchDir()
			this.getLocation()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			//取数据字典
			fetchDir() {
				var _this = this
				// 获取举报类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_onekey_report_type'
				}).then(res => {
					this.$nextTick(function() {
						this.reportTypeList = res.data.data
					})
				})
				// 获取举报对象
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_onekey_report_object'
				}).then(res => {
					this.$nextTick(function() {
						this.reportObjectList = res.data.data
					})
				})
			},
			chooseReportType(val) {
				this.dataTemp.reportType = val.text
				this.dataTemp.type = val.innerId
				this.popupTypeShow = false
			},
			chooseReportObject(val) {
				this.dataTemp.reportObjectCode = val.text
				this.dataTemp.reportObject = val.innerId
				this.popupObjectShow = false
			},
			// 跳转我的填报列表
			handleGoToList() {
				uni.navigateTo({
					url: '/eventReport/keyReport/list/publicList'
				})
			},
			// 保存数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				this.$refs.uForm.validate(valid => {
					// 处理图片
					_this.imgList.forEach(item => {
						_this.dataTemp.imageFiles.push(item.fileId)
					})
					//处理视频
					_this.videoList.forEach(item => {
						_this.dataTemp.videoFiles.push(item.fileId)
					})
					_this.dataTemp.openid = openid
					if (valid) {
						_this.buttonLoading = true
						KeyReportApi.saveKeyReport(this.dataTemp).then(res => {
							console.log('报送结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '平安景洪，共建·共享·共治，感谢您的参与。',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '提交失败:' + res.data.desc,
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
			},
			dateSelectConfirm(e) {
				this.dataTemp.occurredDate = e.result
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-head {
		background: url(../../eventReport/static/img/qzjd.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 220rpx;
		width: 92%;
		margin: 2% 4% 0 4%;
		border-radius: 10upx;
	}
	.index-text {
		text-align: right;
		height: 220rpx;
		line-height: 380rpx;
		margin-right: 2%;
		color: #FFFFFF;
	}
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
			font-size: large;
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
