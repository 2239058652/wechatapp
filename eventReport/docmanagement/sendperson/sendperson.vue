<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item :required="true" label="标题" prop="title">
					<u-input v-model="dataTemp.title" type="text" :border="true" />
				</u-form-item>
				<u-form-item :required="true" label="收件人" prop="receiveUserIds">
					<u-input type="textarea" :border="true" :height="95" v-model="dataTemp.receiveUserNames" placeholder="请选择收件人" @click="gotoSelectOrg('org')"></u-input>
				</u-form-item>
				<u-form-item :required="true" label="邮件类型" prop="docType">
					<u-input type="select" :select-open="flSelectShow" :border="true" v-model="dataTemp.docType" placeholder="请选择邮件类型"
					 @click="flSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="flList" v-model="flSelectShow"
					 @confirm="flSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item :required="true" label="邮件级别" prop="docLevel">
					<u-input type="select" :select-open="jbSelectShow" :border="true" v-model="dataTemp.docLevel" placeholder="请选择邮件级别"
					 @click="jbSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="jbList" v-model="jbSelectShow"
					 @confirm="jbSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item :required="true" label="内容" prop="content">
					<u-input v-model="dataTemp.content" type="textarea" height="150" :border="true" placeholder="请填写邮件内容" />
				</u-form-item>
				<u-form-item label="附件">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index].imgPath">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="ChooseImage">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="bottombutton">
			<u-button type="success" @click="handleSend" :loading="buttonLoading">发送</u-button>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import DocManagementApi from '../../../api/docmanagement.js'
	import RoleJS from '../../../utils/role.js'
	export default {
		data() {
			return {
				hasAuth: false,
				popupShow: false,
				popupFlowShow: false,
				dataTemp: {
					title: '',
					content: '',
					docLevel: '',
					docLevelCode: '',
					eventLevelCode: '',
					docType: '',
					docTypeCode: '',
					fileIds: [],
					receiveUserIds: [],
					receiveUserNames: '' //接收组织名称
				},
				departmentList: [],
				imgList: [],
				jbList: [],
				flList: [],
				jbSelectShow: false,
				flSelectShow: false,
				orgSelectShow: false,
				videoList: [],
				rules: {
					title: [{
						required: true,
						message: '请填写邮件标题',
						trigger: ['change', 'blur'],
					}],
					receiveUserIds: [{
						required: true,
						message: '请选择收件人',
						trigger: 'change',
						type: 'array'
					}],
					docType: [{
						required: true,
						message: '请选择邮件类型',
						trigger: 'change'
					}],
					docLevel: [{
						required: true,
						message: '请选择邮件级别',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写邮件内容',
						trigger: 'change'
					}],
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				//直接办结附件列表
				imgFileList: []
			}
		},
		onShow() {
			uni.$on('selectedUser', (list) => {
				this.setSelectedUser(list)
			})
		},
		onLoad() {
			this.dataTemp.mapType = this.$MapType
			this.initAuth()
			this.fetchDir()
			// this.getLocation()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			handleSend() {
				var _this = this
				// this.$refs.uForm.setRules(this.rulesYj);
				this.$refs.uForm.validate((valid) => {
					if (!valid) {
						_this.buttonLoading = false
						return
					}
					this.buttonLoading = true
					_this.dataTemp.fileIds = []
					_this.imgList.forEach(item => {
						_this.dataTemp.fileIds.push(item.fileId)
					})
					DocManagementApi.sendDocPersonal(this.dataTemp).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: '发送成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../sendboxlist/sendboxlist'
								})

							}, 1500)
							this.buttonLoading = false
						} else {
							uni.showToast({
								title: '发送失败' + result.desc,
								icon: 'none'
							})
							_this.buttonLoading = false
						}
					})
				})
			},
			setSelectedUser(list) {
				this.$nextTick(function() {
					if (list.length <= 0) {
						this.dataTemp.receiveUserIds.length = 0
						this.dataTemp.receiveUserNames = ''
					}
					this.dataTemp.receiveUserIds = Array.from(list, ({
						id
					}) => id)
					let names = Array.from(list, ({
						name
					}) => name)
					if (names.length > 0) {
						this.dataTemp.receiveUserNames = names.join(',')
					}
				})
			},
			gotoSelectOrg(type) {
				uni.navigateTo({
					url: '../selectUser/selectUser?type=' + type
				})
			},
			initAuth() {
				if (RoleJS.hasRoles('user')) {
					this.hasAuth = true
				}
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 取邮件类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_receive_send_doc_type'
				}).then(res => {
					this.$nextTick(function() {
						this.flList = res.data.data
						console.log(this.flList)
					})

				})
				//取邮件级别
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_receive_send_doc_level'
				}).then(res => {
					this.$nextTick(function() {
						_this.jbList = res.data.data
					})
					//递归取子集
					// flList.forEach(item => {
					// 	let a = _this.fetchChildrenRecursive(item).then(i => {
					// 		console.log(i)
					// 		item.children = i
					// 	})
					// })
					// _this.flList = flList
					// console.log('this.flList', _this.flList)
				})
			},
			jbSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.docLevel = val.label
					this.dataTemp.docLevelCode = val.value
				})
			},
			flSelectConfirm(e) {
				var _this = this
				e.map((val, index) => {
					this.dataTemp.docType = val.label
					this.dataTemp.docTypeCode = val.value
				})
			},
			//选择图片表单中
			ChooseImage() {
				var _self = this
				uni.chooseImage({
					count: 9, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(item => {
							FileApi.uploadFileByUni(item).then(resupload => {
								console.log(resupload[1])
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
									console.log('转换', i)
									_self.imgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
									console.log(_self.imgList)
								}
							})
						})
					}
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			ViewImage(e) {
				console.log(e)
				let arr = Array.from(this.imgList, ({
					imgPath
				}) => imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			},
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
		flex-wrap: wrap;
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

	.bottombutton {
		width: 90%;
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
