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
			<view style="margin-top: 5vh;">
				<u-button type="primary" :custom-style="customStyle" @click="handleShunt()" :loading="buttonLoading">纠纷流转</u-button>
			</view>
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
			handleShunt(registId) {
				uni.navigateTo({
					url: '../comment/handleShunt?registId=' + this.registId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
