<template>
	<view>
		<!-- 四级片长查看汇总数据 -->
		<view v-if="levelStatus === 4">
			<DailyReportsummary />
		</view>
		<!-- 三级片长查看汇总数据 -->
		<view v-if="levelStatus === 3">
			<DailyLevelThreeReportsummary />
		</view>
		<!-- 高级片长查看汇总数据 -->
		<view v-if="levelStatus === 12">
			<DailyManageReportsummary />
		</view>
	</view>
</template>

<script>
	import DailyReportsummary from '../comment/dailyReportsummary'
	import DailyLevelThreeReportsummary from '../comment/dailyLevelThreeReportsummary'
	import DailyManageReportsummary from '../comment/dailyManageReportsummary'
	export default {
		components: {
			DailyReportsummary,
			DailyLevelThreeReportsummary,
			DailyManageReportsummary
		},
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {
				levelStatus: ''
			}
		},
		onShow() {},
		onLoad() {
			let userRolesList = uni.getStorageSync('roles');
			userRolesList.forEach(item => {
				// console.log('11111111', item.id)
				if (item.id == 'border_control_org_area_4') {
					this.levelStatus = 4
				} else if (item.id == 'border_control_org_area_3') {
					this.levelStatus = 3
				} else if (item.id == 'border_control_org_area_2' || item.id == 'border_control_org_area_1') {
					this.levelStatus = 12
				}
			});
		},
		onReady() {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.index-head {
		background: url(../../../eventReport/static/img/bianjingTY.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 220rpx;
		width: 92%;
		margin: 2% 4% 0 4%;
		border-radius: 10upx;
	}
	.title-text {
		text-align: center;
		height: 160rpx;
		line-height: 160rpx;
		font-size: 1.5rem;
		color: #FFFFFF;
	}
	.index-text {
		text-align: right;
		margin-right: 2%;
		color: #FFFFFF;
	}
</style>
