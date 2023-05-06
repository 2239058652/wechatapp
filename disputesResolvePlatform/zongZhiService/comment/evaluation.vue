<template>
	<view style="background-color: #ececec;height: 100vh;">
		<!-- 评价信息 -->
		<view>
			<u-card :show-head="false" style="margin-bottom: 2vh;min-height: 800rpx;">
				<view class="content" slot="body">
					<view class="show-head-title">
						<view class="titleLeft"><u-icon name="integral" color="#2979ff" size="50" />评价信息</view>
					</view>
					<view v-if="evaluaStatus === 1" class="show-body">
						暂无评价信息
					</view>
					<view v-if="evaluaStatus === 0" class="show-body">
						<view class="bodyTop">评价时间: {{ dataTemp.createdDate }}</view>
						<view class="bodyTop">评价星级:
							<u-rate active-color="#ff9900" :count="dataTemp.star" v-model="star"></u-rate>
						</view>
						<view class="bodyTop">评价内容:
						<view class="content-show">
							{{ dataTemp.content }}
						</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
	import ZongZhiService from '@/api/zongZhiService.js'
	
	export default {
		props:["registId"],
		data() {
			return {
				evaluaStatus: 1,
				count: 5,
				value: 5,
				star: 5,
				dataTemp: {},
				tabsIndex: 0,
				status: '',
				id: ''
			}
		},
		watch: {},
		created() {
			// this.fetchDetail()
		},
		mounted() {
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			// 获取调解基础信息
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				ZongZhiService.viewzzfwRegist(_this.$props.registId).then(res => {
					if (res.data.code == 0) {
						if (res.data.data !== null) {
							_this.evaluaStatus = 0
							_this.dataTemp = Object.assign({}, res.data.data)
						} else {
							_this.evaluaStatus = 1
						}
						uni.hideLoading()
					} else {
						uni.showToast({
							title: '查询失败请稍后重试。',
							icon: 'none'
						})
					}
				})
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
				font-weight: 100;
			}
		}
	}
</style>
