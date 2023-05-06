<template>
	<view class="form">
		<u-form :model="respondentDataTemp" ref="respondentFormData" :error-type="errorType">
			<!-- 当事人类型选择 -->
			<u-form-item label="当事人类型:" :required="true" label-position="top" prop="partiesTypeName">
				<u-input type="select" :select-open="respondentTypeSelectShow" :border="true"
					v-model="respondentDataTemp.partiesTypeName"
				 @click="respondentTypeSelectShow = true"></u-input>
				<u-select mode="single-column" value-name="id" label-name="text"
					:list="typeList" v-model="respondentTypeSelectShow"
				 @confirm="respondentTypeSelectConfirm"></u-select>
			</u-form-item>
			<!-- 自然人信息 -->
			<view v-if="respondentDataTemp.partiesType == 0">
				<u-form-item label="姓名:" :required="true" label-position="top" prop="name">
					<view style="width: 100%;display: flex;">
						<view style="width: 100%;">
							<u-input v-model="respondentDataTemp.name" :border="true" />
						</view>
						<!-- <view style="width: 15%;height: 80rpx;line-height: 80rpx;text-align: center;" @click="getIdCardDetail()">
							<u-icon name="camera" color="#2979ff" size="50" />
						</view> -->
					</view>
				</u-form-item>
				<u-form-item label="联系电话:" label-position="top" :required="true" prop="mobile">
					<u-input cursor-spacing="150" type="number" maxlength="11" v-model="respondentDataTemp.mobile" :border="true" />
				</u-form-item>
				<u-form-item label="证件类型:" label-position="top" prop="certificateTypeName">
					<u-input type="select" :select-open="cardTypeSelectShow" :border="true"
						v-model="respondentDataTemp.certificateTypeName"
					 @click="cardTypeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="cardTypeList" v-model="cardTypeSelectShow"
					 @confirm="cardTypeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="证件号码:" label-position="top" prop="certificateCode">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.certificateCode" :border="true" />
				</u-form-item>
				<u-form-item v-if="respondentDataTemp.certificateType != 1" label="性别" label-position="top">
					<u-input type="select" :select-open="genderSelectShow" :border="true"
						v-model="respondentDataTemp.gender" placeholder="请选择性别"
					 @click="genderSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="genderList" v-model="genderSelectShow"
					 @confirm="genderSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="民族:" label-position="top" prop="nation">
					<u-input type="select" :select-open="nationSelectShow" :border="true"
						v-model="respondentDataTemp.nation"
					 @click="nationSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="nationList" v-model="nationSelectShow"
					 @confirm="nationSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item v-if="respondentDataTemp.certificateType != 1" label="出生年月" label-position="top">
					<u-input type="select" :select-open="birthdaySelectshow" :border="true"
						v-model="respondentDataTemp.birthday" placeholder="请选择出生年月"
					 @click="birthdaySelectshow = true"></u-input>
					<u-picker v-model="birthdaySelectshow" mode="time" @confirm="birthdaySelectConfirm"></u-picker>
				</u-form-item>
				<u-form-item label="职业:" label-position="top" prop="occupation">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.occupation" :border="true" />
				</u-form-item>
				<u-form-item label="联系地址:" label-position="top" prop="address">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.address" :border="true" />
				</u-form-item>
				<u-form-item label="身份证照片附件:" label-position="top">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="ChooseImage">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传身份证照片" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</view>
			<!-- 法人信息 -->
			<view v-if="respondentDataTemp.partiesType == 1">
				<u-form-item label="单位名称:" label-position="top" :required="true" prop="name">
					<u-input v-model="respondentDataTemp.name" :border="true" />
				</u-form-item>
				<u-form-item label="单位联系方式:" label-position="top" :required="true" prop="mobile">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.mobile" :border="true" />
				</u-form-item>
				<u-form-item label="单位负责人:" label-position="top" prop="responsiblePerson">
					<u-input v-model="respondentDataTemp.responsiblePerson" :border="true" />
				</u-form-item>
				<u-form-item label="工商执照代码:" label-position="top" prop="certificateCode">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.certificateCode" :border="true" />
				</u-form-item>
				<u-form-item label="单位联系地址:" label-position="top" prop="address">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.address" :border="true" />
				</u-form-item>
			</view>
			<!-- 非法人信息 -->
			<view v-if="respondentDataTemp.partiesType == 2">
				<u-form-item label="组织名称:" label-position="top" :required="true" prop="name">
					<u-input v-model="respondentDataTemp.name" :border="true" />
				</u-form-item>
				<u-form-item label="组织联系方式:" label-position="top" :required="true" prop="mobile	">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.mobile	" :border="true" />
				</u-form-item>
				<u-form-item label="组织负责人:" label-position="top" prop="responsiblePerson">
					<u-input v-model="respondentDataTemp.responsiblePerson" :border="true" />
				</u-form-item>
				<u-form-item label="组织机构代码:" label-position="top" prop="certificateCode">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.certificateCode" :border="true" />
				</u-form-item>
				<u-form-item label="组织联系地址:" label-position="top" prop="address">
					<u-input cursor-spacing="150" v-model="respondentDataTemp.address" :border="true" />
				</u-form-item>
			</view>
		</u-form>
		<view class="u-flex u-row-between" style="margin: 0 10% 0 10%;">
			<u-button type="info" @click="returnPreviousPage()">返回</u-button>
			<u-button type="success" @click="addRespondentDetail()" >添加</u-button>
		</view>
	</view>
</template>

<script>
	import DispResoPlat from '@/api/disputesResolvePlatform.js'
	import DictionaryApi from '@/api/dictionary.js'
	import FileApi from '../../../api/fileupload.js'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				// 当事人类型
				typeList: [
					{id: 0, text: '自然人'},
					{id: 1, text: '法人'},
					{id: 2, text: '非法人组织'}
				],
				// 证件类型
				cardTypeList: [],
				nationList: [],
				genderList: [],
				genderSelectShow: false,
				nationSelectShow: false,
				birthdaySelectshow: false,
				// 申请人当事人类型选择控制显示
				cardTypeSelectShow: false,
				// 被申请人当事人类型选择控制显示
				respondentTypeSelectShow: false,
				// 被申请人当事人列表临时
				respondentList: [],
				// 被申请人当事人数据
				respondentDataTemp: {
					id: '',
					partiesType: 0,
					partiesTypeName: '自然人',
					birthday: '',
					certificateCode: '',
					certificateType: 1,
					certificateTypeName: '身份证',
					genderId: '',
					mobile: '',
					name: '',
					nation: '',
					nationId: '',
					occupation: '',
					responsiblePerson: '',
					address: '',
					files: []
				},
				errorType: ['toast', 'border'],
				rulesPeople: {
					name: [{ required: true, message: '请填写姓名', trigger: 'change' }],
					// certificateCode: [
					// 	{ required: true, message: '请填写您的身份证号', trigger: ['change', 'blur'] },
					// 	{ validator: (rule, value, callback) => {
					// 			return this.$u.test.idCard(value)},
					// 		message: '身份证件号不正确'}
					// ],
					mobile: [
						{ required: true, message: '请填写您的联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					]
					// nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
					// occupation: [{ required: true, message: '请填写职业', trigger: 'change' }],
					// address: [{ required: true, message: '请填写联系地址', trigger: 'change' }]
				},
				rulesOrg: {
					name: [{ required: true, message: '请填写单位名称', trigger: 'change' }],
					// certificateCode: [{ required: true, message: '请填写单位证件号码', trigger: 'change' }],
					mobile: [{ required: true, message: '请填写单位联系方式', trigger: 'change' }],
					// responsiblePerson: [{ required: true, message: '请填写单位负责人姓名', trigger: 'change' }],
					// address: [{ required: true, message: '请填写单位联系地址', trigger: 'change' }]
				},
				imgList: []
			}
		},
		onShow() {},
		onLoad() {
			this.fetchDir()
		},
		onReady() {},
		methods: {
			//取数据字典
			fetchDir() {
				var _this = this
				// 取民族
				DictionaryApi.getNation().then(res => {
					this.nationList = res.data.data
				})
				// 取性别
				DictionaryApi.getGender().then(res => {
					this.genderList = res.data.data
				})
				// 取证件类型
				DictionaryApi.getCardType().then(res => {
					this.cardTypeList = res.data.data
				})
			},
			//性别选择
			genderSelectConfirm(e) {
				e.map((val, index) => {
					this.respondentDataTemp.gender = val.label
					this.respondentDataTemp.genderId = val.value
				})
			},
			// 出生年月
			birthdaySelectConfirm(e) {
				this.respondentDataTemp.birthday = e.year + '-' + e.month + '-' + e.day
			},
			// 民族
			nationSelectConfirm(e) {
				e.map((val, index) => {
					this.respondentDataTemp.nation = val.label
					this.respondentDataTemp.nationId = val.value
				})
			},
			// 申请人员证件类型变换
			cardTypeSelectConfirm(e) {
				e.map((val, index) => {
					this.respondentDataTemp.certificateTypeName = val.label
					this.respondentDataTemp.certificateType = val.value
					this.respondentDataTemp.certificateCode = ''
				})
			},
			// 通过身份证照片识别
			getIdCardDetail() {
				var _self = this
				uni.chooseImage({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						uni.showLoading({
							title: '正在识别中...'
						})
						const invokeRes = wx.serviceMarket.invokeService({
						  service: 'wx79ac3de8be320b71', // '固定为服务商OCR的appid，非小程序appid',
						  api: 'OcrAllInOne',
						  data: {
							img_url: new wx.serviceMarket.CDN({
								type: 'filePath',
								filePath: res.tempFilePaths[0],
							 }),
							data_type: 3,
							ocr_type: 1,
						  },
						}).then(res => {
						  uni.hideLoading()
						  wx.showModal({
							title: '识别成功',
							content: '姓名：' + res.data.idcard_res.name.text + '，身份证件号码：' + res.data.idcard_res.id.text,
							success: function(i) {
								if (i.confirm == true) {
									_self.applicantDataTemp.name = ''
									_self.applicantDataTemp.certificateCode = ''
									_self.applicantDataTemp.name = res.data.idcard_res.name.text
									_self.applicantDataTemp.certificateCode = res.data.idcard_res.id.text
								}
							}
						  })
						}).catch(err => {
						  uni.hideLoading()
						  wx.showModal({
							title: '抱歉，识别失败',
							content: '请您重新检查需要上传的身份证背面图片后进行上传！',
						  })
						})
					}
				});
			},
			// 被申请当事人人员信息类型变换
			respondentTypeSelectConfirm(e) {
				var _self = this
				e.map((val, index) => {
					_self.respondentDataTemp.partiesType = val.value
					_self.respondentDataTemp.partiesTypeName = val.label
					_self.respondentDataTemp.birthday = ''
					_self.respondentDataTemp.certificateCode = ''
					_self.respondentDataTemp.certificateType = ''
					_self.respondentDataTemp.certificateTypeName = ''
					_self.respondentDataTemp.genderId = ''
					_self.respondentDataTemp.mobile = ''
					_self.respondentDataTemp.name = ''
					_self.respondentDataTemp.nation = ''
					_self.respondentDataTemp.nationId = ''
					_self.respondentDataTemp.occupation = ''
					_self.respondentDataTemp.responsiblePerson = ''
					_self.respondentDataTemp.address = ''
					_self.respondentDataTemp.id = _self.respondentDataTemp.id
				})
				if (e[0].value == 0) {
					_self.respondentDataTemp.certificateType = 1
					_self.respondentDataTemp.certificateTypeName = '身份证'
				} else if (e[0].value == 1) {
					_self.respondentDataTemp.certificateType = 2
					_self.respondentDataTemp.certificateTypeName = '工商营业执照'
				} else if (e[0].value == 2) {
					_self.respondentDataTemp.certificateType = 3
					_self.respondentDataTemp.certificateTypeName = '组织机构代码证'
				}
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
			// 添加被申请人当事人信息
			addRespondentDetail() {
				var _self = this
				// 自然人
				if (_self.respondentDataTemp.partiesType == 0) {
						this.$refs.respondentFormData.setRules(_self.rulesPeople);
						this.$refs.respondentFormData.validate(valid => {
						if (valid) {
							if (_self.respondentDataTemp.certificateType == 1) {
								if (_self.respondentDataTemp.certificateCode != '') {
									 // 出生日期
									_self.respondentDataTemp.birthday = _self.respondentDataTemp.certificateCode.substring(6, 10) + '-' + _self.respondentDataTemp.certificateCode.substring(10, 12) +
									  '-' + _self.respondentDataTemp.certificateCode.substring(12, 14)
									 // 性别
									if (parseInt(_self.respondentDataTemp.certificateCode.substr(16, 1)) % 2 === 1) {
										_self.respondentDataTemp.genderId = '1'
									} else {
										_self.respondentDataTemp.genderId = '2'
									}
								}
								_self.imgList.forEach(element => {
									_self.respondentDataTemp.files.push(element.fileId)
								})
							}
							DispResoPlat.addPartiesPeopel(_self.respondentDataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '添加被申请人信息成功！',
										icon: 'none'
									})
									_self.respondentDataTemp.id = res.data.data.id
									_self.respondentList.push(_self.respondentDataTemp)
									uni.$emit('addRespondent', _self.respondentList)
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.showToast({
										title: '添加被申请人信息失败，请检查后重试',
										icon: 'none'
									})
								}
							})
						} else {
							console.log('验证失败');
						}
					})
				} else {
					this.$refs.respondentFormData.setRules(_self.rulesOrg);
					this.$refs.respondentFormData.validate(valid => {
						if (valid) {
							DispResoPlat.addPartiesOrg(_self.respondentDataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '添加被申请人信息成功！',
										icon: 'none'
									})
									_self.respondentDataTemp.id = res.data.data.id
									_self.respondentList.push(_self.respondentDataTemp)
									uni.$emit('addRespondent', _self.respondentList)
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.showToast({
										title: '添加被申请人信息失败，请检查后重试',
										icon: 'none'
									})
								}
							})
						} else {
							console.log('验证失败');
						}
					})
				}
			},
			returnPreviousPage() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	.upload-media {
		border: #F1F1F1 1upx solid;
		width: 100%;
		display: flex;
		align-items: center;
		justify-items: flex-start;
	}
	.uploadIcon {
		text-align: center;
		width: 50%;
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
</style>
