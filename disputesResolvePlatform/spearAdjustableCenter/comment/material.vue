<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<!-- 调解材料 -->
		<view>
			<!-- 纠纷调解申请书 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="registrationView">
						<u-collapse-item title="登记表" v-for="registration in material.registrationList" :key="registration.id">
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">申请时间:</view>
								<view>{{ registration.createdDate }}</view>
							</view>
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">申请联系人:</view>
								<view>{{ registration.linkman }}</view>
							</view>
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">联系方式:</view>
								<view>{{ registration.mobile }}</view>
							</view>
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">申请人:</view>
								<view>{{ registration.applicantPartiesList.length }} 人</view>
							</view>
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">被申请人:</view>
								<view>{{ registration.respondentPartiesList.length }} 人</view>
							</view>
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">纠纷类型:</view>
								<view>{{ registration.typeDesc }}</view>
							</view>
							<view class="u-flex u-row-between show-content">
								<view class="show-content-head">纠纷级别:</view>
								<view>{{ registration.levelDesc }}</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
			<!-- 纠纷调解调查记录 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="materialView">
						<u-collapse-item title="调查记录" v-for="item in material.surveyRecordList" :key="item.index">
							<view class="list-content" v-for="surveyRecord in material.surveyRecord" :key="surveyRecord.id">
								<view style="margin-bottom: 2vh;text-align: center;" @click="viewJFDCJL(surveyRecord)">
									<view style="width: 100;display: flex;line-height: 3vh;background-color: #1261D4;color: #FFFFFF;">
										<view style="border: 1rpx #AAAAAA solid;width: 45%;">调查时间</view>
										<view style="border: 1rpx #AAAAAA solid;width: 28%;">调查地点</view>
										<view style="border: 1rpx #AAAAAA solid;width: 27%;">记录人</view>
									</view>
									<view style="width: 100;display: flex;color: #000000;">
										<view style="border: 1rpx #AAAAAA solid;width: 45%;">{{ surveyRecord.createdDate }}</view>
										<view style="border: 1rpx #AAAAAA solid;width: 28%;">{{ surveyRecord.surveyAdd }}</view>
										<view style="border: 1rpx #AAAAAA solid;width: 27%;">{{ surveyRecord.recorder }}</view>
									</view>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
			<!-- 纠纷调解证据材料 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="evidenceRecordView">
						<u-collapse-item title="证据材料" v-for="item in material.evidenceRecordList" :key="item.index">
							<view v-for="evidenceRecord in material.evidenceRecord" :key="evidenceRecord.id">
								<view v-for="(file, index) in evidenceRecord.files" :key="file.id">
									<view style="margin:2vh 0 2vh 0;display: flex;width: 100%;height: 5vh;">
										<view style="width: 15%;">
											<img src="../../statics/img/wenjian.svg" mode="widthFix" style="width: 35px;height: 35px;">
										</view>
										<view style="width: 60%;">
											<view class="u-line-1" style="line-height: 3vh;color: #000000;">{{ file.name}}</view>
											<view style="line-height: 2vh;">{{ evidenceRecord.createdDate}}</view>
										</view>
										<view class="view-file" @click="viewFile(file)">
											查看附件
											<u-icon name="arrow-right" size="35" />
										</view>
									</view>
									<u-gap height="5" bg-color="#bbb"></u-gap>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
			<!-- 纠纷调解记录 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="mediateRecordView">
						<u-collapse-item title="调解记录" v-for="item in material.mediateRecordList" :key="item.index">
							<view class="list-content" v-for="mediateRecord in material.mediateRecord" :key="mediateRecord.id">
								<view style="margin-bottom: 2vh;text-align: center;" @click="viewJFTJJL(mediateRecord)">
									<view style="width: 100;display: flex;line-height: 3vh;background-color: #1261D4;color: #FFFFFF;">
										<view style="border: 1rpx #AAAAAA solid;width: 34%;">调解时间</view>
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">调解地点</view>
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">记录人</view>
									</view>
									<view style="width: 100;display: flex;color: #000000;">
										<view style="border: 1rpx #AAAAAA solid;width: 34%;">{{ mediateRecord.mediateDate.year }}-{{ mediateRecord.mediateDate.monthValue }}-{{ mediateRecord.mediateDate.dayOfMonth }}</view>
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">{{ mediateRecord.add }}</view>
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">{{ mediateRecord.recorder }}</view>
									</view>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
			<!-- 纠纷协议书 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="agreementRecordView">
						<u-collapse-item title="调解结果" v-for="agreementRecord in material.agreementRecordList" :key="agreementRecord.id">
							<view v-if="xysStatus">
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">结案日期:</view>
									<view>{{ agreementRecord.finishDate.year }}年{{ agreementRecord.finishDate.monthValue }}月{{ agreementRecord.finishDate.dayOfMonth }}日</u-form-item></view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">记录人:</view>
									<view>{{ agreementRecord.recorder }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">涉案金额(元)::</view>
									<view>{{ agreementRecord.amount }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">协议日期:</view>
									<view>{{ agreementRecord.agreemnetDate.year }}年{{ agreementRecord.agreemnetDate.monthValue }}月{{ agreementRecord.agreemnetDate.dayOfMonth }}日</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">协议内容:</view>
									<view>{{ agreementRecord.agreementContent }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">履行时限:</view>
									<view>{{ agreementRecord.limitDate.year }}年{{ agreementRecord.limitDate.monthValue }}月{{ agreementRecord.limitDate.dayOfMonth }}日</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">履行地点:</view>
									<view>{{ agreementRecord.performAdd }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">履行方式:</view>
									<view>{{ agreementRecord.performType.text }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">纠纷转化情况:</view>
									<view>{{ agreementRecord.transformSituationDesc }}</view>
								</view>
							</view>
							<view v-if="xysSBStatus">
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">结案日期:</view>
									<view>{{ agreementRecord.mediateDate.year }}年{{ agreementRecord.mediateDate.monthValue }}月{{ agreementRecord.mediateDate.dayOfMonth }}日</u-form-item></view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">调解机构:</view>
									<view>{{ agreementRecord.orgName }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">记录人:</view>
									<view>{{ agreementRecord.recorder }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">调解内容:</view>
									<view>{{ agreementRecord.mediateResult }}</view>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
			<!-- 回访记录 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="reviewRecordView">
						<u-collapse-item title="回访记录" v-for="item in material.reviewRecordList" :key="item.index">
							<view class="list-content" v-for="reviewRecord in material.reviewRecord" :key="reviewRecord.id">
								<view style="margin-bottom: 2vh;text-align: center;" @click="viewHFJL(reviewRecord)">
									<view style="width: 100;display: flex;line-height: 3vh;background-color: #1261D4;color: #FFFFFF;">
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">回访时间</view>
										<view style="border: 1rpx #AAAAAA solid;width: 34%;">回访人</view>
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">是否满意</view>
									</view>
									<view style="width: 100;display: flex;color: #000000;">
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">{{ reviewRecord.reviewDate.year }}-{{ reviewRecord.reviewDate.monthValue }}-{{ reviewRecord.reviewDate.dayOfMonth }}</view>
										<view style="border: 1rpx #AAAAAA solid;width: 34%;">{{ reviewRecord.participant }}</view>
										<view style="border: 1rpx #AAAAAA solid;width: 33%;">{{ reviewRecord.satisfactionDesc }}</view>
									</view>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
			<!-- 司法确认 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;">
				<view class="content" slot="body" v-model="material">
					<u-collapse ref="confirmationRecordView">
						<u-collapse-item title="司法确认材料" v-for="confirmationRecord in material.confirmationRecordList" :key="confirmationRecord.id">
							<view v-if="sfqrStatus">
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">机构名称:</view>
									<view>{{ confirmationRecord.orgName }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">操作人:</view>
									<view>{{ confirmationRecord.userName }}</view>
								</view>
								<view class="u-flex u-row-between show-content">
									<view class="show-content-head">操作时间:</view>
									<view>{{ confirmationRecord.createdDate }}</view>
								</view>
								<view v-for="(file, index) in confirmationRecord.files" :key="file.id">
									<view style="margin:1vh 0 1vh 0;display: flex;width: 100%;height: 5vh;">
										<view style="width: 15%;">
											<img src="../../statics/img/wenjian.svg" mode="widthFix" style="width: 35px;height: 35px;">
										</view>
										<view style="width: 65%;">
											<view class="u-line-1" style="line-height: 3vh;color: #000000;">{{ file.name}}</view>
											<view style="line-height: 2vh;">{{ confirmationRecord.createdDate}}</view>
										</view>
										<view class="view-file" @click="viewFile(file)">
											查看附件
											<u-icon name="arrow-right" size="35" />
										</view>
									</view>
									<u-gap height="5" bg-color="#bbb"></u-gap>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</u-card>
		</view>
		<!-- 调查记录 -->
		<u-popup v-model="viewDCJLShow" mode="center" width="650rpx" min-height="800rpx" border-radius="10" close-icon-size="50">
			<view class="partiesShow-form">
				<u-form :model="viewDCJLDataTemp" label-width="200rpx">
					<u-form-item label="调查日期:"> {{ viewDCJLDataTemp.surveyDate.year }}-{{ viewDCJLDataTemp.surveyDate.monthValue }}-{{ viewDCJLDataTemp.surveyDate.dayOfMonth }}</u-form-item>
					<u-form-item label="调查地点:"> {{ viewDCJLDataTemp.surveyAdd }}</u-form-item>
					<u-form-item label="记录人:"> {{ viewDCJLDataTemp.recorder }}</u-form-item>
					<u-form-item label="参与人:"> {{ viewDCJLDataTemp.participant }}</u-form-item>
					<u-form-item label="被调查人:"> {{ viewDCJLDataTemp.respondent }}</u-form-item>
					<u-form-item label="调查记录:"> {{ viewDCJLDataTemp.recordContent }}</u-form-item>
					<u-form-item label="案情分析:"> {{ viewDCJLDataTemp.prediction }}</u-form-item>
					<view style="margin-bottom: 2vh;">
						<u-button @click="viewDCJLShow = false">关闭</u-button>
					</view>
				</u-form>
			</view>
		</u-popup>
		<!-- 调解记录 -->
		<u-popup v-model="viewTJJLShow" mode="center" width="650rpx" min-height="800rpx" border-radius="10">
			<view class="partiesShow-form">
				<u-form :model="viewTJJLDataTemp" label-width="200rpx">
					<u-form-item label="调解日期:"> {{ viewTJJLDataTemp.mediateDate.year }}-{{ viewTJJLDataTemp.mediateDate.monthValue }}-{{ viewTJJLDataTemp.mediateDate.dayOfMonth }}</u-form-item>
					<u-form-item label="调解地点:"> {{ viewTJJLDataTemp.add }}</u-form-item>
					<u-form-item label="记录人:"> {{ viewTJJLDataTemp.recorder }}</u-form-item>
					<u-form-item label="参与人:"> {{ viewTJJLDataTemp.participant }}</u-form-item>
					<u-form-item label="当事人:"> {{ viewTJJLDataTemp.parties }}</u-form-item>
					<u-form-item label="调解记录:"> {{ viewTJJLDataTemp.recordContent }}</u-form-item>
					<u-form-item label="本次调解结果:"> {{ viewTJJLDataTemp.result }}</u-form-item>
					<view style="margin-bottom: 2vh;">
						<u-button @click="viewTJJLShow = false">关闭</u-button>
					</view>
				</u-form>
			</view>
		</u-popup>
		<!-- 回访记录 -->
		<u-popup v-model="viewHFJLShow" mode="center" width="650rpx" min-height="800rpx" border-radius="10">
			<view class="partiesShow-form">
				<u-form :model="viewHFJLDataTemp" label-width="160rpx">
					<u-form-item label="回访日期:"> {{ viewHFJLDataTemp.reviewDate.year }}-{{ viewHFJLDataTemp.reviewDate.monthValue }}-{{ viewHFJLDataTemp.reviewDate.dayOfMonth }}</u-form-item>
					<u-form-item label="回访人:"> {{ viewHFJLDataTemp.participant }}</u-form-item>
					<u-form-item label="当事人:"> {{ viewHFJLDataTemp.parties }}</u-form-item>
					<u-form-item label="回访事由:"> {{ viewHFJLDataTemp.reason }}</u-form-item>
					<u-form-item label="回访情况说明:" label-width="200"> {{ viewHFJLDataTemp.reviewSituation }}</u-form-item>
					<u-form-item label="协议履行情况:" label-width="200"> {{ viewHFJLDataTemp.performanceSituationDesc }}</u-form-item>
					<u-form-item label="对调解结果是否满意:" label-width="280"> {{ viewHFJLDataTemp.satisfactionDesc }}</u-form-item>
					<view style="margin-bottom: 2vh;">
						<u-button @click="viewHFJLShow = false">关闭</u-button>
					</view>
				</u-form>
			</view>
		</u-popup>
		<u-modal
			v-model="isImgShow"
			:show-cancel-button="true"
			:content="isImgShowContent"
			@confirm="openImageFile"
			title="查看文件"
			>	
		</u-modal>
		<u-modal
			v-model="isOfficeShow"
			:show-cancel-button="true"
			:content="isOfficeShowContent"
			@confirm="openOfficeFile"
			title="查看文件"
			>	
		</u-modal>
	</view>
</template>

<script>
	import DisputesResolvePlatform from '@/api/disputesResolvePlatform.js'
	import FileApi from '@/api/fileupload.js'
	
	export default {
		props:["registId"],
		data() {
			return {
				material: {},
				viewDCJLShow: false,
				viewDCJLDataTemp: {
					surveyDate: {}
				},
				viewTJJLShow: false,
				viewTJJLDataTemp: {
					mediateDate: {}
				},
				viewHFJLShow: false,
				viewHFJLDataTemp: {
					reviewDate: {}
				},
				xysStatus: false,
				xysSBStatus: false,
				sfqrStatus: false,
				isPreview: false,
				imgSrc: '',
				imgList: [],
				tempFilePath: '',
				viewTempFile: {},
				isImgShow: false,
				isImgShowContent: '您好，您当前查看文件为图片文件，如需下载请长按图片选择保存到本地。',
				isOfficeShow: false,
				isOfficeShowContent: '您好，查看该文件之前请先确认您已安装WPS文件查看软件。'
			}
		},
		watch: {},
		created() {},
		mounted() {
			// 解决折叠面板打开是高度重新获取问题
			this.$nextTick(() => {
				this.$refs.registrationView.init()
				this.$refs.materialView.init()
				this.$refs.evidenceRecordView.init()
				this.$refs.mediateRecordView.init()
				this.$refs.agreementRecordView.init()
				this.$refs.reviewRecordView.init()
				this.$refs.confirmationRecordView.init()
			})
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			// 获取案件材料信息
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				DisputesResolvePlatform.getRecordEvidenceList(_this.$props.registId).then(res => {
					if (res.data.code == 0) {
						_this.material = res.data.data
						if (_this.material.registration.type != null) {
							_this.material.registration.typeDesc = _this.material.registration.type.text
						} else {
							_this.material.registration.typeDesc = ''
						}
						// 申请书
						_this.material.registrationList = []
						_this.material.registrationList.push(_this.material.registration)
						// 调查记录
						_this.material.surveyRecordList = []
						_this.material.surveyRecordList.push(_this.material.surveyRecord)
						// 调解材料
						_this.material.evidenceRecordList = []
						_this.material.evidenceRecordList.push(_this.material.evidenceRecord)
						// 调解记录
						_this.material.mediateRecordList = []
						_this.material.mediateRecordList.push(_this.material.mediateRecord)
						// 协议书
						_this.material.agreementRecordList = []
						if (_this.material.agreementRecord != null) {
							_this.material.agreementRecordList.push(_this.material.agreementRecord)
							_this.xysStatus = true
						} else if (_this.material.failRecord != null) {
							_this.material.agreementRecordList.push(_this.material.failRecord)
							_this.xysSBStatus = true
						} else {
							_this.material.agreementRecord = []
							_this.material.agreementRecordList.push(_this.material.agreementRecord)
						}
						// 回访记录
						_this.material.reviewRecordList = []
						_this.material.reviewRecordList.push(_this.material.reviewRecord)
						// 司法确认
						_this.material.confirmationRecordList = []
						if (_this.material.confirmationRecord != null) {
							_this.material.confirmationRecordList.push(_this.material.confirmationRecord)
							_this.sfqrStatus = true
						} else {
							_this.material.confirmationRecord = []
							_this.material.confirmationRecordList.push(_this.material.confirmationRecord)
						}
						setTimeout(function() {
							uni.hideLoading()
						}, 2000)
					} else {
						uni.showToast({
							title: '查询失败请稍后重试。',
							icon: 'none'
						})
					}
				})
			},
			// 查看调查记录
			viewJFDCJL(surveyRecord) {
				this.viewDCJLDataTemp = []
				this.viewDCJLDataTemp = surveyRecord
				this.viewDCJLShow = true
			},
			// 查看证据调解记录
			viewJFTJJL(mediateRecord) {
				this.viewTJJLDataTemp = []
				this.viewTJJLDataTemp = mediateRecord
				this.viewTJJLShow = true
			},
			// 查看回访记录
			viewHFJL(reviewRecord) {
				this.viewHFJLDataTemp = []
				this.viewHFJLDataTemp = reviewRecord
				this.viewHFJLShow = true
			},
			// 判断是否是图片
			isImage(fileName) {
				if (typeof fileName !== 'string') return
				const name = fileName.toLowerCase()
				return name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg') ||
					name.endsWith('.png') || name.endsWith('.bmp') || name.endsWith('.pcx') ||
					name.endsWith('.gif') || name.endsWith('.tiff') || name.endsWith('.psd') ||
					name.endsWith('.swf') || name.endsWith('.svg')
			},
			// 判断是否是OFFICE文件
			isOfficeFile(fileName) {
				if (typeof fileName !== 'string') return
				const name = fileName.toLowerCase()
				return name.endsWith('.mdb') || name.endsWith('.xls') || name.endsWith('.doc') ||
					name.endsWith('.ppt') || name.endsWith('.html') || name.endsWith('.xlsx') ||
					name.endsWith('.docx') || name.endsWith('.pptx') || name.endsWith('.pdf')
			},
			// 查看附件 通用 判断文件类型后打开
			viewFile(file) {
				var _this = this
				_this.viewTempFile = file
				var isImage = _this.isImage(file.name)
				var isOfficeFile = _this.isOfficeFile(file.name)
				if (isImage) {
					_this.isImgShow = true
				} else if (isOfficeFile) {
					_this.isOfficeShow = true
				} else {
					uni.showToast({
						title: '抱歉！该文件不支持查看，请联系系统管理员获取源文件！',
						icon: 'none'
					})
				}
			},
			// 打开图片文件
			openImageFile() {
				var _this = this
				_this.isImgShow = false
				_this.imgList = []
				_this.imgSrc = ''
				setTimeout(function() {
					uni.showToast({
						title: '正在打开文件请稍后.....',
						icon: 'none'
					})
					FileApi.downloadFileByUni(_this.viewTempFile.id).then(i => {
						_this.imgSrc = i[1].tempFilePath
						_this.imgList.push(i[1].tempFilePath)
						_this.isPreview = true
						wx.previewImage({
							urls: _this.imgList,
							current:  _this.imgSrc
						})
					})
				}, 500)
			},
			// 打开非图片文件（通用）
			openOfficeFile() {
				var _this = this
				_this.isOfficeShow = false
				setTimeout(function() {
					uni.showToast({
						title: '正在打开文件请稍后.....',
						icon: 'none'
					})
					FileApi.downloadFileByUni(_this.viewTempFile.id).then(i => {
						_this.tempFilePath = i[1].tempFilePath
						wx.saveFile({
						  tempFilePath: _this.tempFilePath,
						  success: function (res) {
							const savedFilePath = res.savedFilePath;
							// 打开文件
							// console.log('111111111', savedFilePath)
							wx.openDocument({
								filePath: savedFilePath,
								showMenu: true,
								success: function (res) {
									console.log('打开文档成功')
								},
							})
						  },
						  fail: function (err) {
							console.log('保存失败：', err)
						  }
						})
					})
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.partiesShow-form {
		padding: 0px 20px 0px 20px;
	}
	.show-content {
		line-height: 5vh;
		.show-content-head {
			color: #000000;
		}
	}
	.view-file {
		width: 25%;
		text-align: center;
		height: 5vh;
		line-height: 5vh;
		display: flex;
	}
</style>
