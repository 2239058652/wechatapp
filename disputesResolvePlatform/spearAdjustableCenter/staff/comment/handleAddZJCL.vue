<template>
	<view class="padding">
		<view>
			<u-button type="primary" :custom-style="customStyle" size="mini" @click="handleAddFile()">上传附件</u-button>
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
		<view style="margin-top: 20vh;">
			<u-button type="primary" @click="handleAddZJCL()" :loading="buttonLoading">添加证据材料</u-button>
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
				tempCBDBfiles: [],
				registId: ''
			}
		},
		watch: {},
		onLoad(option) {
			if (option.registId) {
				this.registId = option.registId
			}
		},
		onShow() {},
		methods: {
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
			handleAddZJCL() {
				var _this = this
				if (_this.tempCBDBfiles.length == 0) {
					uni.showToast({
						title: '请先添加证据材料！',
						icon: 'none'
					})
				} else {
					var oldFiles = []
					_this.tempCBDBfiles.forEach(element => {
						oldFiles.push({ id: element.fileId, name: element.fileName })
					})
					DisputesResolvePlatform.addEvidenceRecord({
						files: oldFiles,
						registrationId: _this.registId
					}).then(res => {
						if (res.data.code === 0) {
							uni.showToast({
								title: '添加纠纷调解材料成功！',
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						} else {
							uni.showToast({
								title: '添加纠纷调解材料失败: 请检查后重试',
								icon: 'none'
							})
							_this.buttonLoading = false
						}
					})
				}
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
</style>
