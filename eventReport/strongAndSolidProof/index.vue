<template>
	<view>
		<view class="index-head">
			<view class="title-text">点长日报</view>
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的填报" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<u-tabs :list="tabsList" :is-scroll="false" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<!-- 无事报平安 -->
		<view v-if="tabsIndex==0">
			<DailyReport />
		</view>
		<!-- 有事报事 -->
		<view v-if="tabsIndex==1">
			<EventReport />
		</view>
	</view>
</template>

<script>
	import DailyReport from './comment/dailyReport'
	import EventReport from './comment/eventReport'
	export default {
		components: {
			DailyReport,
			EventReport
		},
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {
				tabsList: [
					{name: '无事报平安'},
					{name: '有事报事'}
				],
				tabsIndex: 0
			}
		},
		onShow() {},
		onLoad() {},
		onReady() {},
		methods: {
			// 选项卡切换
			tabsChange(index) {
				this.tabsIndex = index
			},
			handleGoToList() {
				uni.navigateTo({
					url: '/eventReport/strongAndSolidProof/list/list'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-head {
		background: url(../../eventReport/static/img/bianjingTY.png);
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
