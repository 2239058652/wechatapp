<template>
	<view class="padding">
		<u-form :model="dataTempHFJL" ref="uFormHFJL" label-width="120" :error-type="errorType" label-position="top">
			<u-form-item label="回访日期" :required="true" prop="reviewDate">
				<u-input type="select" :select-open="reviewDateShow"
					v-model="dataTempHFJL.reviewDate" :border="true"
				 @click="reviewDateShow = true" />
				<u-calendar v-model="reviewDateShow" mode="date" @change="reviewDateConfirm"></u-calendar>
			</u-form-item>
			<u-form-item label="回访人:" :required="true" prop="participant">
				<u-input v-model="dataTempHFJL.participant" :border="true"  />
			</u-form-item>
			<u-form-item label="回访事由:" :required="true" prop="reason">
				<u-input cursor-spacing="150" v-model="dataTempHFJL.reason" :border="true"  />
			</u-form-item>
			<u-form-item label="当事人:" :required="true" prop="parties">
				<u-input cursor-spacing="150" v-model="dataTempHFJL.parties" :border="true"  />
			</u-form-item>
			<u-form-item label="是否满意:" :required="true" label-position="top" prop="isSatisfactionDesc">
				<u-input type="select" :select-open="isSatisfactionSelectShow" :border="true"
					v-model="dataTempHFJL.isSatisfactionDesc"
				 @click="isSatisfactionSelectShow = true"></u-input>
				<u-select mode="single-column" value-name="id" label-name="text"
					:list="isSatisfactionList" v-model="isSatisfactionSelectShow"
				 @confirm="isSatisfactionSelectConfirm"></u-select>
			</u-form-item>
			<u-form-item label="协议履行情况:" :required="true" prop="performanceSituationName">
				<u-input type="select" :select-open="performanceSituationSelectShow" :border="true"
					v-model="dataTempHFJL.performanceSituationName" placeholder="请选择协议履行情况。"
				 @click="performanceSituationSelectShow = true"></u-input>
				<u-select mode="single-column" value-name="innerId" label-name="text"
					:list="performanceSituationList" v-model="performanceSituationSelectShow"
				 @confirm="performanceSituationSelectConfirm"></u-select>
			</u-form-item>
			<u-form-item label="回访情况说明:" :required="true" prop="reviewSituation">
				<u-input cursor-spacing="150" v-model="dataTempHFJL.reviewSituation" :border="true"  />
			</u-form-item>
		</u-form>
		<u-button type="primary" @click="handleAddHfjl()" :loading="buttonLoading">添加调解记录</u-button>
	</view>
</template>

<script>
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	
	export default {
		components: {},
		data() {
			return {
				buttonLoading: false,
				dataTempHFJL: {
					isSatisfaction: '',
					isSatisfactionDesc: '',
					participant: '',
					parties: '',
					performanceSituation: '',
					performanceSituationName: '',
					reason: '',
					reviewDate: '',
					reviewSituation: '',
				},
				reviewDateShow: false,
				errorType: ['toast', 'border'],
				isSatisfactionSelectShow: false,
				isSatisfactionList: [
					{id: 0, text: '满意'},
					{id: 1, text: '不满意'}
				],
				registId: '',
				rulesHFJL: {
					reviewDate: [{ required: true, message: '请选择回访日期', trigger: 'change' }],
					participant: [{ required: true, message: '请填写回访人', trigger: 'change' }],
					reason: [{ required: true, message: '请填写回访事由', trigger: 'change' }],
					parties: [{ required: true, message: '请填写当事人', trigger: 'change' }],
					isSatisfactionDesc: [{ required: true, message: '请选择当事人对调解是否满意', trigger: 'change' }],
					performanceSituationName: [{ required: true, message: '请选择协议履行情况', trigger: 'change' }],
					reviewSituation: [{ required: true, message: '请填写回访情况说明', trigger: 'change' }]
				},
				performanceSituationSelectShow: false,
				performanceSituationList: [
					{innerId: '01', text: '协议已履行'},
					{innerId: '02', text: '申请司法确认'},
					{innerId: '03', text: '达成协议后反悔'},
					{innerId: '04', text: '其他'}
				]
			}
		},
		watch: {},
		onLoad(option) {
			if (option.registId) {
				this.registId = option.registId
			}
		},
		onShow() {},
		methods: {
			reviewDateConfirm(e) {
				this.dataTempHFJL.reviewDate = e.result
			},
			isSatisfactionSelectConfirm(e) {
				var _self = this
				e.map((val, index) => {
					_self.dataTempHFJL.isSatisfaction = val.value
					_self.dataTempHFJL.isSatisfactionDesc = val.label
				})
			},
			performanceSituationSelectConfirm(e) {
				var _self = this
				e.map((val, index) => {
					_self.dataTempHFJL.performanceSituation = val.value
					_self.dataTempHFJL.performanceSituationName = val.label
				})
			},
			handleAddHfjl() {
				var _this = this
				this.$refs.uFormHFJL.setRules(_this.rulesHFJL);
				this.$refs.uFormHFJL.validate(valid => {
					if (valid) {
						_this.dataTempHFJL.registrationId = _this.registId
						DisputesResolvePlatform.addReviewRecord({
							isSatisfaction: _this.dataTempHFJL.isSatisfaction,
							participant: _this.dataTempHFJL.participant,
							parties: _this.dataTempHFJL.parties,
							performanceSituation: _this.dataTempHFJL.performanceSituation,
							reason: _this.dataTempHFJL.reason,
							registrationId: _this.dataTempHFJL.registrationId,
							reviewDate: _this.dataTempHFJL.reviewDate,
							reviewSituation: _this.dataTempHFJL.reviewSituation
						}).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '添加纠纷调解回访记录成功！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '添加回访记录失败: 请检查后重试',
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
	.show-head-title {
		border-bottom: 1px #ececec solid;
		height: 70rpx;
		width: 100%;
		display: flex;
		.titleLeft {
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			text-align: left;
			font-weight: bold;
			display: flex;
		}
	}
	.show-body {
		min-height: 100rpx;
		.bodyTop {
			margin-top: 2%;
			margin-left: 2%;
			line-height: 40rpx;
			text-align: left;
			font-weight: bold;
			word-wrap:break-word;  
			word-break:break-all;
			.content-show {
				text-indent:2em;
			}
		}
	}
	.parties-body {
		padding: 0rpx 20rpx 0rpx 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 1px #ececec solid;
		color: #1CBBB4;
	}
	.partiesShow-head {
		font-size: 1rem;
		text-align: center;
		height: 4vh;
		line-height: 4vh;
	}
	.partiesShow-form {
		padding: 0px 20px 0px 20px;
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
