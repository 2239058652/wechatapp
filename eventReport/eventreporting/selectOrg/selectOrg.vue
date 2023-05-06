<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input class="placeholder-align" type="text" placeholder="请输入单位名称" confirm-type="search" @input="search"></input>
			</view>
		</view>
		<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,index) in list" :key="index">
				<!-- <view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name" @tap="selectedOrg(item)"> -->
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view class="cu-list menu padding-xs">
						<view class="cu-item">
							<!-- <view class="cu-avatar round lg bg-blue" style="font-size: 1em;">{{item.name.substr(item.name.length-2,2)}}</view> -->
							<u-checkbox @change="checkboxChange(item)" v-model="item.status" :key="index" :name="item.name"></u-checkbox>
							<view class="content">
								<view class="text-black"><text class="text-abc">{{item.name}}</text></view>
								<view class="text-gray text-sm">
									{{item.propertiesDesc}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<u-button type="primary" @click="selectedOrg">确定</u-button>
	</view>
</template>

<script>
	import OrgApi from '../../../api/eventhandle.js'
	export default {
		data() {
			return {
				listUserID: '',
				list: [],
				listUser: [],
				searchContent: '',
				listQuery: {
					name: ''
				},
				type: '',
				selectedList: []
			};
		},
		onLoad(options) {
			this.type = options.type
			console.log('this.type', this.type)
			this.getList()
		},
		methods: {
			checkboxChange(e) {
				console.log('eee', e.id)
				console.log('fff', this.list)
				if (this.type == "transmit") {
					this.selectedList.length = 0
					this.list.forEach(item => {
						if (item.id != e.id) {
							item.status = false
						}
					})
				}
				if (e.status) {
					this.selectedList.push({
						name: e.name,
						id: e.id
					})
				} else {
					this.selectedList.splice(this.selectedList.findIndex(i => i.id === e.id), 1)
				}
			},
			search(e) {
				this.searchContent = e.detail.value
				this.listQuery.name = this.searchContent
				this.getList()
			},
			getList() {
				uni.showLoading({
					title: '加载中...'
				})
				//上报机构
				if (this.type == 'submitorg') {
					OrgApi.getSubmitOrgList(this.listQuery).then(res => {
						this.$nextTick(function() {
							this.list = res.data.data
						})
						uni.hideLoading()
					})
				} //转交机构
				else if (this.type = "transmit") {
					OrgApi.getTransmitOrgList(this.listQuery).then(res => {
						this.$nextTick(function() {
							this.list = res.data.data
						})
						uni.hideLoading()
					})
				} else {
					// 主办协办机构
					OrgApi.getTargetOrgList(this.listQuery).then(res => {
						console.log(res)
						this.$nextTick(function() {
							this.list = res.data.data
						})
						uni.hideLoading()
					})
				}

			},
			selectedOrg(item) {
				if (this.type == 'main') {
					// 主办单位选择
					uni.$emit('selectedOrg', this.selectedList)
					uni.navigateBack({
						delta: 1
					})
				} else if (this.type == 'submitorg') {
					//上报机构选择
					uni.$emit('selectedOrgSubmit', this.selectedList)
					uni.navigateBack({
						delta: 1
					})
				} else if (this.type == 'transmit') {
					// 转交单位
					uni.$emit('selectedOrgTransmit', this.selectedList)
					uni.navigateBack({
						delta: 1
					})
				} else {
					// 协办单位选择
					uni.$emit('selectedOrgAssist', this.selectedList)
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style>
	.indexes {
		position: relative;
	}

	.placeholder-align {
		text-align: center;
	}
</style>
