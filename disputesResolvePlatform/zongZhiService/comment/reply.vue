<template>
	<view style="background-color: #ececec;height: 100vh;">
		<!-- 评价信息 -->
		<view>
			<u-card :show-head="false" style="margin-bottom: 2vh;min-height: 800rpx;">
				<view class="content" slot="body">
					<view class="show-head-title">
						<view class="titleLeft"><u-icon name="chat" color="#2979ff" size="50" />回复信息</view>
					</view>
					<view v-if="replyStatus === 1" class="show-body">
						暂无回复信息
					</view>
					<view v-if="replyStatus === 0" class="show-body">
						<view class="bodyTop">回复时间: {{ dataTemp.createdDate }}</view>
						<view class="bodyTop">回复机构: {{ dataTemp.orgName }}</view>
						<view class="bodyTop">操作人: {{ dataTemp.userName }}</view>
						<view class="bodyTop">回复内容:
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
				replyStatus: 1,
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
				ZongZhiService.viewzzfwReply(_this.$props.registId).then(res => {
					console.log('111111', res)
					if (res.data.code == 0) {
						if (res.data.data.length > 0) {
							_this.replyStatus = 0
							_this.dataTemp = Object.assign({}, res.data.data[0])
						} else {
							_this.replyStatus = 1
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
