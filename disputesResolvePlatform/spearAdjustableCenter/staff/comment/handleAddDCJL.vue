<template>
	<view class="padding">
		<u-form :model="dataTempDCJL" ref="uFormDCJL" label-width="120" :error-type="errorType" label-position="top">
			<u-form-item label="调查日期" :required="true" prop="surveyDate">
				<u-input type="select" :select-open="surveyDateShow"
					v-model="dataTempDCJL.surveyDate" :border="true"
				 @click="surveyDateShow = true" />
				<u-calendar v-model="surveyDateShow" mode="date" @change="surveyDateConfirm"></u-calendar>
			</u-form-item>
			<u-form-item label="调查地点:" :required="true" prop="surveyAdd">
				<u-input v-model="dataTempDCJL.surveyAdd" :border="true" />
			</u-form-item>
			<u-form-item label="记录人:" :required="true" prop="recorder">
				<u-input cursor-spacing="150" v-model="dataTempDCJL.recorder" :border="true" />
			</u-form-item>
			<u-form-item label="参与人:" :required="true" prop="participant">
				<u-input cursor-spacing="150" v-model="dataTempDCJL.participant" :border="true" />
			</u-form-item>
			<u-form-item label="被调查人:" :required="true" prop="respondent">
				<u-input cursor-spacing="150" v-model="dataTempDCJL.respondent" :border="true" />
			</u-form-item>
			<u-form-item label="调查记录:" :required="true" prop="recordContent">
				<u-input cursor-spacing="150" v-model="dataTempDCJL.recordContent" :border="true"  />
			</u-form-item>
			<u-form-item label="案情分析:" :required="true" prop="prediction">
				<u-input cursor-spacing="150" v-model="dataTempDCJL.prediction" :border="true"  />
			</u-form-item>
		</u-form>
		<u-button type="primary" @click="handleAddDcjl()" :loading="buttonLoading">添加调查记录</u-button>
	</view>
</template>

<script>
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	
	export default {
		components: {},
		data() {
			return {
				buttonLoading: false,
				dataTempDCJL: {
					participant: '',
					prediction: '',
					recordContent: '',
					recorder: '',
					respondent: '',
					surveyAdd: '',
					surveyDate: '',
				},
				registId: '',
				errorType: ['toast', 'border'],
				surveyDateShow: false,
				rulesDCJL: {
					surveyDate: [{ required: true, message: '请选择调查日期', trigger: 'change' }],
					surveyAdd: [{ required: true, message: '请填写调查地点', trigger: 'change' }],
					recorder: [{ required: true, message: '请填写调查记录人', trigger: 'change' }],
					participant: [{ required: true, message: '请填写调查参与人', trigger: 'change' }],
					respondent: [{ required: true, message: '请填写被调查人', trigger: 'change' }],
					recordContent: [{ required: true, message: '请填写调查记录内容', trigger: 'change' }],
					prediction: [{ required: true, message: '请填写案情分析', trigger: 'change' }]
				}
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
			// 调查时间
			surveyDateConfirm(e) {
				this.dataTempDCJL.surveyDate = e.result
			},
			handleAddDcjl() {
				var _this = this
				this.$refs.uFormDCJL.setRules(_this.rulesDCJL);
				this.$refs.uFormDCJL.validate(valid => {
					if (valid) {
						_this.dataTempDCJL.registrationId = _this.registId
						DisputesResolvePlatform.addSurveyRecord(_this.dataTempDCJL).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '添加纠纷调解调查记录成功！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '添加调查记录失败: 请检查后重试',
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
</style>
