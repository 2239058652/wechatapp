<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" label-width="280">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;font-weight: bold;">{{dataTemp.reportTime}}户长日报</view>
				<view style="width: 100%;text-align: center;">
					{{dataTemp.orgName}}——{{dataTemp.userName}}于{{dataTemp.createdDate}}填报
				</view>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="text">出勤人数</view>{{dataTemp.attendance}} 人</view>
						<view class="li"><view class="text">巡逻次数</view>{{dataTemp.patrolTimes}} 次</view>
						<view class="li"><view class="text">核查人员</view>{{dataTemp.peopleNumber}} 人</view>
						<view class="li"><view class="text">核查车辆</view>{{dataTemp.carNumber}} 辆</view>
						<view class="li"><view class="text">入户走访</view>{{dataTemp.houseVsit}} 户</view>
						<view class="li"><view class="text">宣传教育</view>{{dataTemp.publicityAndEducation}} 人</view>
						<view class="li"><view class="text">发放宣传手册</view>{{dataTemp.providePublicityBrochure}} 份</view>
						<view class="li"><view class="text">张贴通告</view>{{dataTemp.pasteBulletin}} 份</view>
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
				PreventionAndControlSlice.viewHouseholderReportDetail(this.id).then(res => {
					_this.dataTemp = Object.assign({}, res.data.data)
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
