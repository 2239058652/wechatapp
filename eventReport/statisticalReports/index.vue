<template>
	<view>
		<u-tabs :list="tabsList" :is-scroll="true" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<view v-show="tabsIndex == 0">
			<Login />
		</view>
		<view v-show="tabsIndex == 1">
			<EventReport />
		</view>
		<view v-show="tabsIndex == 2">
			<WorkReport />
		</view>
	</view>
</template>

<script>
	import Login from './components/login'
	import EventReport from './components/eventReport'
	import WorkReport from './components/workReport'
	export default {
		components: {
			Login,
			EventReport,
			WorkReport
		},
		data() {
			return {
				tabsList: [
					{ name: '登陆情况' },
					{ name: '问题隐患报送情况' },
					{ name: '工作情况上报情况' }
				],
				tabsIndex: 0
			}
		},
		methods: {
			tabsChange(index) {
				this.tabsIndex = index
			}
		}
	}
</script>

<style>
</style>
