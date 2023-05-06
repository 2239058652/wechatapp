<template>
	<view>
		<view class="index-head">
			<view class="title-text">调解申报</view>
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的调解" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" :error-type="errorType">
				<u-form-item left-icon="account" :left-icon-style="leftIconStyle" label="联系人:"
					:required="true" label-position="top" prop="linkman">
					<u-input cursor-spacing="150" v-model="dataTemp.linkman" :border="true"
						placeholder="请填写纠纷申请联系人姓名。" />
				</u-form-item>
				<u-form-item left-icon="phone" :left-icon-style="leftIconStyle" label="联系电话:"
				:required="true" label-position="top" prop="mobile">
					<u-input cursor-spacing="150" type="number" maxlength="11"
						v-model="dataTemp.mobile" :border="true" placeholder="请填写纠纷申请联系人联系方式。"
					/>
				</u-form-item>
				<u-form-item left-icon="map" :left-icon-style="leftIconStyle" label="纠纷发生地:"
					:required="true" label-position="top" prop="happenRegionName">
					<u-input type="select" :select-open="regionShow" v-model="dataTemp.happenRegionName"
						:border="true" placeholder="请选择查获地点" @click="regionShow = true" />
					<u-select
						v-model="regionShow"
						mode="mutil-column-auto"
						:list="regionTree"
						label-name="shortName"
						value-name="regionCode"
						@confirm="regionConfirm"
					/>
				</u-form-item>
				<!-- 添加申请人 -->
				<view class="u-flex u-row-between parties-head">
					<u-form-item left-icon="plus-people-fill" :left-icon-style="leftIconStyle" label="申请人:"
						:required="true" label-position="top" prop="briefContent" />
					<view>
						<u-button @click="addApplicant()" size="medium" type="info" class="add-button">添加</u-button>
					</view>
				</view>
				<!-- 申请人信息 -->
				<view v-for="applicant in applicantList" :key="applicant.id">
					<view class="u-flex u-row-between parties-body">
						<view v-if="applicant.responsiblePerson == '' ">{{ applicant.name }}</view>
						<view v-if="applicant.responsiblePerson != '' ">{{ applicant.responsiblePerson }}</view>
						<view>{{ applicant.partiesTypeName }}</view>
						<view>{{ applicant.mobile }}</view>
						<view>
							<u-icon name="minus-circle" size="42" color="#fa3534"
								@click="deleteApplicantDetail(applicant)" />
						</view>
					</view>
				</view>
				<view class="notIn-partiesType" v-if="applicantList.length == 0">—您还未添加申请人....—</view>
				<!-- 添加被申请人 -->
				<view class="u-flex u-row-between parties-head">
					<u-form-item left-icon="plus-people-fill" :left-icon-style="leftIconStyle" label="被申请人:"
						:required="true" label-position="top" prop="briefContent" />
					<view>
						<u-button @click="addRespondent()" size="medium" type="info" class="add-button">
							添加
						</u-button>
					</view>
				</view>
				<!-- 被申请人信息 -->
				<view v-for="respondent in respondentList" :key="respondent.id">
					<view class="u-flex u-row-between parties-body" style="color: #4AB0F6;">
						<view v-if="respondent.responsiblePerson == '' ">{{ respondent.name }}</view>
						<view v-if="respondent.responsiblePerson != '' ">{{ respondent.responsiblePerson }}</view>
						<view>{{ respondent.partiesTypeName }}</view>
						<view>{{ respondent.mobile }}</view>
						<view>
							<u-icon name="minus-circle" size="42" color="#fa3534"
								@click="deleteRespondentDetail(respondent)" />
						</view>
					</view>
				</view>
				<view class="notIn-partiesType" v-if="respondentList.length == 0">—您还未添加被申请人....—</view>
				<u-form-item left-icon="file-text-fill" :left-icon-style="leftIconStyle" label="简要情况:"
					:required="true" label-position="top" prop="briefContent">
					<u-input v-model="dataTemp.briefContent" type="textarea"
						height="150" :border="true"
						placeholder="请填写纠纷简要情况,为利于您申报的矛盾纠纷调解得到及时处理,请明确填写相关问题的时间、地点、事件过程。"
					/>
				</u-form-item>
				<u-form-item left-icon="order" :left-icon-style="leftIconStyle" label="诉求:"
					:required="true" label-position="top" prop="applyContent">
					<u-input v-model="dataTemp.applyContent" :border="true" type="textarea" height="150"
						placeholder="请填写纠纷诉求内容。"
					/>
				</u-form-item>
			</u-form>
		</view>
		<view style="margin-bottom: 20px;">
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">立即申报</u-button>
		</view>
	</view>
</template>

<script>
	import DispResoPlat from '@/api/disputesResolvePlatform.js'
	import DictionaryApi from '@/api/dictionary.js'
	import moment from 'moment'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				// customStyle 按钮样式
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				leftIconStyle: { color: '#1261d4' },
				regionShow: false,
				// 行政区划树
				regionTree: [],
				// 申请人
				applicantList: [],
				// 被申请人
				respondentList: [],
				// 数据集
				dataTemp: {
					applicantIdList: [],
					applyContent: '',
					briefContent: '',
					files: [],
					openid: '',
					respondentIdList: [],
					linkman: '',
					mobile: '',
					address: '',
					happenRegionCode: '',
					happenRegionName: ''
				},
				rules: {
					applyContent: [{
						required: true,
						message: '请填写纠纷诉求内容',
						trigger: 'change'
					}],
					briefContent: [{
						required: true,
						message: '请填写纠纷简要情况',
						trigger: 'change'
					}],
					mobile: [
						{ required: true, message: '请填写申报人联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					],
					linkman: [{ required: true, message: '请填写申报人姓名', trigger: 'change' }],
					happenRegionName: [{ required: true, message: '请选择纠纷发生地点', trigger: 'change' }]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false
			}
		},
		onShow() {},
		onLoad() {
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
			// 申请人添加回传
			uni.$on('addApplicant', (peopleList) => {
				this.dealApplicant(peopleList)
			})
			// 被申请人添加回传
			uni.$on('addRespondent', (respondentPeopleList) => {
				this.dealRespondent(respondentPeopleList)
			})
			this.fetchRegionTree()
		},
		onUnload() {  
		    // 移除监听事件  添加申请人与被申请人
		    uni.$off('addApplicant')
		    uni.$off('addRespondent')
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 跳转我的填报列表
			handleGoToList() {
				uni.navigateTo({
					url: './mediationList'
				})
			},
			// 获取行政区划树
			fetchRegionTree() {
				var _this = this
				DispResoPlat.getMediateRegionCode().then(res => {
					var listStep = res.data.data.children
					_this.regionTree = _this.deleteChildren(listStep)
				})
			},
			// 处理tree返回数据中children为零的情况，PC可用于处理点击至末尾还加载的情况
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
			// 行政区划选择回显处理
			regionConfirm(e) {
				this.dataTemp.happenRegionName = e[0].label + e[1].label + e[2].label
				this.dataTemp.happenRegionCode = e[2].value
			},
			// 跳转添加申请人
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
			// 移除已添加的申请人
			deleteApplicantDetail(item, list) {
				for (var key in this.applicantList) {
				    if (this.applicantList[key].id === item.id) {
				      this.applicantList.splice(key, 1)
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
			// 移除已添加被申请人
			deleteRespondentDetail(item, list) {
				for (var key in this.respondentList) {
				    if (this.respondentList[key].id === item.id) {
				      this.respondentList.splice(key, 1)
				    }
				}
			},
			// 保存申报调解填写的数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				// 申请人添加判断
				if (_this.applicantList.length <= 0) {
					uni.showToast({
						title: '请添加申请人',
						icon: 'none'
					})
				} else {
					_this.dataTemp.openid = openid
					_this.dataTemp.address = _this.dataTemp.happenRegionName
					_this.respondentList.forEach(element => {
						_this.dataTemp.respondentIdList.push(element.id)
					})
					_this.applicantList.forEach(item => {
						_this.dataTemp.applicantIdList.push(item.id)
					})
					this.$refs.uForm.validate(valid => {
						if (valid) {
							_this.buttonLoading = true
							DispResoPlat.saveMediateRegist(_this.dataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '填报成功！',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/disputesResolvePlatform/spearAdjustableCenter/public/mediationToDeclare/publicIndex'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '报送失败: 请检查后重试',
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
		height: 75rpx;
		width: 180rpx;
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
