<template>
	<view>
		<view style="width: 100%;display: flex;margin-top: 1%;">
			<view style="width: 25%;min-height: 80vh;margin: 0 1% 0 1%;border-right: 1px #C0C0C0 solid;padding: 2px;">
				<view style="margin-top: 20%;">
					<u-button :custom-style="syrkCustomStyle" @click="handleGoTo('实有人口')">实有人口</u-button>
				</view>
				<view style="margin-top: 20%;">
					<u-button :custom-style="tsrqCustomStyle" @click="handleGoTo('特殊人群')">特殊人群</u-button>
				</view>
				<view style="margin-top: 20%;">
					<u-button :custom-style="xgcsCustomStyle" @click="handleGoTo('相关场所')">相关场所</u-button>
				</view>
			</view>
			<view style="width: 75%;min-height: 80vh;margin: 0 1% 0 1%;">
				<view class="form">
					<u-form :model="dataTemp" ref="uForm" label-width="215" :error-type="errorType"
						:border-bottom="false">
						<view v-if="tianbaoStatus == 1">
							<u-form-item v-if="formType!='sum'" label="填报年月" :required="true" prop="submissionDate" label-width="150">
								<u-input type="select" :select-open="dateShow" v-model="dataTemp.submissionDateText"
									:border="true" placeholder="填报年月" @click="dateShow = true" />
								<u-picker mode="time" v-model="dateShow" :params="limitParams"
									@confirm="dateSelectConfirm"></u-picker>
							</u-form-item>
							<u-form-item v-if="formType=='sum'" label="填报年月" :required="true" prop="submissionDate">
								{{dataTemp.submissionDateText}}
							</u-form-item>
							<u-divider color="#000000" half-width="100%" border-color="#2979ff">实有人口</u-divider>
							<u-form-item label="户籍人口数" :required="true" prop="householdRegisterPopulationNum">
								<u-number-box v-model="dataTemp.householdRegisterPopulationNum"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="流动人口数" :required="true" prop="flowPopulationNum">
								<u-number-box v-model="dataTemp.flowPopulationNum"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="见义勇为人员数" :required="true" prop="jianyiyws">
								<u-number-box v-model="dataTemp.jianyiyws"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="留守人员数" :required="true" prop="liushoury">
								<u-number-box v-model="dataTemp.liushoury"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="租房人员数" :required="true" prop="rentalHousePersonnelNum">
								<u-number-box v-model="dataTemp.rentalHousePersonnelNum"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="党员人数" :required="true" prop="partyMemberNum">
								<u-number-box v-model="dataTemp.partyMemberNum"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="政协代表人数" :required="true" prop="numOfCPPCCrepresentatives">
								<u-number-box v-model="dataTemp.numOfCPPCCrepresentatives"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="人大代表人数" :required="true" prop="numOfNPCdeputies">
								<u-number-box v-model="dataTemp.numOfNPCdeputies"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
						</view>
						<view v-if="tianbaoStatus == 2">
							<u-divider color="#000000" half-width="100%" border-color="#2979ff">特殊人群</u-divider>
							<u-form-item label="易肇事肇祸人员数" :required="true" prop="yizhaoszhry" label-width="245">
								<u-number-box v-model="dataTemp.yizhaoszhry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="精神病人员数" :required="true" prop="jingshenbry"
								:border-bottom="true">
								<u-number-box v-model="dataTemp.jingshenbry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="重点信访人员数" :required="true" prop="zhongdianxfry" :border-bottom="true">
								<u-number-box v-model="dataTemp.zhongdianxfry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="心理失衡人员数" :required="true" prop="xinlishry" :border-bottom="true">
								<u-number-box v-model="dataTemp.xinlishry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="社戒社康人员数" :required="true" prop="shejieskry" :border-bottom="true">
								<u-number-box v-model="dataTemp.shejieskry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="社区矫正人员数" :required="true" prop="shequjzry" :border-bottom="true">
								<u-number-box v-model="dataTemp.shequjzry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="刑满释放人员数" :required="true" prop="xingmansfry" :border-bottom="true">
								<u-number-box v-model="dataTemp.xingmansfry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="不良行为青少年数" :required="true" prop="buliangxwqsn"
								:border-bottom="true" label-width="245">
								<u-number-box v-model="dataTemp.buliangxwqsn"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="“三非”人员数" :required="true" prop="sanfeiry" :border-bottom="true">
								<u-number-box v-model="dataTemp.sanfeiry"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
						</view>
						<view v-if="tianbaoStatus == 3">
							<u-divider color="#000000" half-width="100%" border-color="#2979ff">相关场所</u-divider>
							<u-form-item label="出租房间数" :required="true" prop="rentedRoomsNum" :border-bottom="true">
								<u-number-box v-model="dataTemp.rentedRoomsNum"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="娱乐场所数" :required="true" prop="yulecs" :border-bottom="true">
								<u-number-box v-model="dataTemp.yulecs"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
							<u-form-item label="危爆物品相关场所数" :required="true" prop="weibaowpxgcs" :border-bottom="true">
								<u-number-box v-model="dataTemp.weibaowpxgcs"
									:min="0" :max="10000" input-width="70%"  :step="1" :input-height="70">
								</u-number-box>
							</u-form-item>
						</view>
					</u-form>
				</view>
			</view>
		</view>
		<view style="margin: 2% 0;">
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import KeyDataReport from '../../../api/keydatareport.js'
	import moment from 'moment'
	export default {
		data() {
			return {
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '80%',
					height: '100rpx'
				},
				syrkCustomStyle: {
					backgroundColor: '#1941A0', color: '#FFFFFF'
				},
				tsrqCustomStyle: {
					backgroundColor: '#FFFFFF', color: '#000000'
				},
				xgcsCustomStyle: {
					backgroundColor: '#FFFFFF', color: '#000000'
				},
				tianbaoStatus: 1,
				reportDateShow: false,
				dateShow: false,
				dataTemp: {
					buliangxwqsn: 0,
					flowPopulationNum: 0,
					householdRegisterPopulationNum: 0,
					jianyiyws: 0,
					jingshenbry: 0,
					liushoury: 0,
					numOfCPPCCrepresentatives: 0,
					rentalHousePersonnelNum: 0,
					numOfNPCdeputies: 0,
					partyMemberNum: 0,
					rearPersonnelNum: 0,
					submissionDate: '',
					submissionDateText: '',
					rentedRoomsNum: 0,
					sanfeiry: 0,
					shejieskry: 0,
					shequjzry: 0,
					weibaowpxgcs: 0,
					xingmansfry: 0,
					xinlishry: 0,
					yizhaoszhry: 0,
					yulecs: 0,
					zhongdianxfry: 0
				},
				imgList: [],
				typeList: [],
				typeSelectShow: false,
				rules: {},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				limitParams: {
					year: true,
					month: true,
				},
				startYear: '',
				formType: '' //表单修改模式，汇总数据修改、网格员修改
			}
		},
		onLoad(option) {
			this.id = option.id
			this.formType = option.formType
			this.handleDateInit()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			handleGoTo(e) {
				if (e == '实有人口') {
					this.tianbaoStatus = 1
					this.syrkCustomStyle.backgroundColor = '#1941A0'
					this.syrkCustomStyle.color = '#FFFFFF'
					this.tsrqCustomStyle.backgroundColor = '#FFFFFF'
					this.tsrqCustomStyle.color = '#000000'
					this.xgcsCustomStyle.backgroundColor = '#FFFFFF'
					this.xgcsCustomStyle.color = '#000000'
				}
				if (e == '特殊人群') {
					this.tianbaoStatus = 2
					this.syrkCustomStyle.backgroundColor = '#FFFFFF'
					this.syrkCustomStyle.color = '#000000'
					this.tsrqCustomStyle.backgroundColor = '#1941A0'
					this.tsrqCustomStyle.color = '#FFFFFF'
					this.xgcsCustomStyle.backgroundColor = '#FFFFFF'
					this.xgcsCustomStyle.color = '#000000'
				}
				if (e == '相关场所') {
					this.tianbaoStatus = 3
					this.syrkCustomStyle.backgroundColor = '#FFFFFF'
					this.syrkCustomStyle.color = '#000000'
					this.tsrqCustomStyle.backgroundColor = '#FFFFFF'
					this.tsrqCustomStyle.color = '#000000'
					this.xgcsCustomStyle.backgroundColor = '#1941A0'
					this.xgcsCustomStyle.color = '#FFFFFF'
				}
			},
			handleDateInit() {
				if (this.id) {
					this.fetchDetail()
				} else {
					this.dataTemp.submissionDateText = new moment().format('YYYY年MM月')
					this.dataTemp.submissionDate = new moment().format('YYYY-MM-DD 00:00:00')
					KeyDataReport.checkKeyDataReport(new moment().format('YYYYMM')).then(res => {
						console.log(res)
						if (res.data.data.status == 1) {
							uni.showModal({
								title: '该月数据已填报，重复填写将会覆盖上次填写数据，继续吗？',
								success: function(i) {
									if (i.cancel) {
										uni.reLaunch({
											url: '/eventReport/keydatareport/list/list'
										})
									}
								}
							})
						}
					})
				}
			},
			fetchDetail() {
				KeyDataReport.getKeyDataReportDetail(this.id).then(res => {
					Object.assign(this.dataTemp, res.data.data)
					this.dataTemp.submissionDateText = new moment(this.dataTemp.submissionDate).format('YYYY年MM月')
					this.dataTemp.submissionDate = new moment(this.dataTemp.submissionDate).format('YYYY-MM-DD 00:00:00')
				})
			},
			// 保存数据
			saveData() {
				var _this = this
				console.log('123123123', this.dataTemp)
				this.$refs.uForm.validate(valid => {

					if (valid) {
						_this.buttonLoading = true
						//判断填写的数据
						let arr = [...new Set(Object.values(_this.dataTemp))]

						if (arr.length == 1 && arr[0] == "0") {
							// uni.showModal({
							// 	content: '所有数据均为0吗，您确认吗？',
							// 	success: function(res) {
							// 		if (!res.confirm) {
							// 			return
							// 		}
							// 	}
							// })
							uni.showToast({
								title: '请填写具体数据',
								icon: 'none'
							})
							_this.buttonLoading = false
							return
						}
						if (this.id) {
							KeyDataReport.updateKeyDataReport(this.dataTemp).then(res => {
								console.log('上报结果', res)
								if (res.data.code === 0) {
									uni.showToast({
										title: '修改成功',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/eventReport/keydatareport/list/list'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '上报失败:' + res.data.desc,
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})

						} else {
							KeyDataReport.addKeyDataReport(this.dataTemp).then(res => {
								console.log('上报结果', res)
								if (res.data.code === 0) {
									uni.showToast({
										title: '上报成功',
										icon: 'none'
									})
									setTimeout(function() {
										uni.reLaunch({
											url: '/eventReport/keydatareport/list/list'
										})
									}, 1500)
								} else {
									uni.showToast({
										title: '上报失败:' + res.data.desc,
										icon: 'none'
									})
									_this.buttonLoading = false
								}
							})
						}
					} else {
						console.log('验证失败');
						_this.buttonLoading = false
					}
				});
			},
			// 填报年月选择
			dateSelectConfirm(e) {
				console.log(e)
				this.dataTemp.submissionDate = e.year + '-' + e.month + '-01 00:00:00' // + e.day + ' ' + e.hour + ':' + e.minute + ':00'
				this.dataTemp.submissionDateText = e.year + '年' + e.month + '月'
				KeyDataReport.checkKeyDataReport(e.year + e.month).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						if (res.data.data.status == 1) {
							uni.showModal({
								title: '该月数据已填报，重复填写将会覆盖上次填写数据，继续吗？',
								success: function(i) {
									if (i.cancel) {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
						}
					}

				})
			}
		},

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
		width: 70%;
		margin: 0 auto;
	}

	.upload-files {
		border: #F1F1F1 1upx solid;
		width: 100%;
		display: flex;
		align-items: center;
		justify-items: flex-start;
		height: 100upx;

		.upload-files-img {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			flex: 1;
			padding: 10upx;
			width: 150upx;
			height: 110upx;

			.item {
				// width: 50upx;
				// height: 50upx;
			}
		}

		.uploadFileIcon {
			height: 90upx;
			width: 90upx;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		image {
			border: #F1F1F1 1upx solid;
			width: 90upx;
			height: 90upx;
		}

		.icon-file-delete {
			width: 30upx;
			height: 30upx;
			position: relative;
			right: 20upx;
			top: -75upx;
			// background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
			// border-top-right-radius: 20upx;
			// border-bottom-left-radius: 20upx;
		}

	}
</style>
