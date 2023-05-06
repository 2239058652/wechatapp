<template>
	<view class="padding">
		<u-form :model="dataTempCBDB" ref="uFormCBDB" label-width="120" :error-type="errorType" label-position="top">
			<u-form-item label="办理要求:" :required="true" prop="urgeDemand">
				<u-input v-model="dataTempCBDB.urgeDemand" type="textarea" height="100" :border="true" placeholder="请填写办理要求" />
			</u-form-item>
			<u-form-item label="办理时限" :required="true" prop="deadlineDate">
				<u-input type="select" :select-open="limitshow"
					v-model="dataTempCBDB.deadlineDate" :border="true"
				 @click="limitshow = true" />
				<u-calendar v-model="limitshow" mode="date" max-date="2030-01-01" :min-date="nowDate" @change="limitSelectConfirm"></u-calendar>
			</u-form-item>
			<view>
				<u-button type="primary" :custom-style="customStyle" size="mini" @click="handleAddFile()">添加附件</u-button>
			</view>
			<view v-for="file in tempCBDBfiles" :key="file.fileId">
				<view style="margin:2vh 0 2vh 0;display: flex;width: 100%;height: 5vh;">
					<view style="width: 15%;">
						<img src="../../../statics/img/wenjian.svg" mode="widthFix" style="width: 35px;height: 35px;">
					</view>
					<view style="width: 75%;">
						<view class="u-line-1" style="line-height: 5vh;color: #000000;">{{ file.fileName}}</view>
					</view>
					<view class="view-file" @click="deleteFile(file)">
						<u-icon name="close-circle" size="35" />
					</view>
				</view>
				<u-gap height="5" bg-color="#bbb"></u-gap>
			</view>
			<view v-if="tempCBDBfiles.length == 0" style="color: #AAAAAA;margin-top: 2vh;">暂未添加相应附件.............</view>
		</u-form>
		<view style="margin-top: 10vh;">
			<u-button v-if="dataTempCBDB.urgeType == 0" type="primary" @click="handleCBDB()" :loading="buttonLoading">纠纷调解催办</u-button>
			<u-button v-if="dataTempCBDB.urgeType == 1" type="warning" @click="handleCBDB()" :loading="buttonLoading">纠纷调解督办</u-button>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import DisputesResolvePlatform from '../../../../api/disputesResolvePlatform.js'
	import FileApi from '../../../../api/fileupload.js'
	
	export default {
		components: {},
		data() {
			return {
				customStyle: {
					height: '75rpx'
				},
				buttonLoading: false,
				dataTempCBDB: {
					urgeDemand: '',
					deadlineDate: '',
					fileIdList: [],
					registrationId: '',
					urgeType: ''
				},
				errorType: ['toast', 'border'],
				limitshow: false,
				limitParams: {
					year: true,
					month: true,
					day: true
				},
				registId: '',
				rulesCBDB: {
					urgeDemand: [{ required: true, message: '请添加办理要求', trigger: 'change' }],
					deadlineDate: [{ required: true, message: '请选择办理时限', trigger: 'change' }]
				},
				nowDate: '',
				tempCBDBfiles: []
			}
		},
		watch: {},
		onLoad(option) {
			if (option.registId) {
				this.registId = option.registId
				this.dataTempCBDB.urgeType = option.urgeType
			}
			this.nowDate = new moment().format('YYYY-MM-DD')
		},
		onShow() {
		},
		methods: {
			// 时间选择
			limitSelectConfirm(e) {
				this.dataTempCBDB.deadlineDate = e.result
			},
			handleAddFile() {
				var _self = this
				wx.chooseMessageFile({
				  count: 1,
				  type: 'all',
				  success: (res) => {
				  	res.tempFiles.forEach(item => {
				  		FileApi.uploadFileByUni(item.path).then(resupload => {
							if (resupload[1].statusCode == 200) {
								var uplodeData = JSON.parse(resupload[1].data)
								console.log(uplodeData)
								_self.tempCBDBfiles.push({
									fileName: item.name,
									fileId: uplodeData.data.fileId,
								})
							}
				  		})
				  	})
				  }
				})
			},
			deleteFile(file, list) {
				for (var key in this.tempCBDBfiles) {
				    if (this.tempCBDBfiles[key].fileId === file.fileId) {
				      this.tempCBDBfiles.splice(key, 1)
				    }
				}
			},
			// 催办督办
			handleCBDB() {
				var _this = this
				this.$refs.uFormCBDB.setRules(_this.rulesCBDB);
				this.$refs.uFormCBDB.validate(valid => {
					if (valid) {
						_this.dataTempCBDB.registrationId = _this.registId
						_this.tempCBDBfiles.forEach(element => {
							_this.dataTempCBDB.fileIdList.push(element.fileId)
						})
						DisputesResolvePlatform.addMediateDealUrge(_this.dataTempCBDB).then(res => {
							if (res.data.code === 0) {
								if (_this.dataTempCBDB.urgeType == 0) {
									uni.showToast({
										title: '纠纷催办成功！',
										icon: 'none'
									})
								} else {
									uni.showToast({
										title: '纠纷督办成功！',
										icon: 'none'
									})
								}
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/main/main'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '操作失败: 请检查后重试',
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
	.view-file {
		width: 10%;
		text-align: center;
		height: 5vh;
		line-height: 5vh;
		display: flex;
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
		flex-wrap: wrap;
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
		width: 90%;
		margin: 0 auto;
	}
	
</style>
