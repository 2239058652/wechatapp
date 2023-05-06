<template>
	<view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" label-width="280">
				<view class="check-title">爱国卫生专项行动检查</view>
				<view class="check-second">检查人：{{dataTemp.userName}}</view>
				<view class="check-second">检查村户：{{dataTemp.houseName}}</view>
				<view class="check-second">检查时间：{{dataTemp.createdDate}}</view>
				<view>
					<view class="head-row" style="font-weight: 700;font-size: 15px;">
						<view class="check-border" style="text-align: center;">检查项</view>
						<view class="result-border">检查结果</view>
					</view>
					<view class="first-row">
						<view class="check-border">
							一、房前屋后干净、卫生、整洁，房前不堆码柴草、杂物、建材、建渣、房屋周围沟系畅通，污水、粪水不随意排放。
						</view>
						<view v-if="dataTemp.itemA == 0 " class="result-border" style="line-height: 135upx;color: #18b566;">
							合格
						</view>
						<view v-if="dataTemp.itemA == 1 " class="result-border" style="line-height: 135upx;color: #ff9900;">
							不合格
						</view>
					</view>
					<view class="first-row">
						<view class="check-border">
							二、室内物品摆放整齐，墙壁无乱涂乱画，无果皮屑烟头，无乱堆乱放，室外无乱张帖广告、宣传画等
						</view>
						<view v-if="dataTemp.itemB == 0 " class="result-border" style="line-height: 135upx;color: #18b566;">
							合格
						</view>
						<view v-if="dataTemp.itemB == 1 " class="result-border" style="line-height: 135upx;color: #ff9900;">
							不合格
						</view>
					</view>
					<view class="second-row">
						<view class="check-border">
							三、是衣物不乱挂乱晾，生产农具规范放置室内，不乱丢乱扔。
						</view>
						<view v-if="dataTemp.itemC == 0 " class="result-border" style="line-height: 90upx;color: #18b566;">
							合格
						</view>
						<view v-if="dataTemp.itemC == 1 " class="result-border" style="line-height: 90upx;color: #ff9900;">
							不合格
						</view>
					</view>
					<view class="second-row">
						<view class="check-border">
							四、鸭猪牛羊畜牧实行圈养，不敞放，圈舍保持干净卫生，并定期消毒。
						</view>
						<view v-if="dataTemp.itemD == 0 " class="result-border" style="line-height: 90upx;color: #18b566;">
							合格
						</view>
						<view v-if="dataTemp.itemD == 1 " class="result-border" style="line-height: 90upx;color: #ff9900;">
							不合格
						</view>
					</view>
					<view class="third-row">
						<view class="check-border">
							五、垃圾入桶入箱，不乱扔乱丢。
						</view>
						<view v-if="dataTemp.itemE == 0 " class="result-border" style="line-height: 50upx;color: #18b566;">
							合格
						</view>
						<view v-if="dataTemp.itemE == 1 " class="result-border" style="line-height: 50upx;color: #ff9900;">
							不合格
						</view>
					</view>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	import PreventionAndControlSlice from '../../../api/preventionAndControlSlice.js'
	export default {
		components: {},
		data() {
			return {
				id: '',
				dataTemp: {}
			}
		},
		watch: {},
		onLoad(option) {
			if (option.id) {
				this.id = option.id
			}
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			fetchDetail() {
				var _this = this
				PreventionAndControlSlice.viewBorderSanitationReportDetail(this.id).then(res => {
					_this.dataTemp = Object.assign({}, res.data.data)
					_this.dataTemp.houseName = _this.dataTemp.house.name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		padding: 10upx 25upx;
	}
	.report-viewarea {
		border-radius: 15px;
		border: 1px #000000 solid;
		margin:1% 2% 4% 2%;
		color: #000000;
	}
	.check-title {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		width: 100%;
		font-size: 18px;
		font-weight: bold;
	}
	.check-second {
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		width: 100%;
		font-size: 0.9rem;
		display: flex;
		width: 100%;
	}
	.head-row {
		width: 100%;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		display: flex;
		border-top: 2px #000000 solid;
		border-left: 1px #000000 solid;
		border-right: 1px #000000 solid;
		border-bottom: 2px #000000 solid;
	}
	.check-border {
		text-align: left;
		width: 75%;
		border-top: 0px #000000 solid;
		border-left: 1px #000000 solid;
		border-right: 1px #000000 solid;
		border-bottom: 0px #000000 solid;
	}
	.result-border {
		width: 25%;
		text-align: center;
		border-top: 0px #000000 solid;
		border-left: 1px #000000 solid;
		border-right: 1px #000000 solid;
		border-bottom: 0px #000000 solid;
	}
	.first-row {
		width: 100%;
		display: flex;
		height: 135upx;
		line-height: 45upx;
		border-top: 0px #000000 solid;
		border-left: 1px #000000 solid;
		border-right: 1px #000000 solid;
		border-bottom: 2px #000000 solid;
	}
	.second-row {
		width: 100%;
		display: flex;
		height: 90upx;
		line-height: 45upx;
		border-top: 0px #000000 solid;
		border-left: 1px #000000 solid;
		border-right: 1px #000000 solid;
		border-bottom: 2px #000000 solid;
	}
	.third-row {
		width: 100%;
		display: flex;
		height: 50upx;
		line-height: 50upx;
		border-top: 0px #000000 solid;
		border-left: 1px #000000 solid;
		border-right: 1px #000000 solid;
		border-bottom: 2px #000000 solid;
	}
</style>
