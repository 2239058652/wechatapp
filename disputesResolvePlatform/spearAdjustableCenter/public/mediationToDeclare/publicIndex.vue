<template>
	<view class="content">
		<view class="mdjf-head" />
		<view class="head-img" @click="handleToApply()">
			<view class="mdjf-zxsq" />
		</view>
		<view class="head-img" @click="handleToMediationList()">
			<view class="mdjf-jdcx" />
		</view>
		<view class="head-img" @click="handleToSearch()">
			<view class="mdjf-zxcx" />
		</view>
		<view class="mdjf-foot" />
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
			handleToApply() {
				uni.navigateTo({
					url: './index'
				})
			},
			handleToMediationList() {
				uni.navigateTo({
					url: './mediationList'
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: './linkMediate'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mdjf-head {
		background: url(../../../statics/img/mdjf-head.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		border: 0upx;
		color: #FFFFFF;
		height: 350upx;
		margin-bottom: 70upx;
	}
	.head-img {
		padding: 10px 45px 15px 45px
	}
	.mdjf-zxsq {
		background: url(../../../statics/img/mdjf-zxsq.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.mdjf-jdcx {
		background: url(../../../statics/img/mdjf-jdcx.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.mdjf-zxcx {
		background: url(../../../statics/img/mdjf-zxcx.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.mdjf-foot {
		background: url(../../../statics/img/mdjf-foot.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 220rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: auto
	}
</style>
