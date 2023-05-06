<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<!-- 相关材料 -->
		<view>
			<!-- 相关材料 -->
			<u-card :show-head="false" style="margin-bottom: 2vh;min-height: 80vh;">
				<view class="content" slot="body" v-model="material">
					<view class="show-head-title">
						<view class="titleLeft"><u-icon name="order" color="#2979ff" size="50" />办理材料</view>
					</view>
					<view v-if="material.evidenceRecord.length == 0">
						<u-empty text="暂无相关办理材料..." mode="data"></u-empty>
					</view>
					<view v-if="material.evidenceRecord.length > 0">
						<view v-for="file in material.evidenceRecord" :key="file.id">
							<view style="margin:2vh 0 2vh 0;display: flex;width: 100%;height: 5vh;">
								<view style="width: 15%;">
									<img src="../../statics/img/wenjian.svg" mode="widthFix" style="width: 35px;height: 35px;">
								</view>
								<view style="width: 60%;">
									<view class="u-line-1" style="line-height: 3vh;color: #000000;">{{ file.name}}</view>
									<view style="line-height: 2vh;">{{ file.createdDate}}</view>
								</view>
								<view class="view-file" @click="viewFile(file)">
									查看附件
									<u-icon name="arrow-right" size="35" />
								</view>
							</view>
							<u-gap height="5" bg-color="#bbb"></u-gap>
						</view>
					</view>
				</view>
			</u-card>
		</view>
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
	import ZongZhiService from '@/api/zongZhiService.js'
	import FileApi from '@/api/fileupload.js'
	
	export default {
		props:["registId"],
		data() {
			return {
				material: {
					evidenceRecord: []
				},
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
			// this.$nextTick(() => {
			// 	this.$refs.evidenceRecordView.init()
			// })
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
				ZongZhiService.getzzfwFileList(_this.$props.registId).then(res => {
					if (res.data.code == 0) {
						// 调解材料
						_this.material.evidenceRecordList = []
						res.data.data.forEach(element => {
							_this.material.evidenceRecord.push(element)
						})
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
	.titleLeft {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		text-align: left;
		font-weight: bold;
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
