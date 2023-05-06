<template>
	<view>
		<!-- 四级片长查看案件数据 -->
		<view v-if="levelStatus === 4">
			<LevelFourEventSummary />
		</view>
		<!-- 高级片长查看案件汇总数据 -->
		<view v-if="levelStatus === 123">
			<HighLevelEventSummary />
		</view>
	</view>
</template>

<script>
	import LevelFourEventSummary from '../comment/levelFourEventSummary'
	import HighLevelEventSummary from '../comment/highLevelEventSummary'
	export default {
		components: {
			LevelFourEventSummary,
			HighLevelEventSummary
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
				} else if (item.id == 'border_control_org_area_3' || item.id == 'border_control_org_area_2' || item.id == 'border_control_org_area_1') {
					this.levelStatus = 123
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
