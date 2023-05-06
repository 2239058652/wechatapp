<template>
	<view class="form report-viewarea">
		<u-form :model="dataTemp">
			<view class="header-index">{{dataTemp.reportTime}} 村民动态监测</view>
			<view class="title-index">非本村可疑外来人数: {{dataTemp.markedPeopleListLength}} 人</view>
			<view class="item" v-for="(item, index) in dataTemp.markedPeopleList" :key="item.id">
				<view class="left-content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="phone">{{ item.mobile }}</view>
					</view>
					<view class="bottom">{{ item.idcard }}</view>
				</view>
				<view class="right-content" @tap="handleView(item)">
					<u-icon name="eye" color="#1261d4" size="45"></u-icon>
				</view>
			</view>
			<view class="title-index">深夜外出村民人数: {{dataTemp.levaePeopleListLength}} 人</view>
			<view class="item" v-for="(item, index) in dataTemp.levaePeopleList" :key="item.id">
				<view class="left-content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="phone">{{ item.mobile }}</view>
					</view>
					<view class="bottom">{{ item.idcard }}</view>
				</view>
				<view class="right-content" @tap="handleView(item)">
					<u-icon name="eye" color="#1261d4" size="45"></u-icon>
				</view>
			</view>
			<view class="title-index">境外务工人员: {{dataTemp.overseasPeopleListLength}} 人</view>
			<view class="item" v-for="(item, index) in dataTemp.overseasPeopleList" :key="item.id">
				<view class="left-content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="phone">{{ item.mobile }}</view>
					</view>
					<view class="bottom">{{ item.idcard }}</view>
				</view>
				<view class="right-content" @tap="handleView(item)">
					<u-icon name="eye" color="#1261d4" size="45"></u-icon>
				</view>
			</view>
			<view class="title-index">有境外务工史人员: {{dataTemp.historyOverseasPeopleListLength}} 人</view>
			<view class="item" v-for="(item, index) in dataTemp.historyOverseasPeopleList" :key="item.id">
				<view class="left-content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="phone">{{ item.mobile }}</view>
					</view>
					<view class="bottom">{{ item.idcard }}</view>
				</view>
				<view class="right-content" @tap="handleView(item)">
					<u-icon name="eye" color="#1261d4" size="45"></u-icon>
				</view>
			</view>
		</u-form>
		<u-popup v-model="showPeopleDetail" mode="center" width="90%" min-height="800upx">
			<view class="form" :model="peopleDataTemp">
				<view class="people-show">人员信息</view>
				<view class="people-content">
					<text class="people-title">姓名:</text>{{ peopleDataTemp.name }}
				</view>
				<view class="people-content">
					<text class="people-title">联系方式:</text>{{ peopleDataTemp.mobile }}
				</view>
				<view class="people-content">
					<text class="people-title">身份证号:</text>{{ peopleDataTemp.idcard }}
				</view>
				<view v-if="peopleDataTemp.reason != null" class="people-content">
					<text class="people-title">外出原因:</text>{{ peopleDataTemp.reason }}
				</view>
				<view v-if="peopleDataTemp.workCase != null" class="people-content">
					<text class="people-title">务工情况:</text>{{ peopleDataTemp.workCase }}
				</view>
				<view class="upload-files">
					<view class="upload-item-media">
						<view class="bg-img" v-for="(element,index) in peopleDataTemp.imgList" :key="element.fileId" @click="ViewImage(peopleDataTemp, element)" :data-url="element">
							<view class="item">
								<image :src="element.imgPath" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import PreventionAndControlSlice from '../../../api/preventionAndControlSlice.js'
	import MapView from '../../eventhandle/mapview/mapview'
	import JsUtils from '../../../utils/index.js'
	export default {
		filters: {
			contentFilter(val) {
				if (!val) {
					return '无'
				}
				return val
			}
		},
		components: { MapView },
		data() {
			return {
				showPeopleDetail: false,
				dataTemp: {
					audioFiles: [],
					content: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					videoFiles: [],
					imageFiles: [],
				},
				imgList: [],
				videoList: [],
				peopleDataTemp: {}
			}
		},
		onLoad(option) {
			this.reportId = option.id
			this.fetchDetail()
		},
		onShow() {},
		onReady() {},
		methods: {
			//加载报送详情
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				PreventionAndControlSlice.viewBorderAreaMonitorReportDetail(_this.reportId).then(res => {
					if (res.data.code == 0) {
						_this.dataTemp = res.data.data
						_this.dataTemp.jsonGeo = {
							lat:_this.dataTemp.geometryWktY,
							lng: _this.dataTemp.geometryWktX
						}
						_this.dataTemp.markedPeopleListLength = _this.dataTemp.markedPeopleList.length
						_this.dataTemp.markedPeopleList.forEach(element => {
							this.$set(element,'imgList',[])
							element.imageFiles.forEach(item => {
								this.$set(item, 'fileType', JsUtils.getFileType(item.name))
								if (item.fileType == 'img') {
									FileApi.downloadFileByUni(item.id).then(i => {
										element.imgList.push({
											imgPath: i[1].tempFilePath,
											fileId: item.id,
											fileType: item.fileType
										})
									})
								}
							})
						})
						_this.dataTemp.levaePeopleListLength = _this.dataTemp.levaePeopleList.length
						_this.dataTemp.levaePeopleList.forEach(element => {
							this.$set(element,'imgList',[])
							element.imageFiles.forEach(item => {
								this.$set(item, 'fileType', JsUtils.getFileType(item.name))
								if (item.fileType == 'img') {
									FileApi.downloadFileByUni(item.id).then(i => {
										element.imgList.push({
											imgPath: i[1].tempFilePath,
											fileId: item.id,
											fileType: item.fileType
										})
									})
								}
							})
						})
						_this.dataTemp.overseasPeopleListLength = _this.dataTemp.overseasPeopleList.length
						_this.dataTemp.overseasPeopleList.forEach(element => {
							this.$set(element,'imgList',[])
							element.imageFiles.forEach(item => {
								this.$set(item, 'fileType', JsUtils.getFileType(item.name))
								if (item.fileType == 'img') {
									FileApi.downloadFileByUni(item.id).then(i => {
										element.imgList.push({
											imgPath: i[1].tempFilePath,
											fileId: item.id,
											fileType: item.fileType
										})
									})
								}
							})
						})
						_this.dataTemp.historyOverseasPeopleListLength = _this.dataTemp.historyOverseasPeopleList.length
						_this.dataTemp.historyOverseasPeopleList.forEach(element => {
							this.$set(element,'imgList',[])
							element.imageFiles.forEach(item => {
								this.$set(item, 'fileType', JsUtils.getFileType(item.name))
								if (item.fileType == 'img') {
									FileApi.downloadFileByUni(item.id).then(i => {
										element.imgList.push({
											imgPath: i[1].tempFilePath,
											fileId: item.id,
											fileType: item.fileType
										})
									})
								}
							})
						})
						uni.hideLoading()
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			// 查看人员信息
			handleView(item) {
				this.peopleDataTemp = item
				this.showPeopleDetail = true
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			ViewImage(e, v) {
				this.isPreview = true
				let arr = Array.from(e.imgList, ({
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
	.form {
		padding: 20upx 40upx;
	}
	.report-viewarea {
		border-radius: 15px;
		border: 1px #909399 solid;
		margin:1% 2% 2% 2%;
		min-height: 350rpx;
		color: #000000;
	}
	.header-index {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 1rem;
		font-weight: bold;
		text-align: center;
		width: 100%;
		// background-color: #ececec;
	}
	.title-index {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 0.8rem;
		font-weight: bold;
		text-align: center;
		width: 100%;
		background-color: #ececec;
		margin: 10rpx 0 10rpx 0;
	}
	.item {
		padding: 0rpx 20rpx;
		display: flex;
		width: 100%;
		.left-content {
			width: 85%;
			height: 100rpx;
			line-height: 50rpx;
			.top {
				display: flex;
				font-weight: bold;
				font-size: 1rem;
				.name {
					height: 60rpx;
					line-height: 60rpx;
					text-align: left;
				}
				.phone {
					height: 60rpx;
					line-height: 60rpx;
					text-align: left;
					margin-left: 10rpx;
				}
			}
			.bottom {
				display: flex;
				font-size: 1rem;
				justify-content: space-between;
				color: #999999;
			}
		}
		.right-content {
			width: 15%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}
	}
	.people-show {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		font-weight: 700;
		font-size: 1rem;
		text-align: center;
		margin-bottom: 2%;
	}
	.people-title {
		font-size: 0.9rem;
		font-weight: 700;
	}
	.people-content {
		font-size: 0.9rem;
		height: 60rpx;
		line-height: 60rpx;
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
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
