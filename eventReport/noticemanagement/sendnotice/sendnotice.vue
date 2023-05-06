<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item :required="true" label="标题" prop="title">
					<u-input v-model="dataTemp.title" type="text" :border="true" />
				</u-form-item>
				<u-form-item :required="true" label="接收机构" prop="receiveOrgIds">
					<u-input type="textarea" :border="true" :height="95" :auto-height="true"
						v-model="dataTemp.receiveOrgNames" placeholder="请选择接收机构"
						@click="gotoSelectOrg('org')">
					</u-input>
				</u-form-item>
				<u-form-item :required="true" label="通知级别" prop="notifyLevel">
					<u-input type="select" :select-open="jbSelectShow" :border="true" v-model="dataTemp.notifyLevel" placeholder="请选择通知级别"
					 @click="jbSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="jbList" v-model="jbSelectShow"
					 @confirm="jbSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item :required="true" label="内容" prop="content">
					<u-input v-model="dataTemp.content" type="textarea" height="150" :border="true" placeholder="请填写通知内容" />
				</u-form-item>
				<u-form-item label="附件">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="ChooseImage">
								<!-- <text class='cuIcon-cameraadd'></text> -->
								<!-- <view class="text-xs text-grey uploadText">上传照片</view> -->
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
	import NoticeApi from '../../../api/noticemanagement.js'
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
					notifyLevel: '',
					notifyLevelCode: '',
					fileIds: [],
					receiveOrgIds: [],
					receiveOrgNames: '' //接收组织名称
				},
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
						message: '请填写通知标题',
						trigger: ['change', 'blur'],
					}],
					receiveOrgIds: [{
						required: true,
						message: '请选择接收机构',
						trigger: 'change',
						type: 'array'
					}],
					notifyLevel: [{
						required: true,
						message: '请选择通知级别',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写通知内容',
						trigger: 'change'
					}],
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
			}
		},
		onShow() {
			uni.$on('selectedOrg', (org) => {
				this.setSelectedOrg(org)
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
					this.buttonLoading = true
					if (!valid) {
						this.buttonLoading = false
						return
					}
					this.buttonLoading = true
					NoticeApi.sendNotice(this.dataTemp).then(res => {
						console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: '发送成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../list/list'
								})

							}, 1500)
							this.buttonLoading = false
						} else {
							uni.showToast({
								title: '发送失败' + res.desc,
								icon: 'none'
							})
							_this.buttonLoading = false
						}
					})
				})
			},
			setSelectedOrg(OrgList) {
				this.$nextTick(function() {
					if (OrgList.length <= 0) {
						this.dataTemp.receiveOrgIds.length = 0
						this.dataTemp.receiveOrgNames = ''
					}
					this.dataTemp.receiveOrgIds = Array.from(OrgList, ({
						id
					}) => id)
					let names = Array.from(OrgList, ({
						name
					}) => name)
					if (names.length > 0) {
						this.dataTemp.receiveOrgNames = names.join(',')
					}
				})
			},
			gotoSelectOrg(type) {
				uni.navigateTo({
					url: '../selectOrg/selectOrg?type=' + type
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
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
					this.dataTemp.notifyLevel = val.label
					this.dataTemp.notifyLevelCode = val.value
				})
			},
			flSelectConfirm(e) {
				var _this = this
				e.map((val, index) => {
					// this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
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
						// if (this.imgList.length != 0) {
						// 	this.imgList = this.imgList.concat(res.tempFilePaths)
						// } else {
						// 	this.imgList = res.tempFilePaths
						// }
						console.log('选择的图片', res)


					}
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
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
