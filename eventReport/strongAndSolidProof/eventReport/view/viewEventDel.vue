<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" label-width="280">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">{{dataTemp.reportTime}}情况统计</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">事件情况</view>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="text">事件总数</view>{{dataTemp.eventAll}} 人</view>
						<!-- <view class="li"><view class="text">拟偷渡入境</view>{{dataTemp.eventType01}} 人</view> -->
						<view class="li"><view class="text">拟偷渡出境</view>{{dataTemp.eventType02}} 人</view>
						<view class="li"><view class="text">偷渡入境</view>{{dataTemp.eventType03}} 人</view>
						<!-- <view class="li"><view class="text">偷渡出境</view>{{dataTemp.eventType04}} 人</view> -->
						<view class="li"><view class="text">走私</view>{{dataTemp.eventType05}} 人</view>
						<view class="li"><view class="text">贩毒</view>{{dataTemp.eventType06}} 人</view>
						<view class="li"><view class="text">其它</view>{{dataTemp.eventType07}} 人</view>
					</view>
				</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">涉案人情况</view>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="text">涉案人数</view>{{dataTemp.involvedPeopleCount}} 人</view>
						<view class="li"><view class="text">偷渡人员</view>{{dataTemp.involvedPeopleType02}} 人</view>
						<view class="li"><view class="text">引带人员</view>{{dataTemp.involvedPeopleType03}} 人</view>
						<view class="li"><view class="text">运送人员</view>{{dataTemp.involvedPeopleType04}} 人</view>
						<view class="li"><view class="text">组织人员</view>{{dataTemp.involvedPeopleType05}} 人</view>
						<view class="li"><view class="text">走私人员</view>{{dataTemp.involvedPeopleType06}} 人</view>
						<view class="li"><view class="text">贩毒人员</view>{{dataTemp.involvedPeopleType07}} 人</view>
						<view class="li"><view class="text">其它人员</view>{{dataTemp.involvedPeopleType01}} 人</view>
					</view>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				dataTemp: {
					reportTime: '',
					eventAll: '0',
					eventType01: '0',
					eventType02: '0',
					eventType03: '0',
					eventType04: '0',
					eventType05: '0',
					eventType06: '0',
					eventType07: '0',
					involvedPeopleCount: '0',
					involvedPeopleType01: '0',
					involvedPeopleType02: '0',
					involvedPeopleType03: '0',
					involvedPeopleType04: '0',
					involvedPeopleType05: '0',
					involvedPeopleType06: '0',
					involvedPeopleType07: '0'
				}
			}
		},
		watch: {},
		onLoad(option) {
			this.dataTemp.eventAll = option.eventAll
			this.dataTemp.eventType01 = option.eventType01
			this.dataTemp.eventType02 = option.eventType02
			this.dataTemp.eventType03 = option.eventType03
			this.dataTemp.eventType04 = option.eventType04
			this.dataTemp.eventType05 = option.eventType05
			this.dataTemp.eventType06 = option.eventType06
			this.dataTemp.eventType07 = option.eventType07
			this.dataTemp.involvedPeopleCount = option.involvedPeopleCount
			this.dataTemp.involvedPeopleType01 = option.involvedPeopleType01
			this.dataTemp.involvedPeopleType02 = option.involvedPeopleType02
			this.dataTemp.involvedPeopleType03 = option.involvedPeopleType03
			this.dataTemp.involvedPeopleType04 = option.involvedPeopleType04
			this.dataTemp.involvedPeopleType05 = option.involvedPeopleType05
			this.dataTemp.involvedPeopleType06 = option.involvedPeopleType06
			this.dataTemp.involvedPeopleType07 = option.involvedPeopleType07
			this.dataTemp.reportTime = option.reportTime
		},
		onShow() {},
		methods: {}
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
