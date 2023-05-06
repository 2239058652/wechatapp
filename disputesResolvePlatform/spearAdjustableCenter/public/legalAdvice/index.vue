<template>
	<view>
		<view class="index-head">
			<view class="title-text">法律服务咨询</view>
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的咨询" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" :error-type="errorType">
				<u-form-item left-icon="list" :left-icon-style="leftIconStyle" label="问题类型:"
					label-position="top" prop="questionType">
					<u-input type="select" :select-open="typeSelectShow" :border="true"
						v-model="dataTemp.questionType" placeholder="请选择类型"
					 @click="typeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="typeList" v-model="typeSelectShow"
					 @confirm="typeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item left-icon="file-text-fill" :left-icon-style="leftIconStyle" label="详细问题:"
					label-position="top" prop="question">
					<u-input v-model="dataTemp.question" type="textarea"
						height="200" :border="true"
						placeholder="请填写您需要咨询的法律服务问题详细情况。"
					/>
				</u-form-item>
				<u-form-item left-icon="account" :left-icon-style="leftIconStyle" label="咨询人:"
					label-position="top" prop="name">
					<u-input v-model="dataTemp.name" :border="true" placeholder="请填写您的姓名"/>
				</u-form-item>
				<u-form-item left-icon="phone" :left-icon-style="leftIconStyle" label="联系电话:"
					label-position="top" prop="mobile">
					<u-input type="number" v-model="dataTemp.mobile" autosize maxlength="11" :border="true"
						placeholder="请填写您的联系电话"/>
				</u-form-item>
			</u-form>
		</view>
		<view style="margin-bottom: 20px;">
			<u-button :custom-style="customStyle" @click="saveData()" :loading="buttonLoading">立即咨询</u-button>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import DictionaryApi from '@/api/dictionary.js'
	import LegalAdvice from '../../../../api/legalAdvice.js'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				leftIconStyle: { color: '#1261d4' },
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				typeSelectShow: false,
				typeList: [],
				dataTemp: {
					mobile: '',
					name: '',
					openId: '',
					question: '',
					questionType: '',
					type: ''
				},
				rules: {
					questionType: [{
						required: true,
						message: '请选择问题类型',
						trigger: ['change', 'blur'],
					}],
					name: [{
						required: true,
						message: '请填写咨询人姓名',
						trigger: ['change', 'blur'],
					}],
					question: [{
						required: true,
						message: '请填写详细问题说明',
						trigger: 'change'
					}],
					mobile: [
						{
							required: true,
							message: '请填写联系方式',
							trigger: 'change'
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false
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
			this.fetchDir()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			fetchDir() {
				var _this = this
				// 问题类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'advisory_type'
				}).then(res => {
					this.$nextTick(function() {
						this.typeList = res.data.data
					})
				})
			},
			typeSelectConfirm(e) {
				console.log('111111111111', e)
				e.map((val, index) => {
					this.dataTemp.questionType = val.label
					this.dataTemp.type = val.value
				})
			},
			// 跳转我的填报列表
			handleGoToList() {
				uni.navigateTo({
					url: '/disputesResolvePlatform/spearAdjustableCenter/public/legalAdvice/legalAdviceList'
				})
			},
			// 保存数据
			saveData() {
				var _this = this
				let openId = uni.getStorageSync('openId')
				_this.dataTemp.openId = openId
				this.$refs.uForm.validate(valid => {
					if (valid) {
						_this.buttonLoading = true
						LegalAdvice.saveMediateAdvisory(_this.dataTemp).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '问题咨询填报成功！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										url: '/disputesResolvePlatform/spearAdjustableCenter/public/legalAdvice/publicIndex'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '咨询填报失败: 请检查后重试',
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
	.index-head {
		background: url(../../../../eventReport/static/img/bianjingTY.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 220rpx;
		width: 92%;
		margin: 2% 4% 0 4%;
		border-radius: 10upx;
	}
	.title-text {
		text-align: center;
		height: 160rpx;
		line-height: 160rpx;
		font-size: 1.5rem;
		color: #FFFFFF;
	}
	.index-text {
		text-align: right;
		margin-right: 2%;
		color: #FFFFFF;
	}
	.form {
		padding: 20upx 40upx;
	}
</style>
