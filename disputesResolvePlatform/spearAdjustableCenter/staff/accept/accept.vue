<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" :error-type="errorType">
				<u-form-item left-icon="bookmark" :left-icon-style="leftIconStyle"
					:required="true" label="案号:" label-position="top" prop="registNo">
					<u-input v-model="dataTemp.registNo" :border="true" placeholder="请填写纠纷案号。" disabled />
				</u-form-item>
				<u-form-item left-icon="tags" :left-icon-style="leftIconStyle" label="纠纷名称:"
					:required="true" label-position="top" prop="name">
					<u-input v-model="dataTemp.name" :border="true" placeholder="请填写纠纷名称。" />
				</u-form-item>
				<u-form-item left-icon="map" :left-icon-style="leftIconStyle" label="纠纷发生地:"
					:required="true" label-position="top" prop="happenRegionName">
					<u-input type="select" :select-open="regionShow" v-model="dataTemp.happenRegionName" :border="true" placeholder="请选择查获地点"
					 @click="regionShow = true" />
					<u-select
						v-model="regionShow"
						mode="mutil-column-auto"
						:list="tabbarList"
						label-name="shortName"
						value-name="regionCode"
						@confirm="regionConfirm"
					/>
				</u-form-item>
				<!-- <u-form-item left-icon="map" :left-icon-style="leftIconStyle" label="纠纷发生地"
					:required="true" label-position="top" prop="address">
					<u-input v-model="dataTemp.address" :border="true" placeholder="请填写纠纷发生地。" />
				</u-form-item> -->
				<u-form-item left-icon="account" :left-icon-style="leftIconStyle" label="联系人:"
					:required="true" label-position="top" prop="linkman">
					<u-input v-model="dataTemp.linkman" :border="true" />
				</u-form-item>
				<u-form-item left-icon="phone" :left-icon-style="leftIconStyle" label="联系电话:"
					:required="true" label-position="top" prop="mobile">
					<u-input type="number" maxlength="11" v-model="dataTemp.mobile" :border="true" />
				</u-form-item>
				<view class="u-flex u-row-between parties-head">
					<u-form-item left-icon="plus-people-fill" :left-icon-style="leftIconStyle" label="申请人:"
						:required="true" label-position="top" prop="briefContent" />
					<view>
						<u-button @click="addApplicant()" size="mini" type="info" class="add-button">添加</u-button>
					</view>
				</view>
				<view v-for="applicant in applicantList" :key="applicant.id">
					<view class="u-flex u-row-between parties-body">
						<view>{{ applicant.name }}</view>
						<view>{{ applicant.partiesTypeName }}</view>
						<view>{{ applicant.mobile }}</view>
						<view style="margin-right: 3%;"><u-icon name="minus-circle" size="45" color="#fa3534" @click="deleteApplicantDetail(applicant)" /></view>
					</view>
				</view>
				<view class="notIn-partiesType" v-if="applicantList.length == 0">—您还未添加申请人....—</view>
				<view class="u-flex u-row-between parties-head">
					<u-form-item left-icon="plus-people-fill" :left-icon-style="leftIconStyle" label="被申请人:"
						:required="true" label-position="top" prop="briefContent" />
					<view><u-button @click="addRespondent()" size="mini" type="info" class="add-button">添加</u-button></view>
				</view>
				<view v-for="respondent in respondentList" :key="respondent.id">
					<view class="u-flex u-row-between parties-body" style="color: #4AB0F6;">
						<view>{{ respondent.name }}</view>
						<view>{{ respondent.partiesTypeName }}</view>
						<view>{{ respondent.mobile }}</view>
						<view style="margin-right: 3%;"><u-icon name="minus-circle" size="45" color="#fa3534" @click="deleteRespondentDetail(respondent)" /></view>
					</view>
				</view>
				<view class="notIn-partiesType" v-if="respondentList.length == 0">—您还未添加被申请人....—</view>
				<u-form-item left-icon="tags" :left-icon-style="leftIconStyle" label="纠纷类型:"
					:required="true" label-position="top" prop="typeName">
					<u-input type="select" :select-open="typeSelectShow" :border="true"
						v-model="dataTemp.typeName"
					 @click="typeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="JFtypeList" v-model="typeSelectShow"
					 @confirm="typeSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item left-icon="list" :left-icon-style="leftIconStyle" label="纠纷级别:"
					:required="true" label-position="top" prop="levelName">
					<u-input type="select" :select-open="levelSelectShow" :border="true"
						v-model="dataTemp.levelName"
					 @click="levelSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="levelList" v-model="levelSelectShow"
					 @confirm="levelSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item left-icon="file-text-fill" :left-icon-style="leftIconStyle"
					:required="true" label="简要情况:" label-position="top" prop="briefContent">
					<u-input v-model="dataTemp.briefContent" type="textarea"
						height="150" :border="true"
						placeholder="请填写纠纷简要情况,为利于您申报的矛盾纠纷调解得到及时处理,请明确填写相关问题的时间、地点、事件过程。"
					/>
				</u-form-item>
				<u-form-item left-icon="order" :left-icon-style="leftIconStyle" label="诉求:"
					:required="true" label-position="top" prop="applyContent">
					<u-input v-model="dataTemp.applyContent" type="textarea"
						height="150" :border="true"
						placeholder="请填写纠纷诉求内容。"
					/>
				</u-form-item>
			</u-form>
		</view>
		<view style="margin-bottom: 20px;">
			<u-button type="primary" :custom-style="customStyle" @click="handleAccept()" :loading="buttonLoading">
				案件受理
			</u-button>
		</view>
	</view>
</template>

<script>
	import DispResoPlat from '@/api/disputesResolvePlatform.js'
	import DictionaryApi from '@/api/dictionary.js'
	import moment from 'moment'
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				customStyle: {
					// backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				leftIconStyle: { color: '#1261d4' },
				levelList: [
					{innerId: 0, text: '简单'},
					{innerId: 1, text: '一般'},
					{innerId: 2, text: '重大'},
					{innerId: 3, text: '疑难'}
				],
				JFtypeList: [],
				levelSelectShow: false,
				typeSelectShow: false,
				// 申请人当事人列表临时
				applicantList: [],
				// 被申请人当事人列表临时
				respondentList: [],
				partiesStatus: 0,
				dataTemp: {
					applicantIdList: [],
					applyContent: '',
					briefContent: '',
					files: [],
					level: '',
					levelName: '',
					openid: '',
					respondentIdList: [],
					type: '',
					typeName: '',
					linkman: '',
					mobile: '',
					name: '',
					address: '',
					registNo:'',
					happenRegionCode: '',
					happenRegionName: ''
				},
				rules: {
					registNo: [{ required: true, message: '请填写纠纷案号', trigger: 'change' }],
					name: [{ required: true, message: '请填写纠纷名称', trigger: 'change' }],
					happenRegionName: [{ required: true, message: '请选择纠纷发生地点', trigger: 'change' }],
					typeName: [{ required: true, message: '请选择纠纷类型', trigger: 'change' }],
					levelName: [{ required: true, message: '请选择纠纷级别', trigger: 'change' }],
					applyContent: [{ required: true, message: '请填写纠纷诉求内容', trigger: 'change' }],
					briefContent: [{ required: true, message: '请填写纠纷简要情况', trigger: 'change' }],
					mobile: [
						{ required: true, message: '请填写申报人联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					],
					linkman: [{ required: true, message: '请填写申报人姓名', trigger: 'change' }]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				registId: '',
				regionShow: false,
				tabbarList: []
			}
		},
		onShow() {},
		onLoad(option) {
			if (option.id) {
				this.registId = option.id
			}
			this.fetchDir()
			this.fetchDetail()
			uni.$on('addApplicant', (peopleList) => {
				this.dealApplicant(peopleList)
			})
			uni.$on('addRespondent', (respondentPeopleList) => {
				this.dealRespondent(respondentPeopleList)
			})
			this.fetchLoad()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onUnload() {
		    // 移除监听事件  
		    uni.$off('addApplicant')
		    uni.$off('addRespondent')
		},
		methods: {
			deleteChildren(arr) {
				let childs = arr
				for (let i = childs.length; i--; i > 0) {
					if (childs[i].children) {
						if (childs[i].children.length) {
							this.deleteChildren(childs[i].children)
						} else {
							delete childs[i].children
						}
					}
				}
				return arr
			},
			fetchLoad() {
				var _this = this
				DispResoPlat.getMediateRegionCode().then(res => {
					var listStep = res.data.data.children
					_this.tabbarList = _this.deleteChildren(listStep)
				})
			},
			regionConfirm(e) {
				this.dataTemp.happenRegionName = e[0].label + e[1].label + e[2].label
				this.dataTemp.happenRegionCode = e[2].value
			},
			// 获取信息
			fetchDetail() {
				var _this = this
				DisputesResolvePlatform.viewMediateRegistDetail(_this.registId).then(res => {
					_this.dataTemp = Object.assign({}, res.data.data)
					if (_this.dataTemp.levelDesc != null) {
						_this.dataTemp.levelName = _this.dataTemp.levelDesc
					}
					if (_this.dataTemp.type != null) {
						_this.dataTemp.typeName = _this.dataTemp.type.text
						_this.dataTemp.type = _this.dataTemp.type.innerId
					}
					_this.dataTemp.applicantPartiesList.forEach(element => {
						if (element.partiesPeople != null) {
							element.partiesType = 1,
							element.partiesTypeName = '自然人'
							_this.applicantList.push(element)
						} else if (element.partiesOrg != null) {
							if (element.partiesOrg.certificateType == '2') {
								_this.applicantList.push({
									id: element.id,
									partiesType: 2,
									partiesTypeName: '法人',
									certificateCode: element.partiesOrg.certificateCode,
									certificateType: element.partiesOrg.certificateType,
									mobile: element.mobile,
									name: element.name,
									responsiblePerson: element.partiesOrg.responsiblePerson,
									address: element.address
								})
							}
							if (element.partiesOrg.certificateType == '3') {
								_this.applicantList.push({
									id: element.id,
									partiesType: 3,
									partiesTypeName: '非法人单位',
									certificateCode: element.partiesOrg.certificateCode,
									certificateType: element.partiesOrg.certificateType,
									mobile: element.mobile,
									name: element.name,
									responsiblePerson: element.partiesOrg.responsiblePerson,
									address: element.address
								})
							}
						}
					})
					_this.dataTemp.respondentPartiesList.forEach(element => {
						if (element.partiesPeople != null) {
							element.partiesType = 1
							element.partiesTypeName = '自然人'
							_this.respondentList.push(element)
						} else if (element.partiesOrg != null) {
							if (element.partiesOrg.certificateType == '2') {
								_this.respondentList.push({
									id: element.id,
									partiesType: 1,
									partiesTypeName: '法人',
									certificateCode: element.partiesOrg.certificateCode,
									certificateType: element.partiesOrg.certificateType,
									mobile: element.mobile,
									name: element.name,
									responsiblePerson: element.partiesOrg.responsiblePerson,
									address: element.address
								})
							}
							if (element.partiesOrg.certificateType == '3') {
								_this.respondentList.push({
									id: element.id,
									partiesType: 2,
									partiesTypeName: '非法人单位',
									certificateCode: element.partiesOrg.certificateCode,
									certificateType: element.partiesOrg.certificateType,
									mobile: element.mobile,
									name: element.name,
									responsiblePerson: element.partiesOrg.responsiblePerson,
									address: element.address
								})
							}
						}
					})
					_this.status = _this.dataTemp.status
				})
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 纠纷类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'mediate_type'
				}).then(res => {
					this.$nextTick(function() {
						this.JFtypeList = res.data.data
					})
				})
			},
			// 纠纷类型
			typeSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.typeName = val.label
					this.dataTemp.type = val.value
				})
			},
			// 纠纷级别选择
			levelSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.levelName = val.label
					this.dataTemp.level = val.value
				})
			},
			addApplicant() {
				uni.navigateTo({
					url: '../../addPeople/addApplicant'
				})
			},
			// 处理申请人添加
			dealApplicant(peopleList) {
				var _this = this
				peopleList.forEach(element => {
					_this.applicantList.push(element)
				})
			},
			// 删除申请人当事人信息
			deleteApplicantDetail(applicant, list) {
				var _this = this
				for (var key in _this.applicantList) {
				    if (_this.applicantList[key].id === applicant.id) {
				      _this.applicantList.splice(key, 1)
				    }
				}
			},
			// 跳转添加被申请人
			addRespondent() {
				uni.navigateTo({
					url: '../../addPeople/addRespondent'
				})
			},
			// 处理被申请人添加
			dealRespondent(respondentPeopleList) {
				var _this = this
				respondentPeopleList.forEach(element => {
					_this.respondentList.push(element)
				})
			},
			// 删除被申请人当事人信息
			deleteRespondentDetail(respondent, list) {
				var _this = this
				for (var key in _this.respondentList) {
				    if (_this.respondentList[key].id === respondent.id) {
				      _this.respondentList.splice(key, 1)
				    }
				}
			},
			// 案件受理
			handleAccept() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				if (_this.applicantList.length <= 0) {
					uni.showToast({
						title: '请添加申请人',
						icon: 'none'
					})
				} else {
					_this.dataTemp.applicantIdList = []
					_this.dataTemp.respondentIdList = []
					_this.respondentList.forEach(element => {
						_this.dataTemp.respondentIdList.push(element.id)
					})
					_this.applicantList.forEach(item => {
						_this.dataTemp.applicantIdList.push(item.id)
					})
					this.$refs.uForm.validate(valid => {
						if (valid) {
							_this.buttonLoading = true
							_this.dataTemp.registrationId = _this.registId
							var oldFile = []
							oldFile = _this.dataTemp.files
							_this.dataTemp.files = []
							oldFile.forEach(element => {
								_this.dataTemp.files.push(element.id)
							})
							_this.dataTemp.address = _this.dataTemp.happenRegionName
							DispResoPlat.acceptMediateDeal(_this.dataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '受理成功！',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/pages/main/main'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '受理失败: 请检查后重试',
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
	}
</script>

<style lang="scss" scoped>
	.notIn-partiesType {
		color: #AAAAAA;
		text-align: center;
		font-size: small;
	}
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
</style>
