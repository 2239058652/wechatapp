<template>
	<view>
		<view class="">
			<view class="title">
				<view class="">
					最新防控信息
				</view>
				<view class="more" @click="handleDetailList">
					更多
				</view>
			</view>
			<u-table>
				<u-tr>
					<u-th>所属区域</u-th>
					<u-th>报送人</u-th>
					<u-th>报送时间</u-th>
				</u-tr>
				<view class="" v-for="(item,index) in dataList" :key="index" @click="handleDetail(item)">
					<u-tr >
						<u-td style="height: 70rpx;" @click="handleDetailList">{{item.region}}</u-td>
						<u-td style="height: 70rpx;">{{item.sourceUserName}}</u-td>
						<u-td style="height: 70rpx;">{{item.reportTime}}</u-td>
					</u-tr>
				</view>
				
			</u-table>
		</view>
		<view class="">
			<view class="title">
				防控统计信息
			</view>
			<u-table>
				<u-tr>
					<u-th>报送日期</u-th>
					<u-th>平安报送</u-th>
					<u-th>防控报送</u-th>
				</u-tr>
				<u-tr v-for="(item,index) in reportList" :key="index">
					<u-td style="height: 70rpx;">{{item.date}}</u-td>
					<u-td style="height: 70rpx;">{{item.safty}}</u-td>
					<u-td style="height: 70rpx;">{{item.border}}</u-td>
				</u-tr>
			</u-table>
		</view>
	</view>
</template>

<script>
	import EventApi from '../../../api/eventdetail.js'
	export default {
		data() {
			return {
				listQuery: {
					limit: 10,
					page: 1
				},
				dataList: [],
				reportList: []
			}
		},
		onLoad() {
			this.fetchList()
		},
		methods: {
			fetchList() {
				EventApi.getBorderReportList(this.listQuery).then(res => {
					
					this.dataList = res.data.data.content
				})

				EventApi.getBorderReport().then(res => {
					console.log(res);
					this.reportList = res.data.data.content
					this.reportList.reverse()
				})
			},
			handleDetailList(){
				uni.navigateTo({
					url:"../borderlist/borderlist"
				})
			},
			handleDetail(item){
				console.log(item);
				uni.navigateTo({
					url: '../../eventhandle/view/view?id=' + item.id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.title {
		padding: 10rpx;
		text-align: center;
		background-color: #e3e3e3;
		font-weight: bold;
		.more{
			position:absolute;
			top:0;
			right:0;
			padding:10rpx 30rpx;
		}
	}
</style>
