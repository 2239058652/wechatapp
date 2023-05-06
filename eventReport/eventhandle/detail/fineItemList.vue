<template>
	<view>
		<view class="u-search-box">
			<u-search v-model="query.name" :show-action="false" @search="handleSearch()"></u-search>
		</view>
		<view class="scenario-title">{{scenarioName}}</view>
		<view>
			<scroll-view class="u-tab-view" :scroll-top="scrollTop" scroll-y="true" style="height: 780rpx;">
				<view v-for="(item,index) in situationDetailList" :key="item.id" class="u-tab-item" :data-current="item.id" @tap="handleToeventReport(item)">
					<span class="u-line-1">{{item.name}}</span>
					<image class="to" src="/eventReport/static/userImage/to.png"></image>
				</view>
			</scroll-view>
		</view>
		<view v-if="situationDetailList.length<=0" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="暂无数据" mode="list"></u-empty>
		</view>
		<view class="addSite" @tap="handleToScenarioIndex">
			<view class="add">
				更多<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>
			</view>
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
				query: {
					parentClsId: '',
					name: ''
				},
				eventId: '',
				nodeId: ''
			}
		},
		computed: {},
		onLoad(option) {
			console.log('22222222222222', option)
			this.scenarioId = option.scenarioId
			this.scenarioName = option.scenarioName
			this.query.parentClsId = option.scenarioId
			this.eventId = option.eventId
			this.nodeId = option.nodeId
			this.fechSituationList()
		},
		methods: {
			fechSituationList() {
				this.situationDetailList = []
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
			},
			// 跳转事件分类
			handleToScenarioIndex(){
				uni.navigateTo({
				    url: '/eventReport/scenario/index'
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
		width: 100%;
		text-align: center;
		font-size: 2em;
		font-weight: bold;
	}
	.u-tab-view {
		width: 100%;
		margin-top: 2%;
	}
	.u-tab-item {
		height: 120rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		word-break:break-all;
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
		bottom: 5%;
		margin-top: 10%;
		margin-left: 10%;
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
