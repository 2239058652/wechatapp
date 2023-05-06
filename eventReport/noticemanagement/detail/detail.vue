<template>
	<view>
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent==0" class="form">
			<u-form v-if="type=='receive'" :model="dataTemp" ref="uForm" label-width="140">
				<u-form-item :required="true" label="标题:" prop="title">
					{{dataTemp.notify.title}}
				</u-form-item>
				<!-- <u-form-item :required="true" label="收件人" prop="receiveUserIds">

				</u-form-item> -->
				<u-form-item :required="true" label="发送机构:" prop="sendOrgName">
					{{dataTemp.notify.sendOrgName}}
				</u-form-item>
				<u-form-item :required="true" label="发送时间:" prop="sendTime">
					{{dataTemp.notify.sendTime}}
				</u-form-item>
				<u-form-item :required="true" label="通知级别:" prop="notifyLevel">
					{{dataTemp.notify.notifyLevel}}
				</u-form-item>
				<u-form-item :required="true" label="内容:" prop="content">
					{{dataTemp.notify.content}}
				</u-form-item>
				<u-form-item :required="true" label="状态:" prop="content">
					{{dataTemp.openedStatusDesc}}
				</u-form-item>
				<u-form-item v-if="dataTemp.openedStatus==0" label="接收人" prop="content">
					<view class="">
						{{dataTemp.openedUserName}} （{{dataTemp.openedTime}})
					</view>
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
							<view v-if="dataTemp.notify.files.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有附件" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
			<u-form v-else :model="dataTemp" ref="uForm" label-width="140">
				<u-form-item :required="true" label="标题:" prop="title">
					{{dataTemp.title}}
				</u-form-item>
				<!-- <u-form-item :required="true" label="收件人" prop="receiveUserIds">
			
				</u-form-item> -->
				<u-form-item :required="true" label="发送机构:" prop="sendOrgName">
					{{dataTemp.sendOrgName}}
				</u-form-item>
				<u-form-item :required="true" label="发送时间:" prop="sendTime">
					{{dataTemp.sendTime}}
				</u-form-item>
				<u-form-item :required="true" label="通知级别:" prop="notifyLevel">
					{{dataTemp.notifyLevel}}
				</u-form-item>
				<u-form-item :required="true" label="内容:" prop="content">
					{{dataTemp.content}}
				</u-form-item>
				<u-form-item :required="true" label="发送数:" prop="content">
					{{dataTemp.sendCount}}(已读：{{dataTemp.openedCount}}; 未读：{{dataTemp.unOpenedCount}})
				</u-form-item>
				<!-- <u-form-item v-if="dataTemp.openedStatus==0" label="接收人" prop="content">
					<view class="">
						{{dataTemp.openedUserName}}（{{dataTemp.openedTime}})
					</view>
				</u-form-item> -->
				<u-form-item label="附件">
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								<image :src="imgList[index].imgPath" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
									<text class='cuIcon-close'></text>
								</view> -->
							</view>
							<view v-if="dataTemp.files.length<=0" class="solids uploadIcon">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="没有附件" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view v-if="sectionCurrent==1" class="form">
			<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
				<block v-for="(item,index) in userList" :key="index">
					<view :class="'indexItem-' + item.signedUserName" :id="'indexes-' + item.signedUserName" :data-index="item.signedUserName">
						<view class="cu-list menu padding-xs">
							<view class="cu-item avatar listitem">
								<view class="content">
									<view class="text-black"><text class="text-abc">{{item.receiveOrgName}}</text></view>
									<view class="text-gray text-sm">
										接收人：{{item.openedUserName}}
									</view>
									<view v-if="item.openedStatus==0" class="text-gray text-sm">
										打开时间：{{item.openedTime}}
									</view>
								</view>
								<view class="action">
									<view class="">
										{{item.openedStatusDesc}}
									</view>

								</view>
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
	import NoticeApi from '../../../api/noticemanagement.js'
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
				userList: [],
				sectionCurrent: 0,
				tabsList: [{
					name: '通知详情'
				}],
				dataTemp: {
					notify: {
						title: '',
						content: '',
						notifyLevel: '',
						notifyLevelCode: '',
						fileIds: [],
						files: [],
						receiveUserIds: [],
						receiveUserNames: '', //接收人名称
						receiveOrgIds: [],
						receiveOrgNames: '' //接收组织名称
					},
					files: []
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
			if (this.type == 'send') {
				this.tabsList = [{
					name: '通知详情'
				}, {
					name: '已读情况'
				}]
			}
		},
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
			// this.$refs.uFormJB.setRules(this.rulesJB);

		},
		methods: {
			ViewImage(e) {
				// uni.previewImage({
				// 	urls: this.imgList,
				// 	current: e.currentTarget.dataset.url
				// });
				console.log('sssss', e)
				uni.openDocument({
					filePath: e.currentTarget.dataset.url.imgPath,
					success: function(res) {
						console.log('打开文档成功', res);
					},
					fail: function(res) {
						console.log('fail', res)
					},
					complete: function(res) {
						console.log('complete', res)
					}
				});
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			//加载通知详情
			fetchDetail() {
				var _this = this

				uni.showLoading({
					title: '读取中',
				})
				// 读收到的通知详情
				if (this.type == 'receive') {
					NoticeApi.getNoticeReceiveDetail(this.id).then(res => {
						this.$nextTick(function() {
							console.log(res)
							Object.assign(this.dataTemp, res.data.data)
							this.dataTemp.notify.files.forEach(item => {
								FileApi.downloadFileByUni(item.id).then(i => {
									console.log('file', i)
									_this.imgList.push({
										imgPath: i[1].tempFilePath,
										fileId: i[1].id
									})
								})
							})
							// 处理已阅
							if (this.dataTemp.openedStatus != 0) {
								NoticeApi.openNotice(this.id).then(res => {
									console.log('已读', res)
								})
							}
						})
						uni.hideLoading()
					})
				} else {
					//读取发出的通知详情
					NoticeApi.getNoticeSendDetail(this.id).then(res => {
						this.$nextTick(function() {
							console.log('send111', res)
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
				NoticeApi.getNoticeOpenedList(query).then(res => {
					console.log('aaa', res)
					this.userList = res.data.data.content
				})
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
