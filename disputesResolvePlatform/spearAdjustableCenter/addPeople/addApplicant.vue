<template>
	<view class="form">
		<u-form :model="applicantDataTemp" ref="applicantFormData" :error-type="errorType">
			<!-- 当事人类型选择 -->
			<u-form-item label="当事人类型:" :required="true" label-position="top" prop="partiesTypeName">
				<u-input type="select" :select-open="applicantTypeSelectShow" :border="true"
					v-model="applicantDataTemp.partiesTypeName"
				 @click="applicantTypeSelectShow = true"></u-input>
				<u-select mode="single-column" value-name="id" label-name="text"
					:list="typeList" v-model="applicantTypeSelectShow"
				 @confirm="applicantTypeSelectConfirm"></u-select>
			</u-form-item>
			<!-- 自然人信息 -->
			<view v-if="applicantDataTemp.partiesType == 0">
				<u-form-item label="姓名:" :required="true" label-position="top" prop="name">
					<view style="width: 100%;display: flex;">
						<view style="width: 100%;">
							<u-input v-model="applicantDataTemp.name" :border="true" />
						</view>
						<!-- <view style="width: 15%;height: 80rpx;line-height: 80rpx;text-align: center;" @click="getIdCardDetail()">
							<u-icon name="camera" color="#2979ff" size="50" />
						</view> -->
					</view>
				</u-form-item>
				<u-form-item label="证件类型:" :required="true" label-position="top" prop="certificateTypeName">
					<u-input type="select" :select-open="cardTypeSelectShow" :border="true"
						v-model="applicantDataTemp.certificateTypeName"
					 @click="cardTypeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="cardTypeList" v-model="cardTypeSelectShow"
					 @confirm="cardTypeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="证件号码:" :required="true" label-position="top" prop="certificateCode">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.certificateCode" :border="true" />
				</u-form-item>
				<u-form-item label="联系电话:" label-position="top" :required="true" prop="mobile">
					<u-input cursor-spacing="150" type="number" maxlength="11" v-model="applicantDataTemp.mobile" :border="true" />
				</u-form-item>
				<u-form-item v-if="applicantDataTemp.certificateType != 1" label="性别" 
					label-position="top" prop="gender">
					<u-input cursor-spacing="150" type="select" :select-open="genderSelectShow" :border="true"
						v-model="applicantDataTemp.gender" placeholder="请选择性别"
					 @click="genderSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="genderList" v-model="genderSelectShow"
					 @confirm="genderSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="民族:" label-position="top" prop="nation">
					<u-input cursor-spacing="150" type="select" :select-open="nationSelectShow" :border="true"
						v-model="applicantDataTemp.nation"
					 @click="nationSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="nationList" v-model="nationSelectShow"
					 @confirm="nationSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item v-if="applicantDataTemp.certificateType != 1" label="出生年月" label-position="top">
					<u-input cursor-spacing="150" type="select" :select-open="birthdaySelectshow" :border="true"
						v-model="applicantDataTemp.birthday" placeholder="请选择出生年月"
					 @click="birthdaySelectshow = true"></u-input>
					<u-picker v-model="birthdaySelectshow" mode="time" @confirm="birthdaySelectConfirm"></u-picker>
				</u-form-item>
				<u-form-item label="职业:" label-position="top" prop="occupation">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.occupation" :border="true" />
				</u-form-item>
				<u-form-item label="联系地址:" label-position="top" prop="address">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.address" :border="true" />
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
			<view v-if="applicantDataTemp.partiesType == 1">
				<u-form-item label="单位名称:" label-position="top" :required="true" prop="name">
					<u-input v-model="applicantDataTemp.name" :border="true" />
				</u-form-item>
				<u-form-item label="单位联系方式:" label-position="top" :required="true" prop="mobile">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.mobile" :border="true" />
				</u-form-item>
				<u-form-item label="单位负责人:" label-position="top" prop="responsiblePerson">
					<u-input v-model="applicantDataTemp.responsiblePerson" :border="true" />
				</u-form-item>
				<u-form-item label="工商执照代码:" label-position="top" prop="certificateCode">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.certificateCode" :border="true" />
				</u-form-item>
				<u-form-item label="单位联系地址:" label-position="top" prop="address">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.address" :border="true" />
				</u-form-item>
			</view>
			<!-- 非法人信息 -->
			<view v-if="applicantDataTemp.partiesType == 2">
				<u-form-item label="组织名称:" label-position="top" :required="true" prop="name">
					<u-input v-model="applicantDataTemp.name" :border="true" />
				</u-form-item>
				<u-form-item label="组织联系方式:" label-position="top" :required="true" prop="mobile">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.mobile" :border="true" />
				</u-form-item>
				<u-form-item label="组织负责人:" label-position="top" prop="responsiblePerson">
					<u-input v-model="applicantDataTemp.responsiblePerson" :border="true" />
				</u-form-item>
				<u-form-item label="组织机构代码:" label-position="top" prop="certificateCode">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.certificateCode" :border="true" />
				</u-form-item>
				<u-form-item label="组织联系地址:" label-position="top" prop="address">
					<u-input cursor-spacing="150" v-model="applicantDataTemp.address" :border="true" />
				</u-form-item>
			</view>
		</u-form>
		<view class="u-flex u-row-between" style="margin: 0 10% 0 10%;">
			<u-button type="info" @click="returnPreviousPage()">返回</u-button>
			<u-button type="success" @click="addApplicantDetail()" >添加</u-button>
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
				// 民族
				nationList: [],
				// 性别
				genderList: [],
				genderSelectShow: false,
				nationSelectShow: false,
				birthdaySelectshow: false,
				// 申请人当事人类型选择控制显示
				applicantTypeSelectShow: false,
				// 申请人当事人类型选择控制显示
				cardTypeSelectShow: false,
				// 申请人当事人列表临时
				applicantList: [],
				// 申请人当事人列表数据
				applicantDataTemp: {
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
				// 自然人规则验证
				rulesPeople: {
					name: [{ required: true, message: '请填写姓名', trigger: 'change' }],
					certificateCode: [
						{ required: true, message: '请填写您的身份证号', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.idCard(value)},
							message: '身份证件号不正确'}
					],
					mobile: [
						{ required: true, message: '请填写您的联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					]
				},
				// 非自然人规则验证
				rulesOrg: {
					name: [{ required: true, message: '请填写单位名称', trigger: 'change' }],
					mobile: [{ required: true, message: '请填写单位联系方式', trigger: 'change' }]
				},
				// 附件，身份证图片
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
					this.applicantDataTemp.gender = val.label
					this.applicantDataTemp.genderId = val.value
				})
			},
			// 出生年月
			birthdaySelectConfirm(e) {
				this.applicantDataTemp.birthday = e.year + '-' + e.month + '-' + e.day
			},
			// 申请当事人人员信息类型变换
			applicantTypeSelectConfirm(e) {
				var _self = this
				e.map((val, index) => {
					_self.applicantDataTemp.partiesType = val.value
					_self.applicantDataTemp.partiesTypeName = val.label
					_self.applicantDataTemp.birthday = ''
					_self.applicantDataTemp.certificateCode = ''
					_self.applicantDataTemp.certificateType = ''
					_self.applicantDataTemp.certificateTypeName = ''
					_self.applicantDataTemp.genderId = ''
					_self.applicantDataTemp.mobile = ''
					_self.applicantDataTemp.name = ''
					_self.applicantDataTemp.nation = ''
					_self.applicantDataTemp.nationId = ''
					_self.applicantDataTemp.occupation = ''
					_self.applicantDataTemp.responsiblePerson = ''
					_self.applicantDataTemp.address = ''
					_self.applicantDataTemp.id = _self.applicantDataTemp.id
				})
				if (e[0].value == 0) {
					_self.applicantDataTemp.certificateType = 1
					_self.applicantDataTemp.certificateTypeName = '身份证'
				} else if (e[0].value == 1) {
					_self.applicantDataTemp.certificateType = 2
					_self.applicantDataTemp.certificateTypeName = '工商营业执照'
				} else if (e[0].value == 2) {
					_self.applicantDataTemp.certificateType = 3
					_self.applicantDataTemp.certificateTypeName = '组织机构代码证'
				}
			},
			// 申请当事人民族变换回显
			nationSelectConfirm(e) {
				e.map((val, index) => {
					this.applicantDataTemp.nation = val.label
					this.applicantDataTemp.nationId = val.value
				})
			},
			// 申请当事人人员证件类型变换回显
			cardTypeSelectConfirm(e) {
				e.map((val, index) => {
					this.applicantDataTemp.certificateTypeName = val.label
					this.applicantDataTemp.certificateType = val.value
					this.applicantDataTemp.certificateCode = ''
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
			// 附件选择处理
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
			// 添加申请人当事人信息
			addApplicantDetail() {
				var _self = this
				// 自然人
				_self.applicantList = []
				if (_self.applicantDataTemp.partiesType == 0) {
						this.$refs.applicantFormData.setRules(_self.rulesPeople);
						this.$refs.applicantFormData.validate(valid => {
						if (valid) {
							if (_self.applicantDataTemp.certificateType == 1) {
								if (_self.applicantDataTemp.certificateCode != '') {
									// 出生日期
									_self.applicantDataTemp.birthday = _self.applicantDataTemp.certificateCode.substring(6, 10) + '-' + _self.applicantDataTemp.certificateCode.substring(10, 12) +
									  '-' + _self.applicantDataTemp.certificateCode.substring(12, 14)
									 // 性别
									if (parseInt(_self.applicantDataTemp.certificateCode.substr(16, 1)) % 2 === 1) {
										_self.applicantDataTemp.genderId = '1'
									} else {
										_self.applicantDataTemp.genderId = '2'
									}
								}
								_self.imgList.forEach(element => {
									_self.applicantDataTemp.files.push(element.fileId)
								})
							}
							DispResoPlat.addPartiesPeopel(_self.applicantDataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '添加当事人信息成功！',
										icon: 'none'
									})
									_self.applicantDataTemp.id = res.data.data.id
									_self.applicantList.push(_self.applicantDataTemp)
									uni.$emit('addApplicant', _self.applicantList)
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.showToast({
										title: '添加当事人信息失败。',
										icon: 'none'
									})
								}
							})
						} else {
							console.log('验证失败');
						}
					})
				} else {
					this.$refs.applicantFormData.setRules(_self.rulesOrg);
					this.$refs.applicantFormData.validate(valid => {
						if (valid) {
							DispResoPlat.addPartiesOrg(_self.applicantDataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '添加当事人信息成功！',
										icon: 'none'
									})
									_self.applicantDataTemp.id = res.data.data.id
									_self.applicantList.push(_self.applicantDataTemp)
									uni.$emit('addApplicant', _self.applicantList)
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.showToast({
										title: '添加当事人信息失败。',
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
