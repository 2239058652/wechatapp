<template>
	<view style="background-color: #ececec;">
		<!-- 综治服务办理信息 -->
		<view v-if="showData">
			<u-card :show-head="false" style="margin-bottom: 2vh;min-height: 900rpx;">
				<view class="content" slot="body">
					<view class="show-head-title">
						<view class="titleLeft"><u-icon name="bookmark" color="#2979ff" size="50" />综治服务办理信息</view>
					</view>
					<view class="show-body">
						<view class="u-flex u-row-between bodyTop">
							<view>服务编号:</view><view class="body-content"> {{ dataTemp.registNo }}</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>发生地:</view><view class="body-content u-line-1"> {{ dataTemp.address }}</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>申报人:</view><view class="body-content"> {{ dataTemp.linkman }}</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>联系电话:</view><view class="body-content"> {{ dataTemp.mobile }}</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>服务类型:</view>
							<view>
								<u-tag :text="dataTemp.type.text" type="primary" />
							</view>
						</view>
						<view class="u-flex u-row-between bodyTop">
							<view>紧急程度:</view>
							<view>
								<u-tag
									:text="dataTemp.emergencyLevelDesc"
									:type="dataTemp.emergencyLevelDesc == '一般' ?'info':dataTemp.emergencyLevelDesc == '紧急' ?'warning':'error'"
								/>
							</view>
						</view>
						<view class="bodyTop">简要情况:<view class="content-show">{{ dataTemp.briefContent }}</view></view>
						<view class="qrimg">
							<tki-qrcode cid="qrcode2" ref="qrcode2" :val="val" :size="size"
							:background="background" :foreground="foreground" :pdground="pdground" :icon="icon"
							:onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
						</view>
					</view>
				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
	import ZongZhiService from '@/api/zongZhiService.js'
	import JsUtils from '../../../utils/index.js'
	import FileApi from '../../../api/fileupload.js'
	import tkiQrcode from '../../common/components/tki-qrcode/tki-qrcode.vue'
	
	export default {
		props:["registId"],
		components: {
			tkiQrcode
		},
		data() {
			return {
				partiesShow: false,
				dataTemp: {},
				imgList: [],
				showData: false,
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
				src: '', // 二维码生成后的图片地址或base64
				serviceInfo: {}
			}
		},
		watch: {},
		created() {
			// 获取openId
			this.openId = uni.getStorageSync('openId')
			// #ifdef MP-WEIXIN
			if (!this.openId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
		},
		mounted() {
			this.fetchDetail()
		},
		methods: {
			// 获取调解基础信息
			async fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				let openid = uni.getStorageSync('openId')
				ZongZhiService.viewzzfwDetail(this.$props.registId).then(res => {
					if (res.data.code == 0) {
						this.$nextTick(function() {
							_this.dataTemp = res.data.data
							_this.serviceInfo = {
								linkman: _this.dataTemp.linkman,
								type: 2,
								registrationId: _this.dataTemp.id,
								serviceNo: _this.dataTemp.registNo,
								shareOpenid: openid
							}
							_this.val = JSON.stringify(_this.serviceInfo)
						})
						setTimeout(function() {
							uni.hideLoading()
							_this.showData = true
						}, 1500)
					}
				})
			},
			qrR(res) {
				this.src = res
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
			display: flex;
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
			}
		}
		.body-content{
			font-weight: 100;
		}
	}
	.qrimg {
		margin-top: 2vh;
		display: flex;
		justify-content: center;
	}
</style>
