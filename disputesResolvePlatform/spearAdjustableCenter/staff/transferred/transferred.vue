<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<u-sticky>
			<u-tabs v-if="status == 0 || status == 1 || status == 3" 
				:is-scroll="false" :list="tabsListOne" count="cate_count" :current="tabsIndex" @change="tabsChange" />
		</u-sticky>
		<u-sticky>
			<u-tabs v-if="status == 2 || status == 4 || status == 5" 
				:is-scroll="false" :list="tabsListTwo" count="cate_count" :current="tabsIndex" @change="tabsChange" />
		</u-sticky>
		<u-sticky>
			<u-tabs v-if="status == 6" is-scroll="false"
				:is-scroll="false" :list="tabsListThree" count="cate_count" :current="tabsIndex" @change="tabsChange" />
		</u-sticky>
		<view v-if="tabsIndex==0">
			<Mediation :registId="registId" />
			<view style="margin-top: 2vh;">
				<u-button :custom-style="customStyle" type="primary" @click="handleTransfer()" :loading="buttonLoading">
					纠纷调解
				</u-button>
			</view>
			<u-action-sheet :list="actionList" v-model="actionListShow" @click="handleFlow"></u-action-sheet>
		</view>
		<!-- 调解进度 -->
		<view v-if="tabsIndex==1">
			<Progress :registId="registId" />
		</view>
		<!-- 调解材料 -->
		<view v-if="tabsIndex==2">
			<Material :registId="registId" />
		</view>
		<!-- 评价内容 -->
		<view v-if="tabsIndex==3">
			<Evaluation :registId="registId" />
		</view>
	</view>
</template>

<script>
	import Mediation from '../../comment/mediation'
	import Progress from '../../comment/progress'
	import Material from '../../comment/material'
	import Evaluation from '../../comment/evaluation'
	import DisputesResolvePlatform from '@/api/disputesResolvePlatform.js'
	
	export default {
		components: {
			Mediation,
			Progress,
			Material,
			Evaluation
		},
		data() {
			return {
				customStyle: {
					// backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				buttonLoading: false,
				registId: '',
				status: '',
				tabsIndex: 0,
				tabsListOne: [
					{name: '纠纷案件信息'},
					{name: '调解进度'}
				],
				tabsListTwo: [
					{name: '纠纷案件信息'},
					{name: '调解进度'},
					{name: '调解材料'}
				],
				tabsListThree: [
					{name: '纠纷案件信息'},
					{name: '调解进度'},
					{name: '调解材料'},
					{name: '评价信息'}
				],
				actionListShow: false,
				actionList: [
					{ text: '添加调查记录' },
					{ text: '添加证据材料'}, 
					{ text: '添加调解记录'},
					{ text: '添加调解结果' }
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
				DisputesResolvePlatform.viewMediateRegistDetail(_this.registId).then(res => {
					_this.status = res.data.data.status
				})
			},
			// 纠纷调解
			handleTransfer() {
				this.actionListShow = true
			},
			handleFlow(index) {
				var _this = this
				_this.currentFlowIndex = _this.actionList[index].text
				if (_this.currentFlowIndex == '添加证据材料') {
					uni.navigateTo({
						url: '../comment/handleAddZJCL?registId=' + _this.registId
					})
				}
				if (_this.currentFlowIndex == '添加调解记录') {
					uni.navigateTo({
						url: '../comment/handleAddTJJL?registId=' + _this.registId
					})
				}
				if (_this.currentFlowIndex == '添加调查记录') {
					uni.navigateTo({
						url: '../comment/handleAddDCJL?registId=' + _this.registId
					})
				}
				if (_this.currentFlowIndex == '添加调解结果') {
					uni.navigateTo({
						url: '../comment/handleAddXYS?registId=' + _this.registId
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
