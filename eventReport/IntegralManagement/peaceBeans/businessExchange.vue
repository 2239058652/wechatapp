<template>
	<view style="background-color: #1261d4;height: 100vh;">
		<view class="jifen-head">
			<view class="bean-info">
				<view>我的平安豆</view>
				<view style="color: #1261D4;font-size: 1.4rem;">
					<image src="/eventReport/static/img/pingandou.png" style="height: 35rpx;width: 35rpx;"></image>
					{{ userInfo.reward }}
				</view>
			</view>
			<view class="qrimg">
				<tki-qrcode v-if="ifShow" cid="qrcode2" ref="qrcode2" :val="val" :size="size"
				:background="background" :foreground="foreground" :pdground="pdground" :icon="icon"
				:onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
			</view>
			<view class="count-down">
				<view style="color: #AAAAAA;">
					<u-count-down
						ref="uCountDown"
						:timestamp="timestamp"
						:show-days="false"
						:show-hours="false"
						:show-minutes="false"
						:color="'#AAAAAA'"
						@change="endTime()"
						style="margin-right: 1%;"
					/>
					秒后刷新
					<view style="color: #1261D4;" @click="manuallyRefresh()">手动刷新</view>
				</view>
				<view>本二维码仅用于平安豆兑换时出示使用。</view>
			</view>
		</view>
		<view class="my-order" @click="handleToMyOrder()">
			<u-icon name="order" color="#FFFFFF" size="45" style="margin-right: 2%;" />我的结算记录
		</view>
	</view>
</template>

<script>
	import IntegralApi from '../../../api/integral.js'
	import tkiQrcode from "../../common/components/tki-qrcode/tki-qrcode.vue"
	
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				ifShow: true,
				val: '待识别', // 要生成的二维码值
				size: 380, // 二维码大小
				unit: 'upx', // 单位
				background: '#ffffff', // 背景色
				foreground: '#000000', // 前景色
				pdground: '#000000', // 角标色
				icon: '',
				// icon: 'https://fangxincan.oss-cn-hangzhou.aliyuncs.com/20210604/a4bbd2253c234041b5d6492f65034024-exchange.png',
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '' ,// 二维码生成后的图片地址或base64
				userInfo: {},
				timestamp: 60 // 倒计时
			}
		},
		onShow() {
			this.fetchIntegral()
		},
		methods: {
			// 获取积分信息
			fetchIntegral() {
				var _this = this
				IntegralApi.getPinganJFCode().then(res => {
					console.log('1111111111', res)
					_this.userInfo = {
						reward: res.data.data.reward,
						qrVerification: res.data.data.qrVerification,
						type: res.data.data.type,
						userName: uni.getStorageSync('username'),
						userId: res.data.data.userId,
						userAccount: uni.getStorageSync('account'),
						orgName: uni.getStorageSync('org').name
					}
					_this.val = JSON.stringify(_this.userInfo)
					_this.onval = true
				})
			},
			qrR(res) {
				this.src = res
			},
			endTime() {
				var _this = this
				if (_this.$refs.uCountDown.seconds == 0) {
					uni.redirectTo({
						url: '/eventReport/IntegralManagement/peaceBeans/exchange'
					})
				}
			},
			manuallyRefresh() {
				uni.redirectTo({
					url: '/eventReport/IntegralManagement/peaceBeans/exchange'
				})
			},
			handleToMyOrder() {
				uni.navigateTo({
					url: './busineseExchangeList'
				})
			}
		}
	}
</script>

<style lang="scss">
	.jifen-head {
		background-size: 100% 100%;
		color: #000000;
		height: 800rpx;
		background-color: #FFFFFF;
		border-radius: 10px;
		margin:0 50rpx 50rpx 50rpx;
		text-align: center;
	}
	.qrimg {
		margin-top: 2vh;
		display: flex;
		justify-content: center;
	}
	.bean-info {
		border-radius: 10px 10px 0px 0px;
		font-size: 1rem;
		background-color: #ececec;
		line-height: 5vh;
		text-align: center;
	}
	.count-down {
		margin-top: 2vh;
		line-height: 4vh;
	}
	.my-order {
		width: 86%;
		margin-left: 7%;
		background-color: #007AFF;
		height: 6.5vh;
		line-height: 6.5vh;
		border-radius: 10rpx;
		text-align: center;
		font-size: 1rem;
		color: #FFFFFF;
	}
</style>
