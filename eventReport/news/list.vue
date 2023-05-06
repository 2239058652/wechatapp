<template>
	<view class="u-skeleton" style="padding: 25rpx;">
		<view class="u-skeleton-rect" style="margin: 1%;">
			<swiper class="screen-swiper square-dot"
				:indicator-dots="true"
				:circular="true"
				:autoplay="true"
				interval="3000"
				duration="300"
			>
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<u-image width="100%" height="100%" :src="item.suoLueTu"></u-image>
				</swiper-item>
			</swiper>
		</view>
		<view class="info-list" style="margin: 1%;">
			<view v-for="(item,index) in infoList" :key="index" class="item" @click="handleDetail(item.id)">
				<view style="width: 100%;display: flex;">
					<view>
						<u-image width="110" height="110" :src="item.suoLueTu"></u-image>
					</view>
					<view class="info-item-left" style="margin-left: 5%;">
						<view class="title ">
							{{item.title}}
						</view>
						<view class="datetime text-sm text-grey">
							{{item.publishTime}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="infoList.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="暂无新资讯" mode="data"></u-empty>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import InfomationApi from '../../api/infomation.js'
	import FileApi from '../../api/fileupload.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				listQuery: {
					status: 1
				},
				infoList: [{
					title: '占位占位占位占位占位占位占位'
				}, {
					title: '占位占位占位占位占位占位占位'
				}, {
					title: '占位占位占位占位占位占位占位'
				}],
				swiperList: [],
				loading: false
			}
		},
		onLoad() {
			this.fetchList()
		},
		methods: {
			fetchList() {
				this.loading = true
				//读信息列表
				uni.showLoading({
					title: '加载中...'
				})
				InfomationApi.getInfomationList(this.listQuery).then(res => {
					this.infoList = res.data.data.content
					this.infoList.forEach(item => {
						FileApi.downloadFileByUni(item.suoLueTu).then(imgres => {
							item.suoLueTu = imgres[1].tempFilePath
						})
						uni.hideLoading()
					})
					this.loading = false
				})
				//读轮播图
				InfomationApi.getInfomationCarousel().then(res => {
					this.swiperList = res.data.data.content
					this.swiperList.forEach(item => {
						FileApi.downloadFileByUni(item.suoLueTu).then(imgres => {
							item.suoLueTu = imgres[1].tempFilePath
						})
					})
				})
			},
			handleDetail(id) {
				uni.navigateTo({
					url: './view?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-list {
		border-bottom: #F1F1F1 2upx solid;
		.item {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0 0 0;
			border-bottom: #F1F1F1 1upx solid;
		}
		.info-item-left {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			.title {
				font-family: Georgia, 'Times New Roman', Times, serif;
				font-size: 1rem;
				color: #000000;
			}
			.datetime {
				padding-top: 20upx;
			}
		}
	}
</style>
