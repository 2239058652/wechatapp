<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="200" :error-type="errorType" :border-bottom="true">
				<u-form-item label="上报组织:" prop="flowPopulationNum">
					{{dataTemp.orgName}}
				</u-form-item>
				<u-form-item label="上报人:" prop="flowPopulationNum">
					{{dataTemp.reporter}}
				</u-form-item>
				<u-form-item label="填报年月:" prop="flowPopulationNum">
					{{dataTemp.submissionDate | dateFilter}}
				</u-form-item>
			</u-form>
		</view>
		<u-gap height="6" bg-color="#cfcfcf"></u-gap>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="270" :error-type="errorType" :border-bottom="true">
				<u-divider color="#000000" half-width="100%" border-color="#2979ff">实有人口</u-divider>
				<u-form-item label="户籍人口数:" prop="householdRegisterPopulationNum">
					{{dataTemp.householdRegisterPopulationNum}}
				</u-form-item>
				<u-form-item label="流动人口数:" prop="flowPopulationNum">
					{{dataTemp.flowPopulationNum}}
				</u-form-item>
				<u-form-item label="见义勇为人员数:" prop="jianyiyws">
					{{dataTemp.jianyiyws}}
				</u-form-item>
				<u-form-item label="留守人员数:" prop="liushoury">
					{{dataTemp.liushoury}}
				</u-form-item>
				<u-form-item label="租房人员数:" prop="rentalHousePersonnelNum">
					{{dataTemp.rentalHousePersonnelNum}}
				</u-form-item>
				<u-form-item label="党员人数:" prop="partyMemberNum">
					{{dataTemp.partyMemberNum}}
				</u-form-item>
				<u-form-item label="政协代表人数:" prop="numOfCPPCCrepresentatives">
					{{dataTemp.numOfCPPCCrepresentatives}}
				</u-form-item>
				<u-form-item label="人大代表人数:" prop="numOfNPCdeputies">
					{{dataTemp.numOfNPCdeputies}}
				</u-form-item>
				<u-divider color="#000000" half-width="100%" border-color="#2979ff">特殊人群</u-divider>
				<u-form-item label="易肇事肇祸人员数:" prop="yizhaoszhry">
					{{dataTemp.yizhaoszhry}}
				</u-form-item>
				<u-form-item label="精神病人员数:" prop="jingshenbry" :border-bottom="true">
					{{dataTemp.jingshenbry}}
				</u-form-item>
				<u-form-item label="重点信访人员数:" prop="zhongdianxfry" :border-bottom="true">
					{{dataTemp.zhongdianxfry}}
				</u-form-item>
				<u-form-item label="心理失衡人员数:" prop="xinlishry" :border-bottom="true">
					{{dataTemp.xinlishry}}
				</u-form-item>
				<u-form-item label="社戒社康人员数:" prop="shejieskry" :border-bottom="true">
					{{dataTemp.shejieskry}}
				</u-form-item>
				<u-form-item label="社区矫正人员数:" prop="shequjzry" :border-bottom="true">
					{{dataTemp.shequjzry}}
				</u-form-item>
				<u-form-item label="刑满释放人员数:" prop="xingmansfry" :border-bottom="true">
					{{dataTemp.xingmansfry}}
				</u-form-item>
				<u-form-item label="不良行为青少年数:" prop="buliangxwqsn" :border-bottom="true">
					{{dataTemp.buliangxwqsn}}
				</u-form-item>
				<u-form-item label="留守人员数:" prop="liushoury" :border-bottom="true">
					{{dataTemp.liushoury}}
				</u-form-item>
				<u-form-item label="“三非”人员数:" prop="sanfeiry" :border-bottom="true">
					{{dataTemp.sanfeiry}}
				</u-form-item>
				<u-divider color="#000000" half-width="100%" border-color="#2979ff">相关场所</u-divider>
				<u-form-item label="出租房间数:" prop="rentedRoomsNum" :border-bottom="true">
					{{dataTemp.rentedRoomsNum}}
				</u-form-item>
				<u-form-item label="娱乐场所数:" prop="yulecs" :border-bottom="true">
					{{dataTemp.yulecs}}
				</u-form-item>
				<u-form-item label="危爆物品相关场所数:" prop="weibaowpxgcs" :border-bottom="true">
					{{dataTemp.weibaowpxgcs}}
				</u-form-item>
			</u-form>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import KeyDataReport from '../../../api/keydatareport.js'
	import moment from 'moment'
	export default {
		filters:{
			dateFilter(val){
				return new moment(val).format("YYYY年MM月")
			}
		},
		data() {
			return {
				reportDateShow: false,
				dataTemp: {
					flowPopulationNum: '0',
					householdRegisterPopulationNum: '0',
					numOfCPPCCrepresentatives: '0',
					numOfNPCdeputies: '0',
					partyBranchesNum: '0',
					partyMemberNum: '0',
					realPopulationNum: '0',
					rearPersonnelNum: '0',
					rentalHousePersonnelNum: '0',
					rentedRoomsNum: '0'
				},
				imgList: [],
				typeList: [],
				typeSelectShow: false,
				rules: {
					flowPopulationNum: [{
							required: true,
							message: '请填写流动人口数',
							trigger: ['change', 'blur'],
						},
						{
							type: 'number',
							message: '流动人口数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					householdRegisterPopulationNum: [{
							required: true,
							message: '请填写户籍人口数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '户籍人口数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					numOfCPPCCrepresentatives: [{
							required: true,
							message: '请填写政协代表数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '政协代表数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					numOfNPCdeputies: [{
							required: true,
							message: '请填写人大代表数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '人大代表数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					partyBranchesNum: [{
							required: true,
							message: '请填写党支部数量',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '党支部数量只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					partyMemberNum: [{
							required: true,
							message: '请填写党员人数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '党员人数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					realPopulationNum: [{
							required: true,
							message: '请填写实有人口数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '实有人口数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					rearPersonnelNum: [{
							required: true,
							message: '请填写留守人员数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '留守人员数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					rentedRoomsNum: [{
							required: true,
							message: '请填写出租房间数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '出租房间数只能为整数',
							trigger: ['change', 'blur'],
						}
					],
					rentalHousePersonnelNum: [{
							required: true,
							message: '请填写出租房人员数',
							trigger: 'change',
						},
						{
							type: 'number',
							message: '出租房人员数只能为整数',
							trigger: ['change', 'blur'],
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
				id: ''
			}
		},
		onLoad(option) {
			// this.fetchDir()
			this.id = option.id
			this.fetchDetail()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			fetchDetail() {
				KeyDataReport.getKeyDataReportDetail(this.id).then(res => {
					console.log(res)
					this.dataTemp = Object.assign({}, res.data.data)
				})
			},
			// 保存数据
			saveData() {
				var _this = this
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
							return
						}
						KeyDataReport.addKeyDataReport(this.dataTemp).then(res => {
							console.log('上报结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '上报成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									});
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
						console.log('验证失败');
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
