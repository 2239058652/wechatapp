<template>
	<!-- 交办信息 -->
	<view class="form">
		<u-form :model="dataTempJB" ref="uFormJB" label-width="120" :error-type="errorType" label-position="top">
			<u-form-item label="主办机构:" :required="true" prop="sponsorOrgName">
				<u-input type="select" :border="true" v-model="dataTempJB.sponsorOrgName"
					placeholder="请选择主办机构" @click="gotoSelectOrgMain()"></u-input>
			</u-form-item>
			<u-form-item label="协办机构:" prop="coOrganizerName">
				<u-input :border="true" v-model="dataTempJB.coOrganizerName"
				placeholder="请选择协办机构" type="textarea"
				height="100" @click="gotoSelectOrgVice()" />
			</u-form-item>
			<u-form-item label="办理要求:" :required="true"  prop="demand">
				<u-input v-model="dataTempJB.demand" type="textarea" height="100" :border="true" placeholder="请填写办理要求" />
			</u-form-item>
			<u-form-item label="办理时限" :required="true"  prop="deadlineDate">
				<u-input type="select" :select-open="limitshow"
					v-model="dataTempJB.deadlineDate" :border="true"
				 @click="limitshow = true" />
				<u-calendar v-model="limitshow" mode="date" max-date="2030-01-01" :min-date="nowDate" @change="limitSelectConfirm"></u-calendar>
			</u-form-item>
		</u-form>
		<view style="margin-top: 10vh;">
			<u-button type="primary" @click="handleAssigned()" :loading="buttonLoading">纠纷流转</u-button>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	
	export default {
		components: {},
		data() {
			return {
				buttonLoading: false,
				dataTempJB: {
					sponsorOrgName: '',
					sponsorOrgId: [],
					coOrganizerName: '',
					coOrganizerIdList: [],
					deadlineDate: '',
					demand: '',
					registrationId: ''
				},
				errorType: ['toast', 'border'],
				limitshow: false,
				limitParams: {
					year: true,
					month: true,
					day: true
				},
				registId: '',
				nowDate: '',
				rulesJB: {
					sponsorOrgName: [{ required: true, message: '请选择主办机构', trigger: 'change' }],
					demand: [{ required: true, message: '请填写办理要求', trigger: 'change' }],
					deadlineDate: [{ required: true, message: '请选择办理时限', trigger: 'change' }]
				}
			}
		},
		watch: {},
		onLoad(option) {
			if (option.registId) {
				this.registId = option.registId
			}
			this.nowDate = new moment().format('YYYY-MM-DD')
		},
		onShow() {
			uni.$on('selectedMainOrg', (org) => {
				this.dataTempJB.sponsorOrgName = org[0].name
				this.dataTempJB.sponsorOrgId = org[0].id
			})
			uni.$on('selectedOrgVice', (org) => {
				this.setSelectedOrgVice(org)
			})
		},
		methods: {
			// 选择主办机构
			gotoSelectOrgMain(type) {
				uni.navigateTo({
					url: '../selectOrg/selectMainOrg?type=' + type + '&sponsorOrgId=' + this.dataTempJB.sponsorOrgId
				})
			},
			// 选择协办机构
			gotoSelectOrgVice(type) {
				uni.navigateTo({
					url: '../selectOrg/selectViceOrg?type=' + type + '&sponsorOrgId=' + this.dataTempJB.sponsorOrgId + '&coOrganizerIdList=' + this.dataTempJB.coOrganizerIdList
				})
			},
			// 协办机构选择回传处理
			setSelectedOrgVice(val) {
				if (val.length > 0) {
					this.dataTempJB.coOrganizerName = ''
					this.dataTempJB.coOrganizerIdList = []
					for (let i = 0, length = val.length; i < length; i++) {
						this.dataTempJB.coOrganizerName += val[i].name + '、'
					}
					val.forEach(element => {
						this.dataTempJB.coOrganizerIdList.push(element.id)
					})
				}
			},
			// 时间选择
			limitSelectConfirm(e) {
				this.dataTempJB.deadlineDate = e.result
			},
			// 纠纷交办
			handleAssigned() {
				var _this = this
				this.$refs.uFormJB.setRules(_this.rulesJB);
				this.$refs.uFormJB.validate(valid => {
					if (valid) {
						_this.dataTempJB.registrationId = _this.registId
						DisputesResolvePlatform.transferMediateDeal(_this.dataTempJB).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '纠纷流转成功！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/main/main'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '纠纷流转失败: 请检查后重试',
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
</style>
