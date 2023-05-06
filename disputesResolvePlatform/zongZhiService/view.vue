<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<u-sticky>
			<u-tabs
				:is-scroll="true"
				:list="tabsList"
				count="cate_count"
				:current="tabsIndex"
				@change="tabsChange"
			/>
		</u-sticky>
		<!-- 综治服务办理信息 -->
		<view v-if="tabsIndex==0">
			<Mediation :registId="registId" />
		</view>
		<!-- 办理进度 -->
		<view v-if="tabsIndex==1">
			<Progress :registId="registId" />
		</view>
		<!-- 办理材料 -->
		<view v-if="tabsIndex==2">
			<Material :registId="registId" />
		</view>
		<!-- 评价内容 -->
		<view v-if="tabsIndex==3">
			<Evaluation :registId="registId" />
		</view>
		<!-- 回复信息 -->
		<view v-if="tabsIndex==4">
			<Reply :registId="registId" />
		</view>
	</view>
</template>

<script>
	import Mediation from './comment/mediation'
	import Progress from './comment/progress'
	import Material from './comment/material'
	import Evaluation from './comment/evaluation'
	import Reply from './comment/reply'
	import ZongZhiService from '@/api/zongZhiService.js'
	
	export default {
		components: {
			Mediation,
			Progress,
			Material,
			Evaluation,
			Reply
		},
		data() {
			return {
				registId: '',
				status: '',
				tabsIndex: 0,
				tabsList: [
					{name: '综治服务办理信息'},
					{name: '办理进度'},
					{name: '办理材料'},
					{name: '评价信息'},
					{name: '回复信息'}
				]
			}
		},
		watch: {},
		onLoad(option) {
			if (option.id) {
				this.registId = option.id
			}
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			// 选项卡切换
			tabsChange(index) {
				this.tabsIndex = index
			},
			// 获取案件状态信息
			fetchDetail() {
				var _this = this
				ZongZhiService.viewzzfwDetail(_this.registId).then(res => {
					console.log('1111111111', res)
					_this.status = res.data.data.status
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
