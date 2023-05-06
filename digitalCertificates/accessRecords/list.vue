<template>
	<view style="min-height: 100vh;">
		<!-- 通行记录 -->
		<view class="list-info">
			<view class="show-title">查验记录</view>
			<view v-for="(item,index) in checkRccordList" :key="item.id">
				<view class="list-content" @click="handleView(item)">
					<view style="margin: 2%;">
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">查验时间</view>
							<view style="width: 75%;text-align: left;">{{ item.reportTime }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">查验机构</view>
							<view style="width: 75%;text-align: left;">{{ item.workerOrgName }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">查验人</view>
							<view style="width: 75%;text-align: left;">{{ item.workerName }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">通行人员</view>
							<view style="width: 75%;text-align: left;">{{ item.residentWeChat.name }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">身份证号</view>
							<view style="width: 75%;text-align: left;">{{ item.residentWeChat.idCard }}</view>
						</view>
						<view class="u-flex">
							<view style="width: 25%;text-align: left;">联系方式</view>
							<view style="width: 75%;text-align: left;">{{ item.residentWeChat.mobile }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import DigitalCertificates from '@/api/digitalCertificates.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				listQuery: {},
				checkRccordList: []
			};
		},
		onLoad() {
			this.fetchList()
		},
		methods: {
			fetchList() {
				var _this = this
				DigitalCertificates.getWorkerCheckRecord(_this.listQuery).then(res => {
					if (res.data.code === 0) {
						_this.checkRccordList = res.data.data.content
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
				})
			},
			handleView(e) {
				uni.navigateTo({
					url: './view?id=' + e.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.show-title {
		text-align: center;
		font-size: 1.2rem;
		font-weight: 700;
	}
	.list-info {
		margin: 0% 3% 0% 3%;
	}
	.list-content {
		margin-top: 1vh;
		border: 5rpx #ececec solid;
		border-radius: 20rpx;
		line-height: 5vh;
		color: #000000;
		box-shadow:2px 2px 2px 2px #bbb;
	}
</style>
