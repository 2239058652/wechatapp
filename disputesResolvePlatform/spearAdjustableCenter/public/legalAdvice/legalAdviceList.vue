<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<u-tabs
			:list="tabsList"
			:is-scroll="false"
			:offset=[5,50]
			:active-color="activeColor"
			count="cate_count"
			:current="tabsIndex"
			@change="tabsChange" />
		<!-- 待回复 -->
		<view v-if="tabsIndex==0">
			<ReceiveList />
		</view>
		<!-- 已回复待评价 -->
		<view v-if="tabsIndex==1">
			<MediationList />
		</view>
		<!-- 已完成 -->
		<view v-if="tabsIndex==2">
			<ResolvedList />
		</view>
	</view>
</template>

<script>
	import ReceiveList from './comment/receiveList'
	import MediationList from './comment/mediationList'
	import ResolvedList from './comment/resolvedList'
	export default {
		components: {
			ReceiveList,
			MediationList,
			ResolvedList
		},
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {
				tabsList: [
					{name: '待回复'},
					{name: '待评价'},
					{name: '已完成'}
				],
				tabsIndex: 0,
				activeColor: '#ff9900'
			}
		},
		onShow() {},
		onLoad() {},
		onReady() {},
		methods: {
			// 选项卡切换
			tabsChange(index) {
				if (index == 1) {
					this.activeColor = '#2979ff'
				} else if (index == 2) {
					this.activeColor = '#19be6b'
				} else {
					this.activeColor = '#ff9900'
				}
				this.tabsIndex = index
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
