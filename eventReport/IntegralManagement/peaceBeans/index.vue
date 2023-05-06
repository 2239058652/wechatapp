<template>
	<view>
		<view class="jifen-head">
			<view style="height: 70rpx;"/>
			<view class="jifen-main">
				<view style="width: 100%;">
					我的平安豆：{{ pingandou }}
					<image
						src="/eventReport/static/img/pingandou.png"
						style="height: 30rpx;width: 30rpx;margin-left: 2%;"
					/>
				</view>
			</view>
		</view>
		<view class="list">
			<view v-if="!isSWZFWSM">
				<view class="li" style="height: 80rpx;">
					<view class="text" @click="viewDHGZ()">
						<view><u-icon name="question-circle" />兑换规则</view>
					</view>
				</view>
				<view class="li">
					<view class="text">
						<view class="title-text">平安豆明细</view>
						<view class="descri-text">点击可前往查看自己的平安豆记录</view>
					</view>
					<view style="width: 15%;margin-right: 3%;">
						<u-button
							type="primary"
							plain
							:ripple="true"
							style="width: 70px;height: 30px;"
							@click="handleGoTo('平安豆明细')"
						>查看</u-button>
					</view>
				</view>
				<view class="li">
					<view class="text">
						<view class="title-text">兑换记录</view>
						<view class="descri-text">点击可前往查看自己的平安豆兑换记录</view>
					</view>
					<view style="width: 15%;margin-right: 3%;">
						<u-button
							type="primary"
							plain
							:ripple="true"
							style="width: 70px;height: 30px;"
							@click="handleGoTo('兑换记录')"
						>查看</u-button>
					</view>
				</view>
				<view class="li">
					<view class="text">
						<view class="title-text">平安豆兑换</view>
						<view class="descri-text">点击可前往进行平安豆兑换</view>
					</view>
					<view style="width: 15%;margin-right: 3%;">
						<u-button
							type="primary"
							plain
							:ripple="true"
							style="width: 70px;height: 30px;"
							@click="handleGoTo('平安豆兑换')"
						>前往</u-button>
					</view>
				</view>
			</view>
			<view v-if="isSWZFWSM">
				<view class="li">
					<view class="text">
						<view class="title-text">现金结算确认</view>
						<view class="descri-text">点击进行超市现金结算确认</view>
					</view>
					<view style="width: 15%;margin-right: 3%;">
						<u-button
							type="primary"
							plain
							:ripple="true"
							style="width: 70px;height: 30px;"
							@click="handleGoTo('现金结算确认政法委')"
						>前往</u-button>
					</view>
				</view>
				<view class="li">
					<view class="text">
						<view class="title-text">现金结算确认记录</view>
						<view class="descri-text">点击查看超市现金结算确认记录</view>
					</view>
					<view style="width: 15%;margin-right: 3%;">
						<u-button
							type="primary"
							plain
							:ripple="true"
							style="width: 70px;height: 30px;"
							@click="handleGoTo('现金结算记录')"
						>查看</u-button>
					</view>
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
				pingandou: 0,
				isSWZFWSM: false,
				type: 'manager'
			};
		},
		onLoad() {
			this.fechLoad()
			this.fetchIntegral()
		},
		methods: {
			fechLoad() {
				this.isSWZFWSM = false;
				let userRolesList = uni.getStorageSync('roles');
				userRolesList.forEach(item => {
					if (item.id == 'deploy') {
						this.isSWZFWSM = true;
					}
				})
			},
			fetchIntegral() {
				IntegralApi.getPersonTotalBean().then(res => {
					this.pingandou = res.data.data
				})
			},
			viewDHGZ() {
				
			},
			handleGoTo(e) {
				if (e == '平安豆兑换') {
					uni.navigateTo({
						url: './exchange'
					})
				}
				if (e == '平安豆明细') {
					uni.navigateTo({
						url: './list'
					})
				}
				if (e == '兑换记录') {
					uni.navigateTo({
						url: './exchangeList'
					})
				}
				if (e == '现金结算确认政法委') {
					uni.navigateTo({
						url: './managerIdentification'
					})
				}
				if (e == '现金结算记录') {
					uni.navigateTo({
						url: './managerIdentificationList'
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
