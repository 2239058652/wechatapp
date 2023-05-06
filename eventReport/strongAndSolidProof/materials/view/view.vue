<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" label-width="280">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">
				{{dataTemp.reportTime}}
				情况统计
			</view>
			<view v-for="(item, index) in dataTemp.items" :key="item.id">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;background-color: #ececec;padding-left: 20upx;">{{ item.name }}</view>
				<view class="list-content">
					<view class="list">
						<view class="li">
							<view class="text">当前使用量</view>
							{{item.usedUnit}} {{ item.unit }}
						</view>
						<view class="li">
							<view class="text">剩余库存量</view>
							{{item.leftUnit}} {{ item.unit }}
						</view>
					</view>
				</view>
			</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	import StrongAndSolidProof from '../../../../api/strongAndSolidProof.js'
	import moment from 'moment'
	
	export default {
		components: {},
		data() {
			return {
				reportId: '',
				dataTemp: {}
			}
		},
		watch: {},
		onLoad(option) {
			this.reportId = option.id
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				StrongAndSolidProof.getMaterialReportDetail(_this.reportId).then(res => {
					if (res.data.code == 0) {
						_this.dataTemp = res.data.data
						_this.dataTemp.reportTime = moment(_this.dataTemp.createdDat).format('YYYY-MM-DD')
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.list-content {
		margin-top: 10px;
		background: #fff;
	}
	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}
		.li {
			width: 100%;
			height: 80upx;
			padding: 0 2%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;
			&.noborder {
				border-bottom: 0
			}
			.text {
				padding-left: 10upx;
				width: 88%;
				color: #666;
			}
		}
	}
</style>
