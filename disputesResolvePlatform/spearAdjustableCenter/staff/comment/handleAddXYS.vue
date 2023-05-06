<template>
	<view class="padding">
		<u-form :model="dataTempXYS" ref="uFormXYS" label-width="120" :error-type="errorType" label-position="top">
			<u-form-item label="调解结果:" :required="true" label-position="top" prop="resultStatusDesc">
				<u-input type="select" :select-open="resultStatusSelectShow" :border="true"
					v-model="dataTempXYS.resultStatusDesc"
				 @click="resultStatusSelectShow = true"></u-input>
				<u-select mode="single-column" value-name="id" label-name="text"
					:list="resultStatusList" v-model="resultStatusSelectShow"
				 @confirm="resultStatusSelectConfirm"></u-select>
			</u-form-item>
			<u-form-item label="调解机构:" :required="true" prop="mediateOrg">
				<u-input v-model="dataTempXYS.mediateOrg" :border="true" />
			</u-form-item>
			<u-form-item label="调解人:" :required="true" prop="mediatePeople">
				<u-input v-model="dataTempXYS.mediatePeople" :border="true" />
			</u-form-item>
			<u-form-item label="记录人:" :required="true" prop="recorder">
				<u-input v-model="dataTempXYS.recorder" :border="true" />
			</u-form-item>
			<view v-if="dataTempXYS.resultStatus == 2">
				<u-form-item label="调解日期" :required="true" prop="mediateDate">
					<u-input type="select" :select-open="xysMediateDateShow"
						v-model="dataTempXYS.mediateDate" :border="true"
					 @click="xysMediateDateShow = true" />
					<u-calendar v-model="xysMediateDateShow" mode="date" @change="xysMediateDateConfirm"></u-calendar>
				</u-form-item>
			</view>
			<view v-if="dataTempXYS.resultStatus == 1">
				<u-form-item label="结案日期" :required="true" prop="finishDate">
					<u-input type="select" :select-open="finishDateShow"
						v-model="dataTempXYS.finishDate" :border="true"
					 @click="finishDateShow = true" />
					<u-calendar v-model="finishDateShow" mode="date" @change="finishDateConfirm"></u-calendar>
				</u-form-item>
				<u-form-item label="涉案金额(元):" :required="true" prop="amount">
					<u-input cursor-spacing="150" type="number" v-model="dataTempXYS.amount" :border="true" />
				</u-form-item>
				<u-form-item label="协议日期" :required="true" prop="agreemnetDate">
					<u-input type="select" :select-open="agreemnetDateShow"
						v-model="dataTempXYS.agreemnetDate" :border="true"
					 @click="agreemnetDateShow = true" />
					<u-calendar v-model="agreemnetDateShow" mode="date" @change="agreemnetDateConfirm"></u-calendar>
				</u-form-item>
				<u-form-item label="协议内容:" :required="true" prop="agreementContent">
					<u-input cursor-spacing="150" v-model="dataTempXYS.agreementContent" :border="true" />
				</u-form-item>
				<u-form-item label="履行时限" :required="true" prop="limitDate">
					<u-input type="select" :select-open="limitDateShow"
						v-model="dataTempXYS.limitDate" :border="true"
					 @click="limitDateShow = true" />
					<u-calendar v-model="limitDateShow" mode="date" max-date="2030-01-01" :min-date="nowDate" @change="limitDateConfirm"></u-calendar>
				</u-form-item>
				<u-form-item label="履行地点:" :required="true" prop="performAdd">
					<u-input cursor-spacing="150" v-model="dataTempXYS.performAdd" :border="true" />
				</u-form-item>
				<u-form-item label="履行方式:" :required="true" prop="performTypeName">
					<u-input type="select" :select-open="performTypeSelectShow" :border="true"
						v-model="dataTempXYS.performTypeName" placeholder="请选择履行方式。"
					 @click="performTypeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="performTypeList" v-model="performTypeSelectShow"
					 @confirm="performTypeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="纠纷转化情况:" :required="true" prop="transformSituationName">
					<u-input type="select" :select-open="transformSituationSelectShow" :border="true"
						v-model="dataTempXYS.transformSituationName" placeholder="请选择纠纷转化情况。"
					 @click="transformSituationSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="transformSituationList" v-model="transformSituationSelectShow"
					 @confirm="transformSituationSelectConfirm"></u-select>
				</u-form-item>
			</view>
		</u-form>
		<view style="margin-top: 2vh;">
			<u-button type="primary" @click="handleAddXYS()" :loading="buttonLoading">添加协议书</u-button>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import DictionaryApi from '@/api/dictionary.js'
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	
	export default {
		components: {},
		data() {
			return {
				resultStatusList: [
					{id: 1, text: '成功'},
					{id: 2, text: '失败'}
				],
				buttonLoading: false,
				agreemnetDateShow: false,
				dataTempXYS: {
					resultStatusDesc: '成功',
					resultStatus: '1',
					mediateDate: '',
					recorder: '',
					agreementContent: '',
					agreemnetDate: '',
					amount: '',
					finishDate: '',
					involveFarmerSituation: '',
					involveSpecialSituation: '',
					limitDate: '',
					performAdd: '',
					performType: '',
					performTypeName: '',
					transformSituation: '',
					mediateOrg: '',
					mediatePeople: ''
				},
				xysMediateDateShow: false,
				resultStatusSelectShow: false,
				surveyDateShow: false,
				errorType: ['toast', 'border'],
				limitshow: false,
				finishDateShow: false,
				limitDateShow: false,
				registId: '',
				limitParams: {
					year: true,
					month: true,
					day: true
				},
				rulesCG: {
					recorder: [{ required: true, message: '请填写记录人', trigger: 'change' }],
					finishDate: [{ required: true, message: '请选择结案日期', trigger: 'change' }],
					amount: [{ required: true, message: '请填写涉案金额', trigger: 'change' }],
					mediateOrg: [{ required: true, message: '请录入调解机构', trigger: 'change' }],
					mediatePeople: [{ required: true, message: '请录入调解人', trigger: 'change' }],
					agreemnetDate: [{ required: true, message: '请选择协议日期', trigger: 'change' }],
					agreementContent: [{ required: true, message: '请填写协议内容', trigger: 'change' }],
					limitDate: [{ required: true, message: '请选择履行时限', trigger: 'change' }],
					performAdd: [{ required: true, message: '请填写履行地点', trigger: 'change' }],
					performTypeName: [{ required: true, message: '请选择履行方式', trigger: 'change' }],
					transformSituationName: [{ required: true, message: '请选择纠纷转化情况', trigger: 'change' }]
				},
				rulesSB: {
					recorder: [{ required: true, message: '请填写记录人', trigger: 'change' }],
					mediateOrg: [{ required: true, message: '请录入调解机构', trigger: 'change' }],
					mediatePeople: [{ required: true, message: '请录入调解人', trigger: 'change' }],
					mediateDate: [{ required: true, message: '请选择调解日期', trigger: 'change' }]
				},
				nowDate: '',
				performTypeSelectShow: false,
				performTypeList: [],
				mediateResultSelectShow: false,
				mediateResultList: [],
				transformSituationSelectShow: false,
				transformSituationList: [
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
			this.nowDate = new moment().format('YYYY-MM-DD')
			this.fetchDir()
		},
		onShow() {},
		methods: {
			fetchDir() {
				var _this = this
				// 履行方式
				DictionaryApi.getDictionaries({
					dictSubjectId: 'mediate_result'
				}).then(res => {
					this.$nextTick(function() {
						this.performTypeList = res.data.data
					})
				})
			},
			// 协议书材料添加
			resultStatusSelectConfirm(e) {
				var _self = this
				e.map((val, index) => {
					_self.dataTempXYS.resultStatus = val.value
					_self.dataTempXYS.resultStatusDesc = val.label
					_self.dataTempXYS.mediateDate = ''
					_self.dataTempXYS.mediateResult = ''
					_self.dataTempXYS.recorder = ''
					_self.dataTempXYS.agreementContent = ''
					_self.dataTempXYS.agreemnetDate = ''
					_self.dataTempXYS.amount = ''
					_self.dataTempXYS.finishDate = ''
					_self.dataTempXYS.involveFarmerSituation = ''
					_self.dataTempXYS.involveSpecialSituation = ''
					_self.dataTempXYS.limitDate = ''
					_self.dataTempXYS.performAdd = ''
					_self.dataTempXYS.performType = ''
					_self.dataTempXYS.transformSituation = ''
				})
			},
			xysMediateDateConfirm(e) {
				this.dataTempXYS.mediateDate = e.result
			},
			agreemnetDateConfirm(e) {
				this.dataTempXYS.agreemnetDate = e.result
			},
			finishDateConfirm(e) {
				this.dataTempXYS.finishDate = e.result
			},
			limitDateConfirm(e) {
				this.dataTempXYS.limitDate = e.result
			},
			// 履行方式选择
			performTypeSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTempXYS.performTypeName = val.label
					this.dataTempXYS.performType = val.value
				})
			},
			// 纠纷转化情况
			transformSituationSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTempXYS.transformSituationName = val.label
					this.dataTempXYS.transformSituation = val.value
				})
			},
			handleAddXYS() {
				var _this = this
				_this.dataTempXYS.registrationId = _this.registId
				if (_this.dataTempXYS.resultStatus == 1) {
					this.$refs.uFormXYS.setRules(_this.rulesCG);
					this.$refs.uFormXYS.validate(valid => {
						if (valid) {
							DisputesResolvePlatform.addAgreementRecord(_this.dataTempXYS).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '添加纠纷调解协议书成功！',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/pages/main/main'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '添加调解协议书失败: 请检查后重试',
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})
						} else {
							_this.buttonLoading = false
						}
					})
				} else {
					this.$refs.uFormXYS.setRules(_this.rulesSB);
					this.$refs.uFormXYS.validate(valid => {
						if (valid) {
							DisputesResolvePlatform.addAgreementFailRecord(_this.dataTempXYS).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '添加调解协议书成功！',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/pages/main/main'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '添加调解协议书失败: 请检查后重试',
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
	}
</script>

<style lang="scss" scoped>
</style>
