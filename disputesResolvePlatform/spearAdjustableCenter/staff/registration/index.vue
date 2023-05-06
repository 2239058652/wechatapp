<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" :error-type="errorType">
				<!-- <u-form-item left-icon="calendar" :left-icon-style="leftIconStyle" label="申报日期:" label-width="180">
					<u-input v-model="dataTemp.declarationDate" disabled />
				</u-form-item> -->
				<u-form-item left-icon="tags" :left-icon-style="leftIconStyle" label="纠纷名称:"
					:required="true" label-position="top" prop="name">
					<u-input v-model="dataTemp.name" :border="true" placeholder="请填写纠纷名称。" />
				</u-form-item>
				<u-form-item left-icon="map" :left-icon-style="leftIconStyle" label="纠纷发生地:"
					:required="true" label-position="top" prop="happenRegionName">
					<u-input type="select" :select-open="regionShow" v-model="dataTemp.happenRegionName" :border="true" placeholder="请选择查获地点"
					 @click="regionShow = true" />
					<u-select
						v-model="regionShow"
						mode="mutil-column-auto"
						:list="tabbarList"
						label-name="shortName"
						value-name="regionCode"
						@confirm="regionConfirm"
					/>
				</u-form-item>
				<!-- <u-form-item :required="true" label-position="top" prop="address">
					<u-input v-model="dataTemp.address" :border="true" placeholder="请填写纠纷发生地。" />
				</u-form-item> -->
				<u-form-item left-icon="account" :left-icon-style="leftIconStyle" label="联系人:"
					:required="true" label-position="top" prop="linkman">
					<u-input v-model="dataTemp.linkman" :border="true" placeholder="请填写纠纷申请联系人姓名。" />
				</u-form-item>
				<u-form-item left-icon="phone" :left-icon-style="leftIconStyle" label="联系电话:"
					:required="true" label-position="top" prop="mobile">
					<u-input type="number" maxlength="11" v-model="dataTemp.mobile" :border="true" placeholder="请填写纠纷申请联系人联系方式。" />
				</u-form-item>
				<view class="u-flex u-row-between parties-head">
					<u-form-item left-icon="plus-people-fill" :left-icon-style="leftIconStyle" label="申请人:"
						:required="true" label-position="top" prop="briefContent" />
					<view>
						<u-button @click="addApplicant()" size="medium" type="info" class="add-button">添加</u-button>
					</view>
				</view>
				<view v-for="applicant in applicantList" :key="applicant.id">
					<view class="u-flex u-row-between parties-body">
						<view v-if="applicant.responsiblePerson == '' ">{{ applicant.name }}</view>
						<view v-if="applicant.responsiblePerson != '' ">{{ applicant.responsiblePerson }}</view>
						<view>{{ applicant.partiesTypeName }}</view>
						<view>{{ applicant.mobile }}</view>
						<view><u-icon name="minus-circle" size="35" color="#fa3534" @click="deleteApplicantDetail(applicant)" /></view>
					</view>
				</view>
				<view class="notIn-partiesType" v-if="applicantList.length == 0">—您还未添加申请人....—</view>
				<view class="u-flex u-row-between parties-head">
					<u-form-item left-icon="plus-people-fill" :left-icon-style="leftIconStyle" label="被申请人:"
						:required="true" label-position="top" prop="briefContent" />
					<view><u-button @click="addRespondent()" size="medium" type="info" class="add-button">添加</u-button></view>
				</view>
				<view v-for="respondent in respondentList" :key="respondent.id">
					<view class="u-flex u-row-between parties-body" style="color: #4AB0F6;">
						<view v-if="respondent.responsiblePerson == '' ">{{ respondent.name }}</view>
						<view v-if="respondent.responsiblePerson != '' ">{{ respondent.responsiblePerson }}</view>
						<view>{{ respondent.partiesTypeName }}</view>
						<view>{{ respondent.mobile }}</view>
						<view><u-icon name="minus-circle" size="35" color="#fa3534" @click="deleteRespondentDetail(respondent)" /></view>
					</view>
				</view>
				<view class="notIn-partiesType" v-if="respondentList.length == 0">—您还未添加被申请人....—</view>
				<u-form-item left-icon="tags" :left-icon-style="leftIconStyle" label="纠纷类型:"
					:required="true" label-position="top" prop="typeName">
					<u-input type="select" :select-open="typeSelectShow" :border="true"
						v-model="dataTemp.typeName" placeholder="请选择纠纷类型。"
					 @click="typeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="JFtypeList" v-model="typeSelectShow"
					 @confirm="typeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item left-icon="list" :left-icon-style="leftIconStyle" label="纠纷级别:"
					:required="true" label-position="top" prop="levelName">
					<u-input type="select" :select-open="levelSelectShow" :border="true"
						v-model="dataTemp.levelName" placeholder="请选择纠纷级别。"
					 @click="levelSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="levelList" v-model="levelSelectShow"
					 @confirm="levelSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item left-icon="file-text-fill" :left-icon-style="leftIconStyle" label="简要情况:"
					:required="true" label-position="top" prop="briefContent">
					<u-input v-model="dataTemp.briefContent" type="textarea"
						height="150" :border="true"
						placeholder="请填写纠纷简要情况,为利于您申报的矛盾纠纷调解得到及时处理,请明确填写相关问题的时间、地点、事件过程。"
					/>
				</u-form-item>
				<u-form-item left-icon="order" :left-icon-style="leftIconStyle" label="诉求:"
					:required="true" label-position="top" prop="applyContent">
					<u-input v-model="dataTemp.applyContent" type="textarea"
						height="150" :border="true"
						placeholder="请填写纠纷诉求内容。"
					/>
				</u-form-item>
				<u-form-item label="附件:" label-position="top">
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
			</u-form>
		</view>
		<view style="margin-bottom: 20px;">
			<u-button type="primary" :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交申报</u-button>
		</view>
	</view>
</template>

<script>
	import DispResoPlat from '@/api/disputesResolvePlatform.js'
	import DictionaryApi from '@/api/dictionary.js'
	import moment from 'moment'
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	import FileApi from '../../../../api/fileupload.js'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				customStyleAdd: {
					height: '75rpx'
				},
				tempCBDBfiles: [],
				customStyle: {
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				leftIconStyle: { color: '#1261d4' },
				levelList: [
					{innerId: 0, text: '简单'},
					{innerId: 1, text: '一般'},
					{innerId: 2, text: '重大'},
					{innerId: 3, text: '疑难'}
				],
				JFtypeList: [],
				levelSelectShow: false,
				typeSelectShow: false,
				applicantList: [],
				respondentList: [],
				dataTemp: {
					applicantIdList: [],
					applyContent: '',
					briefContent: '',
					files: [],
					level: '',
					levelName: '',
					openid: '',
					respondentIdList: [],
					type: '',
					typeName: '',
					linkman: '',
					mobile: '',
					name: '',
					address: '',
					happenRegionCode: '',
					happenRegionName: ''
				},
				rules: {
					name: [{ required: true, message: '请填写纠纷名称', trigger: 'change' }],
					happenRegionName: [{ required: true, message: '请选择纠纷发生地点', trigger: 'change' }],
					typeName: [{ required: true, message: '请选择纠纷类型', trigger: 'change' }],
					levelName: [{ required: true, message: '请选择纠纷级别', trigger: 'change' }],
					applyContent: [{ required: true, message: '请填写纠纷诉求内容', trigger: 'change' }],
					briefContent: [{ required: true, message: '请填写纠纷简要情况', trigger: 'change' }],
					mobile: [
						{ required: true, message: '请填写申报人联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					],
					linkman: [{ required: true, message: '请填写申报人姓名', trigger: 'change' }]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				imgList: [],
				videoList: [],
				regionShow: false,
				tabbarList: []
			}
		},
		onShow() {},
		onLoad() {
			this.fetchDir()
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
			this.dataTemp.declarationDate = new moment().format('YYYY-MM-DD')
			uni.$on('addApplicant', (peopleList) => {
				this.dealApplicant(peopleList)
			})
			uni.$on('addRespondent', (respondentPeopleList) => {
				this.dealRespondent(respondentPeopleList)
			})
		},
		onUnload() {
		    // 移除监听事件  
		    uni.$off('addApplicant')
		    uni.$off('addRespondent')
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			deleteChildren(arr) {
				let childs = arr
				for (let i = childs.length; i--; i > 0) {
					if (childs[i].children) {
						if (childs[i].children.length) {
							this.deleteChildren(childs[i].children)
						} else {
							delete childs[i].children
						}
					}
				}
				return arr
			},
			fetchDir() {
				var _this = this
				// 纠纷类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'mediate_type'
				}).then(res => {
					this.$nextTick(function() {
						this.JFtypeList = res.data.data
					})
				})
				DispResoPlat.getMediateRegionCode().then(res => {
					var listStep = res.data.data.children
					_this.tabbarList = _this.deleteChildren(listStep)
				})
			},
			regionConfirm(e) {
				this.dataTemp.happenRegionName = e[0].label + e[1].label + e[2].label
				this.dataTemp.happenRegionCode = e[2].value
			},
			// 纠纷类型选择
			typeSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.typeName = val.label
					this.dataTemp.type = val.value
				})
			},
			// 纠纷级别选择
			levelSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.levelName = val.label
					this.dataTemp.level = val.value
				})
			},
			addApplicant() {
				uni.navigateTo({
					url: '../../addPeople/addApplicant'
				})
			},
			// 处理申请人添加
			dealApplicant(peopleList) {
				var _this = this
				peopleList.forEach(element => {
					_this.applicantList.push(element)
				})
			},
			deleteApplicantDetail(item, list) {
				for (var key in this.applicantList) {
				    if (this.applicantList[key].id === item.id) {
				      this.applicantList.splice(key, 1)
				    }
				}
			},
			// 跳转添加被申请人
			addRespondent() {
				uni.navigateTo({
					url: '../../addPeople/addRespondent'
				})
			},
			// 处理被申请人添加
			dealRespondent(respondentPeopleList) {
				var _this = this
				respondentPeopleList.forEach(element => {
					_this.respondentList.push(element)
				})
			},
			// 删除被申请人当事人信息
			deleteRespondentDetail(item, list) {
				for (var key in this.respondentList) {
				    if (this.respondentList[key].id === item.id) {
				      this.respondentList.splice(key, 1)
				    }
				}
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
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
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
			// 直接办结附件选择 end
			chooseVideo() {
				var _this = this
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						FileApi.uploadFileByUni(res.tempFilePath).then(resupload => {
							if (resupload[1].statusCode == 200) {
								var i = JSON.parse(resupload[1].data)
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
			// 立即申报
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				if (_this.applicantList.length == 0 || _this.respondentList.length == 0) {
					uni.showToast({
						title: '请添加申请人和被申请人',
						icon: 'none'
					})
				} else {
					_this.dataTemp.openid = openid
					_this.imgList.forEach(element => {
						_this.dataTemp.files.push(element.fileId)
					})
					_this.videoList.forEach(element => {
						_this.dataTemp.files.push(element.fileId)
					})
					this.$refs.uForm.validate(valid => {
						if (valid) {
							_this.respondentList.forEach(element => {
								_this.dataTemp.respondentIdList.push(element.id)
							})
							_this.applicantList.forEach(item => {
								_this.dataTemp.applicantIdList.push(item.id)
							})
							_this.buttonLoading = true
							_this.dataTemp.address = _this.dataTemp.happenRegionName
							DispResoPlat.saveMediateRegistWorker(_this.dataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '填报成功！',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/pages/main/main'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '申报失败: 请检查后重试',
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})
						} else {
							_this.buttonLoading = false
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notIn-partiesType {
		color: #AAAAAA;
		text-align: center;
		font-size: small;
	}
	.form {
		padding: 20upx 40upx;
	}
	.parties-head {
		height: 80rpx;
	}
	.add-button {
		height: 60rpx;
		width: 160rpx;
	}
	.parties-body {
		padding: 0rpx 20rpx 0rpx 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 1px #ececec solid;
		color: #1CBBB4;
	}
	.view-file {
		width: 10%;
		text-align: center;
		height: 5vh;
		line-height: 5vh;
		display: flex;
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
			.item {}
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
