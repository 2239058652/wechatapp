<template>
	<view>
		<view class="u-search-box">
			<u-search action-text="搜索" v-model="query.name" @search="handleSearch()"></u-search>
		</view>
		<!-- <view v-if="remind == 0" style="text-align: center;">猜你想要找...</view> -->
		<view>
			<scroll-view class="u-tab-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in situationDetailList" :key="item.id" class="u-tab-item" :data-current="item.id" @tap="handleToeventReport(item)">
					<text class="u-line-1">{{item.name}}</text>
					<image class="to" src="/eventReport/static/userImage/to.png"></image>
				</view>
				<view v-if="situationDetailList.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
					<u-empty text="暂无数据" mode="list"></u-empty>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import SituationApi from '../../../api/scenario.js';
	export default {
		data() {
			return {
				scenarioId: '',
				scenarioName: '',
				situationDetailList: [],
				scrollTop: 0, //tab标题的滚动条位置
				remind: 0,
				query: {
					name: ''
				},
			}
		},
		computed: {},
		onLoad(option) {
			this.eventId = option.eventId
			this.nodeId = option.nodeId
			this.fechSituationListLoad()
		},
		methods: {
			fechSituationListLoad() {
				this.situationDetailList = []
				this.query.page = 1
				this.query.limit = 5
				SituationApi.getClassDetailList(this.query).then(res => {
					this.situationDetailList = res.data.data.content
				});
			},
			fechSituationList() {
				this.situationDetailList = []
				this.remind = 1
				SituationApi.getClassDetailList(this.query).then(res => {
					this.situationDetailList = res.data.data.content
				});
			},
			handleSearch(e) {
				this.fechSituationList()
			},
			handleToeventReport(e) {
				uni.navigateTo({
					url: '/eventReport/eventhandle/detail/detail?scenarioId=' 
					+ e.id + '&scenarioName=' + e.name + '&eventId=' + this.eventId  + '&nodeId=' + this.nodeId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-search-box {
		padding: 18rpx 30rpx;
	}
	.scenario-title {
		height: 100rpx;
		line-height: 100rpx;
		width: 100%;
		text-align: center;
		font-size: 2em;
		font-weight: bold;
	}
	.u-tab-view {
		width: 100%;
	}
	.u-tab-item {
		height: 120rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1em;
		color: #444;
		font-weight: 400;
		line-height: 1;
		border-bottom: 10upx solid #f1f1f1;
	}
	.u-line-1 {
		line-height: 50rpx;
		padding-left: 10upx;
		color: #000000;
		font-weight: bold;
		width: 90%;
		color: #666;
		width: 100% !important;
		float: left !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		white-space: normal !important;
	}
	.to {
		width: 50upx;
		height: 30upx;
	}
	.addSite {
		display: flex;
		justify-content: space-around;
		width: 80%;
		line-height: 80rpx;
		position: absolute;
		bottom: 5%;
		left: 10%;
		background-color: #1261d4;
		border-radius: 60rpx;
		font-size: 30rpx;
		.add{
			display: flex;
			align-items: center;
			color: #ffffff;
			.icon{
				margin-left: 10rpx;
			}
		}
	}
</style>
