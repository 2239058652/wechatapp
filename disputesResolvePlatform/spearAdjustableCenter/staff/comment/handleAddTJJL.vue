<template>
	<view class="padding">
		<u-form :model="dataTempTJJL" ref="uFormTJJL" label-width="120" :error-type="errorType" label-position="top">
			<u-form-item label="调解日期" :required="true" prop="mediateDate">
				<u-input type="select" :select-open="mediateDateShow"
					v-model="dataTempTJJL.mediateDate" :border="true"
				 @click="mediateDateShow = true" />
				<u-calendar v-model="mediateDateShow" mode="date" @change="mediateDateConfirm"></u-calendar>
			</u-form-item>
			<u-form-item label="调解地点:" :required="true" prop="add">
				<u-input v-model="dataTempTJJL.add" :border="true"  />
			</u-form-item>
			<u-form-item label="记录人:" :required="true" prop="recorder">
				<u-input cursor-spacing="150" v-model="dataTempTJJL.recorder" :border="true"  />
			</u-form-item>
			<u-form-item label="参与人:" :required="true" prop="participant">
				<u-input cursor-spacing="150" v-model="dataTempTJJL.participant" :border="true"  />
			</u-form-item>
			<u-form-item label="申请人:" :required="true" prop="parties">
				<u-input cursor-spacing="150" v-model="dataTempTJJL.parties" :border="true"  />
			</u-form-item>
			<u-form-item label="被申请人:" :required="true" prop="partiesRespondent">
				<u-input cursor-spacing="150" v-model="dataTempTJJL.partiesRespondent" :border="true"  />
			</u-form-item>
			<u-form-item label="调解记录:" :required="true" prop="recordContent">
				<u-input cursor-spacing="150" v-model="dataTempTJJL.recordContent" :border="true"  />
			</u-form-item>
			<u-form-item label="本次调解结果:" :required="true" prop="result">
				<u-input cursor-spacing="150" v-model="dataTempTJJL.result" :border="true"  />
			</u-form-item>
			<!-- <u-form-item label="本次调解结果:" :required="true" prop="resultName">
				<u-input type="select" :select-open="resultSelectShow" :border="true"
					v-model="dataTempTJJL.resultName" placeholder="请选择履行方式。"
				 @click="resultSelectShow = true"></u-input>
				<u-select mode="single-column" value-name="innerId" label-name="text"
					:list="resultList" v-model="resultSelectShow"
				 @confirm="resultSelectConfirm"></u-select>
			</u-form-item> -->
		</u-form>
		<u-button type="primary" @click="handleAddTjjl()" :loading="buttonLoading">添加调解记录</u-button>
	</view>
</template>

<script>
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	
	export default {
		components: {},
		data() {
			return {
				buttonLoading: false,
				dataTempTJJL: {
					add: '',
					mediateDate: '',
					participant: '',
					parties: '',
					partiesRespondent: '',
					recordContent: '',
					recorder: '',
					result: ''
				},
				errorType: ['toast', 'border'],
				mediateDateShow: false,
				registId: '',
				rulesTJJL: {
					mediateDate: [{ required: true, message: '请选择调解日期', trigger: 'change' }],
					add: [{ required: true, message: '请填写调解地点', trigger: 'change' }],
					recorder: [{ required: true, message: '请填写调解记录人', trigger: 'change' }],
					participant: [{ required: true, message: '请填写调解参与人', trigger: 'change' }],
					parties: [{ required: true, message: '请填写申请人', trigger: 'change' }],
					partiesRespondent: [{ required: true, message: '请填写被申请人', trigger: 'change' }],
					recordContent: [{ required: true, message: '请填写调解记录内容', trigger: 'change' }],
					result: [{ required: true, message: '请填写本次调解结果', trigger: 'change' }]
				},
				resultSelectShow: false,
				resultList: [
					{innerId: '01', text: '民间纠纷转化为治安案件'},
					{innerId: '02', text: '民间纠纷转化为刑事案件'},
					{innerId: '03', text: '民间纠纷转化为民商事案件'}
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
			// 时间选择
			mediateDateConfirm(e) {
				this.dataTempTJJL.mediateDate = e.result
			},
			resultSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTempTJJL.resultName = val.label
					this.dataTempTJJL.result = val.value
				})
			},
			handleAddTjjl() {
				var _this = this
				this.$refs.uFormTJJL.setRules(_this.rulesTJJL);
				this.$refs.uFormTJJL.validate(valid => {
					if (valid) {
						_this.dataTempTJJL.registrationId = _this.registId
						const postData = {
							registrationId: _this.registId,
							add: _this.dataTempTJJL.add,
							mediateDate: _this.dataTempTJJL.mediateDate,
							participant: _this.dataTempTJJL.participant,
							parties: _this.dataTempTJJL.parties,
							partiesRespondent: _this.dataTempTJJL.partiesRespondent,
							recordContent: _this.dataTempTJJL.recordContent,
							recorder: _this.dataTempTJJL.recorder,
							result: _this.dataTempTJJL.result
						}
						DisputesResolvePlatform.addMediateRecord(postData).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '添加纠纷调解记录成功！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '添加调解记录失败: 请检查后重试',
									icon: 'none'
								})
								_this.buttonLoading = false
							}
						})
					} else {
						_this.buttonLoading = false
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
