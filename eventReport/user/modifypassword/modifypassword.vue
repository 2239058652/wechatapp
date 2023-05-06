<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item label="原密码" :required="true" prop="oldPassword">
					<u-input v-model="dataTemp.oldPassword" type="password" :border="true" placeholder="请输入原密码" />
				</u-form-item>
				<u-form-item label="新密码" :required="true" prop="newPassword">
					<u-input v-model="dataTemp.newPassword" type="password" :border="true" placeholder="请输入新密码" />
				</u-form-item>
				<u-form-item label="新密码" prop="newPassword2">
					<u-input v-model="dataTemp.newPassword2" type="password" :border="true" placeholder="请再次输入新密码" />
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">确认修改</u-button>
		</view>
	</view>
</template>

<script>
	import UserApi from '../../../api/user.js'
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
					newPassword: '',
					oldPassword: '',
					newPassword2: '',
				},
				rules: {
					oldPassword: [{
						required: true,
						message: '请输入原来的密码',
						trigger: ['change', 'blur'],
					}, ],
					newPassword: [{
							required: true,
							message: '请输入新的密码',
							trigger: 'change'
						},
						{
							min: 8,
							message: '密码不能少于8位',
							trigger: 'change'
						},
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '只能包含字母或数字'
						},
					],
					newPassword2: [{
							required: true,
							message: '请再次输入新的密码',
							trigger: 'change'
						},
						{
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return (this.dataTemp.newPassword == value)
								// return this.$u.test.mobile(value);
							},
							message: '两次输入的密码不一致',
							// 触发器可以同时用blur和change
							trigger: ['blur'],
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
				id: '',
				account: ''
			}
		},
		onLoad() {
			this.account = uni.getStorageSync('account');
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 保存数据
			saveData() {
				var _this = this
				// console.log(this.dataTemp)
				this.$refs.uForm.validate(valid => {
					if (valid) {
						_this.buttonLoading = true
						// 修改
						let data = {
							newPassword: this.dataTemp.newPassword,
							oldPassword: this.dataTemp.oldPassword,
							account: this.account
						}
						UserApi.modifyUserPasswordByAccount(data).then(res => {
							console.log('修改结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '修改成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									});
								}, 1500)
							} else {
								uni.showToast({
									title: '修改失败:' + res.data.desc,
									icon: 'none'
								})
								_this.buttonLoading = false
							}
						})
					} else {
						_this.buttonLoading = false
					}
				});
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
