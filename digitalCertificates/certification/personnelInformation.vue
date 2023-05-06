<template>
	<view class="user-body">
		<view style="background-color: #FFFFFF;min-height: 95vh;padding: 10upx 20upx;">
			<u-form :model="userInfo" ref="certificationFormData" :error-type="errorType">
				<view>身份证信息</view>
				<view class="note-show">
					<view><u-icon name="info-circle-fill" size="10" />身份证拍摄要求</view>
					<view>大陆公民持有的本人有效二代身份证；拍摄时确保身份证：边框完整，字体清晰，亮度均匀。</view>
					<view>(身份证信息仅用作本次认证有效，不用做其他场所)</view>
				</view>
				<u-form-item>
					<view style="display: flex;width: 100%;">
						<!-- 国徽面 -->
						<view class="upload-media">
							<view class="upload-image">
								<view class="bg-img item" v-for="(item,index) in imgGHList" :key="index" :data-url="imgGHList[index]">
									<image :src="imgGHList[index].imgPath" mode="aspectFill" @tap="chooseImageGH()"></image>
								</view>
								<view v-if="imgGHList.length === 0" class="uploadIcon-gh" @tap="chooseImageGH()" />
							</view>
							<view style="text-align: center;">身份证——国徽面</view>
						</view>
						<!-- 姓名面 -->
						<view class="upload-media">
							<view class="upload-image">
								<view class="bg-img item" v-for="(item,index) in imgXXList" :key="index" :data-url="imgXXList[index]">
									<image :src="imgXXList[index].imgPath" mode="aspectFill" @tap="chooseImageXX()"></image>
								</view>
								<view v-if="imgXXList.length === 0" class="uploadIcon-xx" @tap="chooseImageXX()" />
							</view>
							<view style="text-align: center;">身份证——人像面</view>
						</view>
					</view>
				</u-form-item>
				<u-form-item>
					<!-- 免冠照 -->
					<view class="upload-media-user">
						<view class="upload-image-user">
							<view class="bg-img item" v-for="(item,index) in imgMGZList" :key="index" :data-url="imgMGZList[index]">
								<image :src="imgMGZList[index].imgPath" mode="aspectFill" @tap="chooseImageMGZ()"></image>
							</view>
							<view v-if="imgMGZList.length === 0" class="uploadIcon-user" @tap="chooseImageMGZ()" />
						</view>
						<view style="text-align: center;">免冠照</view>
					</view>
				</u-form-item>
				<u-form-item label="姓名:" prop="name" label-width="75">
					<view style="width: 100%;display: flex;">
						<view style="width: 100%;">
							<u-input v-model="userInfo.name" placeholder="请填写您的姓名" />
						</view>
					</view>
				</u-form-item>
				<u-form-item label="身份证号:" prop="idCard" label-width="130">
					<view style="width: 100%;display: flex;">
						<view style="width: 100%;">
							<u-input cursor-spacing="150" v-model="userInfo.idCard" placeholder="请填写您的身份证号码" />
						</view>
					</view>
				</u-form-item>
				<u-form-item label="住址:" prop="residenceAddress" label-width="75">
					<view style="width: 100%;display: flex;">
						<view style="width: 100%;">
							<u-input cursor-spacing="150" v-model="userInfo.residenceAddress" placeholder="请填写您的住址"/>
						</view>
					</view>
				</u-form-item>
			</u-form>
			<view style="margin: 20px 30rpx 0 30rpx;">
				<button class="login-phone" @click="saveData" :loading="buttonLoading">开始认证</button>
			</view>
		</view>
	</view>
</template>

<script>
import FileApi from '@/api/fileupload.js'
import DigitalCertificates from '@/api/digitalCertificates.js'

export default {
	data() {
		return {
			customStyle: {
				backgroundColor: '#1941A0',
				color: '#FFFFFF',
				width: '90%',
				height: '90rpx'
			},
			buttonLoading: false,
			userInfo: {
				birthday: '',
				genderId: '',
				name: '',
				idCard: '',
				idcardFileBack: '',
				idcardFileFront: '',
				openId: '',
				photoFile: '',
				residenceAddress: '',
				residentId: ''
			},
			errorType: ['toast', 'border'],
			// 附件，身份证--国徽面
			imgGHList: [],
			// 附件，身份证--姓名面
			imgXXList: [],
			// 附件，免冠照
			imgMGZList: [],
			rules: {
				name: [{ required: true, message: '请填写您的姓名', trigger: 'change' }],
				residenceAddress: [{ required: true, message: '请填写您的住址', trigger: 'change' }],
				idCard: [
					{ required: true, message: '请填写您的身份证号', trigger: ['change', 'blur'] },
					{ validator: (rule, value, callback) => {
							return this.$u.test.idCard(value)},
						message: '身份证件号不正确'}
				]
			},
			openId: '',
			residentId: ''
		}
	},
	onShow() {},
	onLoad(option) {
		// 获取openId
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
		if (option.residentId) {
			this.residentId = option.residentId
		}
	},
	onReady() {},
	methods: {
		// 选择身份证--国徽面
		chooseImageGH() {
			var _self = this
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: (res) => {
					uni.showLoading({
						title: '照片上传中...'
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
					}).then(resPonse => {
						if (resPonse.data.idcard_res.type === 1) {
							res.tempFilePaths.forEach(item => {
								FileApi.uploadFileByUni(item).then(resupload => {
									if (resupload[1].statusCode == 200) {
										_self.imgGHList = []
										var i = JSON.parse(resupload[1].data)
										_self.imgGHList.push({
											imgPath: item,
											fileId: i.data.fileId
										})
									}
								})
							})
							uni.hideLoading()
						} else {
							uni.showModal({
								title: '照片错误',
								content: '请您正确选择身份证——国徽面后进行上传！',
								showCancel: false,
								confirmText: '知道了'
							})
							uni.hideLoading()
						}
					}).catch(err => {
						uni.showModal({
							title: '照片错误',
							content: '请您正确选择身份证——国徽面后进行上传！',
							showCancel: false,
							confirmText: '知道了'
						})
						uni.hideLoading()
					})
				}
			});
		},
		// 删除身份证--国徽面
		delImgGH(e) {
			this.imgGHList.splice(e.currentTarget.dataset.index, 1)
		},
		// 选择身份证--姓名面
		chooseImageXX() {
			var _self = this
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: (res) => {
					uni.showLoading({
						title: '照片上传中...'
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
					}).then(resPonse => {
						if (resPonse.data.idcard_res.type === 0) {
							res.tempFilePaths.forEach(item => {
								FileApi.uploadFileByUni(item).then(resupload => {
									if (resupload[1].statusCode == 200) {
										_self.imgXXList = []
										var i = JSON.parse(resupload[1].data)
										_self.imgXXList.push({
											imgPath: item,
											fileId: i.data.fileId
										})
									}
								})
							})
							_self.userInfo.name = resPonse.data.idcard_res.name.text
							_self.userInfo.idCard = resPonse.data.idcard_res.id.text
							_self.userInfo.residenceAddress = resPonse.data.idcard_res.address.text
							uni.hideLoading()
						} else {
							uni.showModal({
								title: '照片错误',
								content: '请您正确选择身份证——人像面后进行上传！',
								showCancel: false,
								confirmText: '知道了'
							})
							uni.hideLoading()
						}
					}).catch(err => {
						uni.showModal({
							title: '照片错误',
							content: '请您正确选择身份证——人像面后进行上传！',
							showCancel: false,
							confirmText: '知道了'
						})
						uni.hideLoading()
					})
				}
			});
		},
		// 删除身份证--姓名面
		delImgXX(e) {
			this.imgXXList.splice(e.currentTarget.dataset.index, 1)
		},
		// 选择免冠照
		chooseImageMGZ() {
			var _self = this
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: (res) => {
					uni.showLoading({
						title: '照片上传中...'
					})
					res.tempFilePaths.forEach(item => {
						FileApi.uploadFileByUni(item).then(resupload => {
							if (resupload[1].statusCode == 200) {
								_self.imgMGZList = []
								var i = JSON.parse(resupload[1].data)
								_self.imgMGZList.push({
									imgPath: item,
									fileId: i.data.fileId
								})
							}
						})
						uni.hideLoading()
					})
				}
			});
		},
		// 删除免冠照
		delImgMGZ(e) {
			this.imgMGZList.splice(e.currentTarget.dataset.index, 1)
		},
		// 认证
		saveData() {
			var _this = this
			this.$refs.certificationFormData.setRules(_this.rules);
			this.$refs.certificationFormData.validate(valid => {
				if (_this.imgGHList.length === 0) {
					uni.showToast({
						title: '请上传身份证国徽面！',
						icon: 'none'
					})
				} else if (_this.imgXXList.length === 0) {
					uni.showToast({
						title: '请上传身份证人像面！',
						icon: 'none'
					})
				} else if (_this.imgMGZList.length === 0) {
					uni.showToast({
						title: '请上传免冠照片！',
						icon: 'none'
					})
				} else if (valid) {
					for (let i = 0; i < _this.imgGHList.length; i++) {
						_this.userInfo.idcardFileBack = _this.imgGHList[0].fileId
					}
					for (let i = 0; i < _this.imgXXList.length; i++) {
						_this.userInfo.idcardFileFront = _this.imgXXList[0].fileId
					}
					for (let i = 0; i < _this.imgMGZList.length; i++) {
						_this.userInfo.photoFile = _this.imgMGZList[0].fileId
					}
					// 出生日期
					_this.userInfo.birthday = _this.userInfo.idCard.substring(6, 10) + '-' + _this.userInfo.idCard.substring(10, 12) +
					  '-' + _this.userInfo.idCard.substring(12, 14)
					// 性别
					if (parseInt(_this.userInfo.idCard.substr(16, 1)) % 2 === 1) {
						_this.userInfo.genderId = '1'
					} else {
						_this.userInfo.genderId = '2'
					}
					_this.userInfo.residentId = _this.residentId
					let openId = uni.getStorageSync('openId')
					_this.userInfo.openId = openId
					wx.startFacialRecognitionVerify({
						name: _this.userInfo.name,
						idCardNumber: _this.userInfo.idCard,
						success: (res) => {
							uni.showToast({
								title: '人联识别成功！'
							})
							DigitalCertificates.wechatCertify(_this.userInfo).then(response => {
								if (response.data.code == 0) {
									uni.showToast({
										title: '认证成功',
										icon: 'none'
									})
									// uni.$emit('refreshData');
									uni.navigateBack({
										delta: 1
									})
									// uni.navigateTo({
									// 	url: './index'
									// })
								} else {
									uni.showToast({
										title: '认证失败: 请检查后重试',
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})
						},
						fail(res) {
							uni.showToast({
								title: '人脸识别失败，请检查后重试！'
							})
							_this.buttonLoading = false
						}
					});
				} else {
					console.log('验证失败');
					_this.buttonLoading = false
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.login-phone {
		background-color: #1261d4;
		color: #FFFFFF;
	}
	.user-body {
		background-color: #1261d4;
		padding: 10upx 15upx;
		min-height: 100vh;
	}
	.note-show {
		color: #E54D42;
	}
	.upload-media {
		border: 2upx dashed #ececec;
		width: 100%;
		margin-left: 1%;
		align-items: center;
		justify-items: flex-start;
	}
	.uploadIcon-gh {
		background: url(../staticrz/img/idCardGH.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		text-align: center;
		width: 100%;
		height: 180upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.uploadIcon-xx {
		background: url(../staticrz/img/idCardXX.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		text-align: center;
		width: 100%;
		height: 180upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.upload-image {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		flex: 1;
		padding: 10upx;
		.item {
			width: 100%;
			height: 180upx;
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
		right: -140upx;
		top: -140upx;
		color: #FFFFFF;
		z-index: 999;
		border-radius: 50px;
	}
	.upload-media-user {
		border: 2upx dashed #ececec;
		width: 38%;
		margin-left: 31%;
		align-items: center;
		justify-items: flex-start;
	}
	.uploadIcon-user {
		background: url(../staticrz/img/mgz.png);
		background-size: 70% 90%;
		background-repeat: no-repeat;
		background-position: center;
		text-align: center;
		width: 100%;
		height: 240upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.upload-image-user {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		flex: 1;
		padding: 10upx;
		.item {
			width: 100%;
			height: 240upx;
		}
		image {
			border: #F1F1F1 1upx solid;
			width: 100%;
			height: 100%;
		}
	}
	.icon-delete-user {
		width: 30upx;
		height: 30upx;
		position: relative;
		right: -105upx;
		top: -190upx;
		color: #FFFFFF;
		z-index: 999;
		border-radius: 50px;
	}
	.text-head{
	  text-align-last: justify;
	  font-weight: 800;
	}
</style>
