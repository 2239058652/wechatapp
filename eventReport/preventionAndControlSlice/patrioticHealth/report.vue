<template>
	<view>
		<view class="index-head">
			<view class="title-text">爱国卫生</view>
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的填报" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<view>
			<PatrioticHealth />
		</view>
	</view>
</template>

<script>
	import PatrioticHealth from '../comment/patrioticHealth'
	export default {
		components: {
			PatrioticHealth
		},
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {}
		},
		onShow() {},
		onLoad() {},
		onReady() {},
		methods: {
			handleGoToList() {
				uni.navigateTo({
					url: '/eventReport/preventionAndControlSlice/patrioticHealth/reportList'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-head {
		background: url(../../../eventReport/static/img/bianjingTY.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 220rpx;
		width: 92%;
		margin: 2% 4% 0 4%;
		border-radius: 10upx;
	}
	.title-text {
		text-align: center;
		height: 160rpx;
		line-height: 160rpx;
		font-size: 1.5rem;
		color: #FFFFFF;
	}
	.index-text {
		text-align: right;
		margin-right: 2%;
		color: #FFFFFF;
	}
</style>
