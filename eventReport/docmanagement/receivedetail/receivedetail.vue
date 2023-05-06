<template>
	<view>
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent==0" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140">
				<u-form-item :required="true" label="标题:" prop="title">
					{{dataTemp.document.title}}
				</u-form-item>
				<u-form-item :required="true" :label="type=='person'?'发件人':'发件单位'" prop="receiveUserIds">
					{{dataTemp.document.sendOrgName}}
				</u-form-item>
				<u-form-item :required="true" label="发件时间" prop="receiveUserIds">
					{{dataTemp.document.sendTime}}
				</u-form-item>
				<u-form-item :required="true" label="邮件类型:" prop="docType">
					{{dataTemp.document.docType}}
				</u-form-item>
				<u-form-item :required="true" label="邮件级别:" prop="docLevel">
					{{dataTemp.document.docLevel}}
				</u-form-item>
				<u-form-item :required="true" label="内容:" prop="content">
					{{dataTemp.document.content}}
				</u-form-item>
				<u-form-item label="附件">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view> -->
							</view>
							<view v-if="dataTemp.document.files.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有附件" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="padding-lr">
			<u-button v-if="dataTemp.signedStatus!=0" type="success" @click="handleSign" :loading="buttonLoading">签收</u-button>
		</view>
		<view v-if="sectionCurrent==1" class="form">
			<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
				<block v-for="(item,index) in userList" :key="index">
					<!-- <view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name" @tap="selectedOrg(item)"> -->
					<view :class="'indexItem-' + item.signedUserName" :id="'indexes-' + item.signedUserName" :data-index="item.signedUserName">
						<view class="cu-list menu padding-xs">
							<view class="cu-item avatar listitem">
								<!-- <u-checkbox @change="checkboxChange(item)" v-model="item.checkstatus" :key="index" :name="item.name"></u-checkbox> -->
								<!-- <view class="cu-avatar round lg bg-blue" style="font-size: 1em;">{{item.name.substr(item.name.length-2,2)}}</view> -->
								<view class="content">
									<view class="text-black"><text class="text-abc">{{item.signedUserName}}</text></view>
									<view class="text-gray text-sm">
										{{item.receiveOrgName}}
									</view>
								</view>
								<view class="action">
									{{item.signedStatusDesc}}
								</view>
								<!-- <view v-if="item.havingChild==0" class="action" @click="handelChild(item)">
									<u-icon name="arrow-down-fill" color="#2979ff" size="28" label="下级" label-color="#2979ff"></u-icon>
								</view>
								<view v-if="item.havingChild==1" class="action">
									<u-icon v-if="item.havingChild==1" name="minus-circle" color="#c8c9cc" size="28" label="无下级" label-color="#c8c9cc"></u-icon>
								</view> -->
							</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import DocApi from '../../../api/docmanagement.js'
	import RoleJS from '../../../utils/role.js'
	import moment from 'moment'
	export default {
		filters: {
			contentFilter(val) {
				if (!val) {
					return '无'
				}
				return val
			}
		},
		components: {

		},
		data() {
			return {
				buttonLoading: false,
				userList: [],
				sectionCurrent: 0,
				tabsList: [{
					name: '邮件详情'
				}],
				dataTemp: {
					document: {
						files: []
					},
					title: '',
					content: '',
					docLevel: '',
					docLevelCode: '',
					eventLevelCode: '',
					docType: '',
					docTypeCode: '',
					fileIds: [],
					files: [],
					receiveUserIds: [],
					receiveUserNames: '', //接收人名称
					receiveOrgIds: [],
					receiveOrgNames: '' //接收组织名称
				},
				departmentList: [],
				imgList: [],
				timeQuery: {
					eventId: '',
					sort: 0
				},
				id: '',
				type: ''
			}
		},
		onLoad(option) {
			console.log(option)
			this.id = option.id
			this.type = option.type
			this.fetchDetail()
			this.fetchReceiveList()
		},
		onShow() {

		},
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
			// this.$refs.uFormJB.setRules(this.rulesJB);

		},
		methods: {
			handleSign() {
				this.buttonLoading = true
				if (this.type == 'person') {
					DocApi.signDocPersonal(this.id).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: '签收成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../inboxlist/inboxlist'
								})

							}, 1500)
						}
						this.buttonLoading=false
					})
				} else {
					DocApi.signDocOrg(this.id).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: '签收成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../inboxlist/inboxlist'
								})

							}, 1500)
						}
						this.buttonLoading=false
					})
				}
			},
			// ViewImage(e) {
			// 	uni.previewImage({
			// 		urls: this.imgList,
			// 		current: e.currentTarget.dataset.url
			// 	});
			// },
			ViewImage(e) {
				let arr=Array.from(this.imgList,({imgPath})=>imgPath)
				uni.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			//加载邮件详情
			fetchDetail() {
				var _this = this

				uni.showLoading({
					title: '读取中',
				})
				// 读个人发文详情
				if (this.type == 'person') {
					DocApi.getDocInDetailPersonal(this.id).then(res => {
						this.$nextTick(function() {
							Object.assign(this.dataTemp, res.data.data)
							this.dataTemp.document.files.forEach(item => {
								FileApi.downloadFileByUni(item.id).then(i => {
									_this.imgList.push({
										imgPath: i[1].tempFilePath,
										fileId: i[1].id
									})
								})
							})
						})
						uni.hideLoading()
					})
				} else {
					DocApi.getDocInDetailOrg(this.id).then(res => {
						this.$nextTick(function() {
							Object.assign(this.dataTemp, res.data.data)
							this.dataTemp.files.forEach(item => {
								FileApi.downloadFileByUni(item.id).then(i => {
									_this.imgList.push({
										imgPath: i[1].tempFilePath,
										fileId: i[1].id
									})
								})
							})
						})
						uni.hideLoading()
					})
				}
			},
			fetchReceiveList() {
				let query = {
					id: this.id
				}
				if (this.type == 'person') {
					DocApi.getDocReceiveListPersonal(query).then(res => {
						this.userList = res.data.data.content
					})
				} else {
					DocApi.getDocReceiveListOrg(query).then(res => {
						this.userList = res.data.data.content
					})
				}

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

	.button {
		width: 70%;
		margin: 0 auto;
	}

	.actionPopup {
		padding: 20upx;
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

	.listitem {
		border-bottom: #F1F1F1 1upx solid;
	}
</style>
