<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item label="姓名:" :required="true" prop="name">
					<view style="width: 100%;display: flex;">
						<view style="width: 85%;">
							<u-input v-model="dataTemp.name" type="text" :border="true" placeholder="您的姓名" />
						</view>
						<view style="width: 15%;height: 80rpx;line-height: 80rpx;text-align: center;" @click="addIdCard()">
							<u-icon name="camera" color="#2979ff" size="50" />
						</view>
					</view>
				</u-form-item>
				<u-form-item label="身份证号:" :required="true" prop="idCard">
					<view style="width: 100%;display: flex;">
						<view style="width: 85%;">
							<u-input v-model="dataTemp.idCard" type="text" :border="true" placeholder="您的身份证件号" />
						</view>
						<view style="width: 15%;height: 80rpx;line-height: 80rpx;text-align: center;" @click="addIdCard()">
							<u-icon @click="addIdCard()" name="camera" color="#2979ff" size="50" />
						</view>
					</view>
				</u-form-item>
				<u-form-item label="性别" prop="gender">
					<u-input type="select" :select-open="genderSelectShow" :border="true" v-model="dataTemp.gender" placeholder="请选择性别"
					 @click="genderSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="genderList" v-model="genderSelectShow"
					 @confirm="genderSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="出生年月" prop="birthday">
					<u-input type="select" :select-open="birthdaySelectshow" :border="true" v-model="dataTemp.birthday" placeholder="请选择出生年月"
					 @click="birthdaySelectshow = true"></u-input>
					<u-picker v-model="birthdaySelectshow" mode="time" @confirm="birthdaySelectConfirm"></u-picker>
				</u-form-item>
				<u-form-item label="民族" prop="nation">
					<u-input type="select" :select-open="nationSelectShow" :border="true" v-model="dataTemp.nation" placeholder="请选择民族"
					 @click="nationSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="nationList" v-model="nationSelectShow"
					 @confirm="nationSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="政治面貌" prop="politic">
					<u-input type="select" :select-open="politicSelectShow" :border="true" v-model="dataTemp.politic" placeholder="请选择政治面貌"
					 @click="politicSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="politicList" v-model="politicSelectShow"
					 @confirm="politicSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="学历" prop="education">
					<u-input type="select" :select-open="educationSelectShow" :border="true" v-model="dataTemp.education" placeholder="请选择学历"
					 @click="educationSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="educationList" v-model="educationSelectShow"
					 @confirm="educationSelectConfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">信息更新</u-button>
		</view>
	</view>
</template>

<script>
	import UserApi from '../../../api/user.js'
	import DictionaryApi from '../../../api/dictionary.js'
	export default {
		data() {
			return {
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '100rpx'
				},
				reportDateShow: false,
				dataTemp: {
					name: '',
					birthday: '',
					education: '',
					educationCode: '',
					gender: '',
					genderCode: '',
					nation: '',
					nationCode: '',
					politic: '',
					politicCode: ''
				},
				imgList: [],
				genderList: [],
				genderSelectShow: false,
				educationList: [],
				educationSelectShow: false,
				nationList: [],
				nationSelectShow: false,
				politicList: [],
				politicSelectShow: false,
				birthdaySelectshow: false,
				rules: {
					name: [{
							required: true,
							message: '请填写姓名',
							trigger: 'change'
						},
						{
							min: 2,
							message: '名字不能少于2个字',
							trigger: 'change'
						}
					],
					idCard: [{
							required: true,
							message: '请填写您的身份证号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.idCard(value);
							},
							message: '身份证件号不正确',
							trigger: ['change', 'blur'],
						}
					],
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				limitParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
				},
				startYear: '',
				account: ''
			}
		},
		onLoad() {
			this.account = uni.getStorageSync('account');
			if (this.account) {
				this.fetchDetail()
			}
			this.fetchDir()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...',
				})
				UserApi.getUserInfoByAccount(_this.account).then(res => {
					console.log('userinfo', res)
					this.dataTemp = Object.assign(this.dataTemp, res.data.data)
					uni.hideLoading()
				})
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 取性别
				DictionaryApi.getGender().then(res => {
					this.genderList = res.data.data
				})
				DictionaryApi.getEducation().then(res => {
					this.educationList = res.data.data
				})
				DictionaryApi.getPolitic().then(res => {
					this.politicList = res.data.data
				})
				DictionaryApi.getNation().then(res => {
					this.nationList = res.data.data
				})
			},
			//性别选择
			genderSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.gender = val.label
					this.dataTemp.genderCode = val.value
				})
			},
			// 民族选择
			nationSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.nation = val.label
					this.dataTemp.nationCode = val.value
				})
			},
			// 政治面貌
			politicSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.politic = val.label
					this.dataTemp.politicCode = val.value
				})
			},
			// 学历
			educationSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.education = val.label
					this.dataTemp.educationCode = val.value
				})
			},
			// 出生年月
			birthdaySelectConfirm(e) {
				this.dataTemp.birthday = e.year + '-' + e.month + '-' + e.day //+' 00:00:00'
			},
			dateSelectConfirm(e) {
				this.dataTemp.reporterDate = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00'
			},
			addIdCard() {
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
									_self.dataTemp.name = ''
									_self.dataTemp.idCard = ''
									_self.dataTemp.name = res.data.idcard_res.name.text
									_self.dataTemp.idCard = res.data.idcard_res.id.text
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
			saveData() {
				var _this = this
				_this.dataTemp.account = _this.account
				_this.dataTemp.birthday = _this.dataTemp.idCard.substring(6, 10) + '-' + _this.dataTemp.idCard.substring(10, 12) +
				  '-' + _this.dataTemp.idCard.substring(12, 14)
				 // 性别
			    if (parseInt(_this.dataTemp.idCard.substr(16, 1)) % 2 === 1) {
					_this.dataTemp.gender = '男'
					_this.dataTemp.genderCode = '1'
			    } else {
					_this.dataTemp.gender = '女'
					_this.dataTemp.genderCode = '2'
			    }
				_this.$refs.uForm.validate(valid => {
					if (valid) {
						_this.buttonLoading = true
						// 修改
						UserApi.modifyUserInfoByAccount(_this.dataTemp).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '用户信息更新成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									});
								}, 1500)
							} else {
								uni.showToast({
									title: '用户信息更新失败:' + res.data.desc,
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
		flex-wrap: wrap;
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
		width: 90%;
		margin: 0 auto;
	}
</style>
