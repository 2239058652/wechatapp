<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input class="placeholder-align" type="text" placeholder="请输入单位名称" confirm-type="search" @input="search"></input>
			</view>
		</view>
		<scroll-view scroll-y class="indexes" :scroll-with-animation="true"
			:enable-back-to-top="true" style="height: 999rpx;">
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view class="cu-list menu no-padding">
						<view class="cu-item">
							<u-checkbox @change="checkboxChange(item)"
								v-model="item.checked" :key="index" :name="item.name" size=45 />
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
	import OrgApi from '@/api/disputesResolvePlatform.js'
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
				selectedList: [],
				targetOrgIdList: [],
				sponsorOrgId: ''
			};
		},
		onLoad(options) {
			this.type = options.type
			this.sponsorOrgId = options.sponsorOrgId
			this.getList()
		},
		methods: {
			getList() {
				var _self = this
				uni.showLoading({
					title: '加载中...'
				})
				// 主办机构
				OrgApi.getTargetOrgList(_self.listQuery).then(res => {
					this.$nextTick(function() {
						_self.list = res.data.data
						_self.list.forEach(item => {
							if(item.id == _self.sponsorOrgId) {
								item.checked = true
								_self.selectedList.push({ id: item.id, name: item.name})
							}
						})
					})
					uni.hideLoading()
				})
			},
			search(e) {
				this.searchContent = e.detail.value
				this.listQuery.name = this.searchContent
				this.getList()
			},
			checkboxChange(e) {
				var _self = this
				if (_self.selectedList.length == 0) {
					_self.selectedList.push({
						id: e.id,
						name: e.name
					})
				} else {
					_self.list.forEach(element => {
						if (element.id == _self.selectedList[0].id) {
							if (element.checked == true) {
								element.checked = false
							}
						}
					})
					_self.selectedList = []
					_self.selectedList.push({
						id: e.id,
						name: e.name
					})
				}
			},
			selectedOrg(item) {
				// 主办单位选择
				uni.$emit('selectedMainOrg', this.selectedList)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
	page {
		/* padding-top: 100upx; */
	}

	.indexes {
		position: relative;
	}

	.placeholder-align {
		text-align: center;
	}
</style>
