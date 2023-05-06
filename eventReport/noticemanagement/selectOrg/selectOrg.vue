<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input class="placeholder-align" type="text" placeholder="请输入单位名称" confirm-type="search" @input="search"></input>
			</view>
		</view>
		<view class="cu-list menu padding-lr-xs">
			<view class="cu-item listitem">
				<view class=" text-sm">
					当前：
					<text class="text-blue" @click="handleBack(currentOrgParent)">{{currentOrgParent!=null?currentOrgParent.name:''}}</text>
					<text v-if="currentOrgParent!=null">></text>
					<text>{{currentOrg.name}}</text>
				</view>
			</view>
		</view>
		<view class="cu-list menu padding-lr-xs">
			<view class="cu-item listitem">
				<u-checkbox @change="allcheckboxChange" v-model="allcheck"></u-checkbox>
				<view class="content">
					全选
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view class="cu-list menu padding-xs">
						<view class="cu-item listitem">
							<u-checkbox @change="checkboxChange" v-model="list[index].checkstatus" :key="index" :name="item.id"></u-checkbox>
							<view class="content">
								<view class="text-black"><text class="text-abc">{{item.name}}</text></view>
								<view class="text-gray text-sm">
									{{item.propertiesDesc}}
								</view>
							</view>
							<view v-if="item.havingChild==0" class="action" @click="handelChild(item)">
								<u-icon name="arrow-down-fill" color="#2979ff" size="28" label="下级" label-color="#2979ff"></u-icon>
							</view>
							<view v-if="item.havingChild==1" class="action">
								<u-icon v-if="item.havingChild==1" name="minus-circle" color="#c8c9cc" size="28" label="无下级" label-color="#c8c9cc"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="bottom">
			<view class="" @click="popupShow=true">
				已选择：{{selectedList.length}}
				<u-icon v-if="selectedList.length>0" name="arrow-up-fill" size="28" color="#2b85e4" margin-left="20rpx" style="margin-left: 15upx;"></u-icon>
			</view>
			<view class="">
				<u-button class="bottonbottom" type="primary" @click="selectedOrg">确定</u-button>
			</view>
		</view>
		<u-popup v-model="popupShow" mode="bottom" width="600rpx" height="1200upx">
			<view class="padding">
				<scroll-view scroll-y class="indexes" :scroll-with-animation="true" :enable-back-to-top="true">
					<block v-for="(item,index) in selectedList" :key="index">
						<!-- <view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name" @tap="selectedOrg(item)"> -->
						<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
							<view class="cu-list menu padding-xs">
								<view class="cu-item listitem">
									<view class="content">
										<view class="text-black"><text class="text-abc">{{item.name}}</text></view>
										<view class="text-gray text-sm">
											{{item.propertiesDesc}}
										</view>
									</view>
									<view class="action" @click="deleteItem(item)">
										<u-icon name="close-circle" color="#2979ff" size="28" label="删除" label-color="#2979ff"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<u-button type="success" @click="cleanList" :loading="buttonLoading">清空</u-button>
			</view>

		</u-popup>
		<view class="place">

		</view>
	</view>
</template>

<script>
	import NoticeApi from '../../../api/noticemanagement.js'
	export default {
		data() {
			return {
				buttonLoading: false,
				popupShow: false,
				listUserID: '',
				list: [],
				listUser: [],
				searchContent: '',
				listQuery: {
					name: '',
					parentId: ''
				},
				type: '',
				selectedList: [],
				allcheck: false,
				rootId: '',
				currentOrg: {},
				currentOrgParent: {}
			};
		},
		onLoad(options) {
			this.type = options.type
			this.getRoot()
		},
		methods: {
			handleBack(item) {
				this.allcheck = false
				this.currentOrg = null
				this.currentOrgParent = null
				NoticeApi.getNoticeOrgListParent(item.id).then(res => {
					console.log('plist', res)
					let arr = res.data.data
					console.log(arr[arr.length - 1])
					if (arr.length > 0) {
						this.currentOrgParent = arr[arr.length - 1]
					}
					this.currentOrg = item
				})
				this.listQuery.parentId = item.id
				this.getList()
			},
			deleteItem(item) {
				this.selectedList.splice(this.selectedList.findIndex(i => i.id === item.id), 1)
				item.checkstatus = false
			},
			cleanList() {
				this.list.forEach(item => {
					item.checkstatus = false
					this.selectedList.length = 0
				})
				this.allcheck = false
				this.popupShow = false
			},
			handelChild(item) {
				this.allcheck = false
				this.listQuery.parentId = item.id
				this.getList()
				this.currentOrgParent = null

				DocApi.getDocSendOrgParentList(item.id).then(res => {
					let arr = res.data.data
					if (arr.length > 0) {
						this.currentOrgParent = arr[arr.length - 1]
					}
					this.currentOrg = item
				})
			},
			allcheckboxChange(e) {
				var _this = this
				_this.$nextTick(function() {
					if (e.value) {
						this.list.forEach(item => {
							item.checkstatus = true
							// _this.selectedList.push({
							// 	name: item.name,
							// 	id: item.id
							// })
							_this.selectedList.push(item)
							_this.selectedList = Array.from(new Set(_this.selectedList))
						})
					} else {
						this.list.forEach(item => {
							item.checkstatus = false
							_this.selectedList = []
						})
					}
				})
			},
			checkboxChange(e) {
				console.log('AAAAAAAAAAAAAAA', e)
				if (e.value) {
					this.selectedList.push(this.list.find(i => i.id === e.name))
				} else {
					this.selectedList.splice(this.selectedList.findIndex(i => i.id === e.name), 1)
				}
			},
			search(e) {
				this.searchContent = e.detail.value
				this.listQuery.name = this.searchContent
				this.getList()
			},
			getRoot() {
				NoticeApi.getNoticeOrgList(this.listQuery).then(res => {
					this.$nextTick(function() {
						this.rootId = res.data.data[0].id
						this.currentOrg = Object.assign({}, res.data.data[0])
						this.currentOrgParent = this.currentOrg.parentOrg
						console.log('this.currentOrgParent', this.currentOrgParent)
						this.getList()
						console.log('this.list', this.list)
					})
				})
			},
			getList() {
				uni.showLoading({
					title: '加载中...'
				})
				NoticeApi.getNoticeOrgList(this.listQuery).then(res => {
					this.$nextTick(function() {
						// this.list = res.data.data
						this.list.length = 0
						let checkstr = JSON.stringify(this.selectedList)
						let checknum = 0
						res.data.data.forEach(item => {
							if (checkstr.indexOf(item.id) != -1) {
								this.list.push(Object.assign({
									checkstatus: true
								}, item))
								checknum += 1
							} else {
								this.list.push(Object.assign({
									checkstatus: false
								}, item))
							}
							if (checknum == this.list.length) {
								this.allcheck = true
							}
						})
					})
					uni.hideLoading()
				})
			},
			selectedOrg(item) {
				uni.$emit('selectedOrg', this.selectedList)
				uni.navigateBack({
					delta: 1
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.indexes {
		position: relative;
	}

	.placeholder-align {
		text-align: center;
	}

	.listitem {
		border-bottom: #F1F1F1 1upx solid;
	}

	.place {
		height: 200upx;
	}

	.bottom {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15upx 30upx;
		width: 100%;
		background-color: #F1F1F1;

		.bottonbottom {
			// margin-top: 20upx;
			width: 95%;
		}
	}
</style>
