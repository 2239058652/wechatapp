<template>
	<view class="content">
		<view class="flzx-head" />
		<view class="head-img" @click="handleToZX()">
			<view class="flzx-zxzx" />
		</view>
		<view class="head-img" @click="handleToZXList()">
			<view class="flzx-jdcx" />
		</view>
		<view class="flzx-foot" />
	</view>
</template>

<script>
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		components: {},
		data() {
			return {
				
			}
		},
		onShow() {},
		onLoad() {},
		methods: {	
			handleToZX() {
				uni.navigateTo({
					url: './index'
				})
			},
			handleToZXList() {
				uni.navigateTo({
					url: './legalAdviceList'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.flzx-head {
		// background: url("https://fangxincan.oss-cn-hangzhou.aliyuncs.com/20210527/4bdd48713f6e424ba4339b59ccaefee8-资源 31.png");
		background: url(../../../statics/img/flzx-head.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		border: 0upx;
		color: #FFFFFF;
		height: 350upx;
		margin-bottom: 120upx;
	}
	.head-img {
		padding: 20px 45px 20px 45px
	}
	.flzx-zxzx {
		background: url(../../../statics/img/flzx-zxzx.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.flzx-jdcx {
		background: url(../../../statics/img/flzx-jdcx.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.flzx-foot {
		background: url(../../../statics/img/flzx-foot.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 200rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: auto
	}
</style>
