<template>
	<view style="background-color: #ececec;">
		<!-- 申报信息 -->
		<view v-if="showData">
			<u-card :show-head="false" style="margin-bottom: 2vh;min-height: 900rpx;">
				<view class="content" slot="body">
					<view class="show-head-title">
						<view class="titleLeft"><u-icon name="bookmark" color="#2979ff" size="50" />纠纷案件信息</view>
					</view>
					<view class="show-body">
						<view v-if="dataTemp.registNo != null" class="u-flex u-row-between bodyTop">
							<view>案件编号:</view><view class="body-content"> {{ dataTemp.registNo }}</view>
						</view>
						<view v-if="dataTemp.name != null" class="u-flex u-row-between bodyTop">
							<view>纠纷名称:</view><view class="body-content"> {{ dataTemp.name }}</view>
						</view>
						<view v-if="dataTemp.address != null" class="u-flex u-row-between bodyTop">
							<view>纠纷发生地:</view><view class="body-content"> {{ dataTemp.address }}</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>申请联系人:</view><view class="body-content"> {{ dataTemp.linkman }}</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>联系人电话:</view><view class="body-content"> {{ dataTemp.mobile }}</view>
						</view>
						<view v-if="dataTemp.typeDesc != '' " class="u-flex u-row-between bodyTop">
							<view>纠纷类型:</view>
							<view>
								<u-tag :text="dataTemp.typeDesc" type="primary" />
							</view>
						</view>
						<view v-if="dataTemp.levelDesc != null" class="u-flex u-row-between bodyTop">
							<view>纠纷级别:</view>
							<view>
								<u-tag
									:text="dataTemp.levelDesc"
									:type="dataTemp.levelDesc == '简单' ?'info':dataTemp.levelDesc == '一般' ?'warning':'error'"
								/>
							</view>
						</view>
						<view class="bodyTop">申请人：
							<view>
								<view v-for="applicant in dataTemp.applicantList" :key="applicant.id">
									<view class="u-flex u-row-between parties-body" @click="viewApplicant(applicant)">
										<view>{{ applicant.name }}</view>
										<view>{{ applicant.partiesTypeName }}</view>
										<view>{{ applicant.mobile }}</view>
										<view><u-icon name="eye" size="35" /></view>
									</view>
								</view>
							</view>
						</view>
						<view class="bodyTop">被申请人：
							<view>
								<view v-for="respondent in dataTemp.respondentList" :key="respondent.id">
									<view class="u-flex u-row-between parties-body" style="color: #4AB0F6;" @click="viewRespondent(respondent)">
										<view>{{ respondent.name }}</view>
										<view>{{ respondent.partiesTypeName }}</view>
										<view>{{ respondent.mobile }}</view>
										<view><u-icon name="eye" size="35" /></view>
									</view>
								</view>
							</view>
						</view>
						<view class="bodyTop">简要情况:<view class="content-show">{{ dataTemp.briefContent }}</view></view>
						<view class="bodyTop">诉求：<view class="content-show">{{ dataTemp.applyContent }}</view></view>
						<view class="qrimg">
							<tki-qrcode cid="qrcode2" ref="qrcode2" :val="val" :size="size"
							:background="background" :foreground="foreground" :pdground="pdground" :icon="icon"
							:onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<u-popup v-model="partiesShow" mode="center" width="650rpx" min-height="1000rpx" border-radius="10">
			<view class="partiesShow-form">
				<view class="people-show">当事人信息</view>
				<u-form :model="partiesDataTemp" label-width="180rpx">
					<!-- 自然人信息 -->
					<view v-if="partiesDataTemp.partiesType == 1">
						<u-form-item label="姓名:"> {{ partiesDataTemp.name }}</u-form-item>
						<u-form-item label="联系方式:"> {{ partiesDataTemp.mobile }}</u-form-item>
						<u-form-item label="证件类型:"> {{ partiesDataTemp.certificateTypeName }}</u-form-item>
						<u-form-item label="证件号码:"> {{ partiesDataTemp.certificateCode }}</u-form-item>
						<u-form-item label="性别:"> {{ partiesDataTemp.gender }}</u-form-item>
						<u-form-item label="民族:"> {{ partiesDataTemp.nation }}</u-form-item>
						<u-form-item label="出生日期:"> {{ partiesDataTemp.birthday }}</u-form-item>
						<u-form-item label="职业:"> {{ partiesDataTemp.occupation }}</u-form-item>
						<u-form-item label="联系地址:"> {{ partiesDataTemp.address }}</u-form-item>
						<view class="upload-files">
							<view class="upload-item-media">
								<view class="bg-img" v-for="(element,index) in imgList" :key="element.fileId" @click="ViewImage(element, element)" :data-url="element">
									<view class="item">
										<image
											:src="element.imgPath"
											mode="aspectFill"
											:lazy-load="true"
											@load="onoff='1'">
										</image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 非自然人信息 -->
					<view v-if="partiesDataTemp.partiesType != 1">
						<u-form-item label="单位名称:"> {{ partiesDataTemp.name }}</u-form-item>
						<u-form-item label="联系方式:"> {{ partiesDataTemp.mobile }}</u-form-item>
						<u-form-item label="证件类型:"> {{ partiesDataTemp.certificateTypeName }}</u-form-item>
						<u-form-item label="组机构代码:"> {{ partiesDataTemp.certificateCode }}</u-form-item>
						<u-form-item label="单位负责人:"> {{ partiesDataTemp.responsiblePerson }}</u-form-item>
						<u-form-item label="联系地址:"> {{ partiesDataTemp.address }}</u-form-item>
					</view>
					<view style="margin-bottom: 2vh;">
						<u-button @click="partiesShow = false">关闭</u-button>
					</view>
				</u-form>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import DisputesResolvePlatform from '@/api/disputesResolvePlatform.js'
	import JsUtils from '../../../utils/index.js'
	import FileApi from '../../../api/fileupload.js'
	import tkiQrcode from '../../common/components/tki-qrcode/tki-qrcode.vue'
	
	export default {
		props:["registId"],
		components: {
			tkiQrcode
		},
		data() {
			return {
				partiesShow: false,
				dataTemp: {},
				oldDataTemp: {
					linkman: '',
					mobile: '',
					typeDesc: '',
					levelDesc: '',
					applicantList: [],
					respondentList: [],
					applyContent: '',
					briefContent: ''
				},
				applicantPartiesList: [],
				respondentPartiesList: [],
				partiesDataTemp: {
					name: '',
					mobile: '',
					nation: '',
					certificateTypeName: '',
					certificateCode: '',
					gender: '',
					birthday: '',
					occupation: '',
					address: '',
					responsiblePerson: '',
					imgList: []
				},
				imgList: [],
				showData: false,
				val: '待识别', // 要生成的二维码值
				size: 380, // 二维码大小
				unit: 'upx', // 单位
				background: '#ffffff', // 背景色
				foreground: '#000000', // 前景色
				pdground: '#000000', // 角标色
				icon: '',
				// icon: 'https://fangxincan.oss-cn-hangzhou.aliyuncs.com/20210604/a4bbd2253c234041b5d6492f65034024-exchange.png',
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				mediationInfo: {}
			}
		},
		watch: {},
		created() {
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
		},
		mounted() {
			this.fetchDetail()
		},
		methods: {
			// 获取调解基础信息
			async fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				let openid = uni.getStorageSync('openId')
				DisputesResolvePlatform.viewMediateRegistDetail(this.$props.registId).then(res => {
					if (res.data.code == 0) {
						this.$nextTick(function() {
							_this.oldDataTemp.registNo =  res.data.data.registNo
							_this.oldDataTemp.name = res.data.data.name
							_this.oldDataTemp.address =  res.data.data.address
						    _this.oldDataTemp.linkman =  res.data.data.linkman
						    _this.oldDataTemp.mobile = res.data.data.mobile
						    _this.oldDataTemp.levelDesc =  res.data.data.levelDesc
						    _this.oldDataTemp.applyContent =  res.data.data.applyContent
						    _this.oldDataTemp.briefContent =  res.data.data.briefContent
						    if (res.data.data.type != null) {
						    	_this.oldDataTemp.typeDesc =  res.data.data.type.text
						    }
						    _this.dataTemp = _this.oldDataTemp
						    _this.applicantPartiesList =  res.data.data.applicantPartiesList
						    _this.respondentPartiesList =  res.data.data.respondentPartiesList
						    _this.status =  res.data.data.status
						    _this.dealPeopleDetail()
							_this.serviceInfo = {
								linkman: _this.dataTemp.linkman,
								type: 1,
								registrationId: _this.dataTemp.id,
								serviceNo: _this.dataTemp.registNo,
								shareOpenid: openid
							}
							_this.val = JSON.stringify(_this.serviceInfo)
						})
						setTimeout(function() {
							uni.hideLoading()
							_this.showData = true
						}, 1500)
					}
				})
			},
			qrR(res) {
				this.src = res
			},
			// 处理人员信息
			async dealPeopleDetail() {
				var _this = this
				this.dataTemp.applicantList = []
				this.dataTemp.respondentList = []
				this.applicantPartiesList.forEach(applicantItem => {
					if (applicantItem.partiesPeople != null) {
						applicantItem.partiesType = 1,
						applicantItem.partiesTypeName = '自然人'
						_this.dataTemp.applicantList.push(applicantItem)
					} else if (applicantItem.partiesOrg != null) {
						if (applicantItem.partiesOrg.certificateType == '2') {
							_this.dataTemp.applicantList.push({
								id: applicantItem.id,
								partiesType: 2,
								partiesTypeName: '法人',
								certificateCode: applicantItem.partiesOrg.certificateCode,
								mobile: applicantItem.mobile,
								name: applicantItem.name,
								responsiblePerson: applicantItem.partiesOrg.responsiblePerson,
								address: applicantItem.address
							})
						}
						if (applicantItem.partiesOrg.certificateType == '3') {
							_this.dataTemp.applicantList.push({
								id: applicantItem.id,
								partiesType: 3,
								partiesTypeName: '非法人单位',
								certificateCode: applicantItem.partiesOrg.certificateCode,
								mobile: applicantItem.mobile,
								name: applicantItem.name,
								responsiblePerson: applicantItem.partiesOrg.responsiblePerson,
								address: applicantItem.address
							})
						}
					}
					_this.dataTemp.applicantList.forEach(element => {
						if (element.partiesType == 1) {
							element.files = element.partiesPeople.fileRecordList
							element.certificateCode = element.partiesPeople.certificateCode
							element.occupation = element.partiesPeople.occupation
							if (element.partiesPeople.certificateType != null) {
								element.certificateTypeName = element.partiesPeople.certificateType.text
							}
							if (element.partiesPeople.nation != null) {
								element.nation = element.partiesPeople.nation.text
							} else {
								element.nation = ''
							}
							if (element.partiesPeople.gender != null) {
								element.gender = element.partiesPeople.gender.text
							} else {
								element.gender = ''
							}
							if (element.partiesPeople.birthday != null) {
								element.birthday = element.partiesPeople.birthday
							} else {
								element.birthday = ''
							}
						}
					})
				})
				_this.respondentPartiesList.forEach(respondentItem => {
					if (respondentItem.partiesPeople != null) {
						respondentItem.partiesType = 1
						respondentItem.partiesTypeName = '自然人'
						_this.dataTemp.respondentList.push(respondentItem)
					} else if (respondentItem.partiesOrg != null) {
						if (respondentItem.partiesOrg.certificateType == '2') {
							_this.dataTemp.respondentList.push({
								id: respondentItem.id,
								partiesType: 2,
								partiesTypeName: '法人',
								mobile: respondentItem.mobile,
								name: respondentItem.name,
								responsiblePerson: respondentItem.partiesOrg.responsiblePerson,
								address: respondentItem.address
							})
						}
						if (respondentItem.partiesOrg.certificateType == '3') {
							_this.dataTemp.respondentList.push({
								id: respondentItem.id,
								partiesType: 3,
								partiesTypeName: '非法人单位',
								certificateCode: respondentItem.partiesOrg.certificateCode,
								certificateType: respondentItem.partiesOrg.certificateType,
								mobile: respondentItem.mobile,
								name: respondentItem.name,
								responsiblePerson: respondentItem.partiesOrg.responsiblePerson,
								address: respondentItem.address
							})
						}
					}
					_this.dataTemp.respondentList.forEach(element => {
						if (element.partiesType == 1) {
							element.files = element.partiesPeople.fileRecordList
							element.certificateCode = element.partiesPeople.certificateCode
							element.occupation = element.partiesPeople.occupation
							if (element.partiesPeople.certificateType != null) {
								element.certificateTypeName = element.partiesPeople.certificateType.text
							}
							if (element.partiesPeople.nation != null) {
								element.nation = element.partiesPeople.nation.text
							} else {
								element.nation = ''
							}
							if (element.partiesPeople.gender != null) {
								element.gender = element.partiesPeople.gender.text
							} else {
								element.gender = ''
							}
							if (element.partiesPeople.birthday != null) {
								element.birthday = element.partiesPeople.birthday
							} else {
								element.birthday = ''
							}
						}
					})
				})
			},
			// 查看当事人
			viewApplicant(applicant) {
				var _this = this
				_this.partiesDataTemp = {}
				_this.imgList = []
				_this.partiesDataTemp = applicant
				_this.partiesDataTemp.files.forEach(item => {
					this.$set(item, 'fileType', JsUtils.getFileType(item.name))
					FileApi.downloadFileByUni(item.id).then(i => {
						_this.imgList.push({
							imgPath: i[1].tempFilePath,
							fileId: item.id
						})
					})
				})
				_this.partiesShow = true
			},
			// 查看当事人（被）
			viewRespondent(respondent) {
				var _this = this
				_this.partiesDataTemp = {}
				_this.partiesDataTemp = respondent
				_this.imgList = []
				_this.partiesDataTemp.files.forEach(item => {
					this.$set(item, 'fileType', JsUtils.getFileType(item.name))
					FileApi.downloadFileByUni(item.id).then(i => {
						_this.imgList.push({
							imgPath: i[1].tempFilePath,
							fileId: item.id
						})
					})
				})
				this.partiesShow = true
			},
			ViewImage(e, v) {
				this.isPreview = true
				let arr = Array.from(this.imgList, ({
					imgPath
				}) => imgPath)
				uni.previewImage({
					urls: arr,
					current: v.imgPath
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
		color: #1261D4;
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
		.body-content{
			font-weight: 100;
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
	.people-show {
		height: 6vh;
		line-height: 6vh;
		font-size: 1.1rem;
		color: #000000;
		font-weight: 700;
		text-align: center;
	}
	.upload-files {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-top: 1%;
		.upload-item-media {
			display: flex;
			flex: 1;
			flex-wrap: wrap;
			image {
				width: 185upx;
				height: 185upx;
				padding: 2%;
			}
		}
	}
	.qrimg {
		margin-top: 2vh;
		display: flex;
		justify-content: center;
	}
</style>
