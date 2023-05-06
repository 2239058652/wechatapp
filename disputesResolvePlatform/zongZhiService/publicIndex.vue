<template>
	<view class="content">
		<view class="zzfw-head" />
		<view class="head-img" @click="handleToServiceReport()">
			<view class="zzfw-zxtb" />
		</view>
		<view class="head-img" @click="handleToServiceList()">
			<view class="zzfw-jdcx" />
		</view>
		<view class="head-img" @click="handleToSearch()">
			<view class="zzfw-zxcx" />
		</view>
		<view class="zzfw-foot" />
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
			handleToServiceReport() {
				uni.navigateTo({
					url: './serviceReport'
				})
			},
			handleToServiceList() {
				uni.navigateTo({
					url: './myServiceList'
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: './linkService'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.zzfw-head {
		background: url(../statics/img/zzfw-head.png);
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
	.zzfw-zxtb {
		background: url(../statics/img/zzfw-zxtb.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.zzfw-jdcx {
		background: url(../statics/img/zzfw-jdcx.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.zzfw-zxcx {
		background: url(../statics/img/zzfw-zxch.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		height: 150rpx;
		width: 100%;
	}
	.zzfw-foot {
		background: url(../statics/img/zzfw-foot.png);
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
