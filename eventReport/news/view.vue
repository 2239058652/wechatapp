<template>
	<view class="infoContent">
		<view class="title">
			{{dataTemp.title}}
		</view>
		<view class="subtitle">
			发布单位：{{dataTemp.organizationName}}
		</view>
		<!-- <view class="subtitle">
			发布人：{{dataTemp.publisher}}
		</view> -->
		<view class="subtitle">
			发布时间：{{dataTemp.publishTime}}
		</view>
		<view class="content">
			<u-parse :html="dataTemp.content"></u-parse>
		</view>
		<view class="footer">
			<view class="">
				阅读<u-icon name="eye" /> {{dataTemp.viewNum}}
			</view>
		</view>
	</view>
</template>

<script>
	import InfomationApi from '../../api/infomation.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){
			return {
				from:"menu"
			}
		},
		data() {
			return {
				id: '',
				dataTemp: {}
			}
		},
		onLoad(option) {
			if (option.id) {
				this.id = option.id
			}
			this.fetchDetail()
		},
		methods: {
			fetchDetail() {
				uni.showLoading({
					title: '加载中...'
				})
				InfomationApi.getInfomationDetail(this.id).then(res => {
					this.$nextTick(function() {
						this.dataTemp = Object.assign({}, res.data.data)
						uni.hideLoading()
					})

				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.infoContent {
		padding: 20upx;
	}
	.title {
		font-size: 1.15em;
		text-align: left;
		padding: 10upx 0upx 20upx 0px;
		font-weight: bolder;
	}
	.subtitle {
		text-align: left;
		color: #979797;
		padding-top: 15upx;
		padding-bottom: 25upx;
		font-size: 0.8em;
		// border-bottom:#F1F1F1 1upx solid;
	}

	.content {
		padding: 25upx 0upx;
	}

	.footer {
		color: #979797;
		display: flex;
		justify-content: space-between;
	}
</style>
