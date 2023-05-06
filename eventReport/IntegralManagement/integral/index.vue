<template>
	<view>
		<view class="jifen-head">
			<view style="height: 70rpx;"/>
			<view class="jifen-main">
				<view style="width: 48%;">总积分：{{ zongjifen }} 分</view>
				<view style="width: 4%;font-size: large;">|</view>
				<view style="width: 48%;">年度积分：{{ niandujifen }} 分</view>
			</view>
			<view class="jifen-title">
				— 今日已获得 {{ danrijifen }} 分 —
			</view>
		</view>
		<view class="list">
			<view class="li" style="height: 80rpx;">
				<view class="text">
					<view class="title-text">积分规则</view>
				</view>
				<view style="text-align: right;width: 80px;margin-right: 1%;" @click="handleGoTo('积分明细')">积分明细</view>
			</view>
			<view class="li" style="display: flex;">
				<view class="text">
					<view class="title-text">登录</view>
					<view class="descri-text">每日登录积1分，每日上限1分</view>
				</view>
			</view>
			<view class="li">
				<view class="text">
					<view class="title-text">问题隐患报送</view>
					<view class="descri-text">问题隐患报送积5分,报送并办结积10分</view>
				</view>
				<view style="width: 15%;margin-right: 3%;">
					<u-button
						type="primary"
						plain
						:ripple="true"
						style="width: 70px;height: 30px;"
						@click="handleGoTo('问题隐患报送')"
					>前往</u-button>
				</view>
			</view>
			<view class="li">
				<view class="text">
					<view class="title-text">工作上报</view>
					<view class="descri-text">工作上报积1分，每日上限5分</view>
				</view>
				<view style="width: 15%;margin-right: 3%;">
					<u-button
						type="primary"
						plain
						:ripple="true"
						style="width: 70px;height: 30px;"
						@click="handleGoTo('工作上报')"
					>前往</u-button>
				</view>
			</view>
			<view class="li">
				<view class="text">
					<view class="title-text">工作圈动态阅读</view>
					<view class="descri-text">阅读工作圈动态积1分，每日上限2分</view>
				</view>
				<view style="width: 15%;margin-right: 3%;">
					<u-button
						type="primary"
						plain
						:ripple="true"
						style="width: 70px;height: 30px;"
						@click="handleGoTo('工作圈动态阅读')"
					>前往</u-button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import IntegralApi from '../../../api/integral.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				zongjifen: 0,
				niandujifen: 0,
				danrijifen: 0
			};
		},
		onLoad() {
			this.fetchIntegral()
		},
		methods: {
			fetchIntegral() {
				IntegralApi.getPersonIntegralTotalReward().then(res => {
					this.zongjifen = res.data.data
				})
				IntegralApi.getPersonIntegralYearTotalReward().then(res => {
					this.niandujifen = res.data.data
				})
				IntegralApi.getPersonIntegralDayTotalReward().then(res => {
					this.danrijifen = res.data.data
				})
			},
			handleGoTo(e) {
				if (e == '积分明细') {
					uni.navigateTo({
						url: './list'
					})
				}
				if (e == '问题隐患报送') {
					uni.navigateTo({
						url: '../../eventreporting/eventreporting'
					})
				}
				if (e == '工作上报') {
					uni.navigateTo({
						url: '../../workreport/detail/detail'
					})
				}
				if (e == '工作圈动态阅读') {
					uni.switchTab({
						url: '/pages/infomation/newlist/newlist'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.jifen-head {
		background: url(/eventReport/static/img/jifenBg.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 260rpx;
	}
	.jifen-main {
		width: 76%;
		margin-left: 12%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border:1px #8799A3 solid;
		box-shadow:1px 1px 10px #909090;
		background-color: #FFFFFF;
		display: flex;
		color: #000000;
		font-size: 1rem;
	}
	.jifen-title {
		margin-top: 2%;
		text-align: center;
		font-size: 1rem;
	}
	.list {
		width: 100%;
		padding: 20rpx;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;
		&:last-child {
			border: none;
		}
		.li {
			width: 100%;
			height: 130upx;
			border-bottom: 2px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;
			.text {
				padding-left: 20upx;
				width: 85%;
			}
			.title-text {
				font-family: Georgia, 'Times New Roman', Times, serif;
				font-size: 1rem;
				font-weight: bold;
				color: #000000;
			}
			.descri-text {
				margin-top: 2%;
				color: #C0C0C0;
			}
			.to {
				flex-shrink: 0;
				width: 30upx;
				height: 30upx;
			}
		}
	}
</style>
