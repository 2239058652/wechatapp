<template>
	<view>
		<view>
			<image src="../../../eventReport/static/img/wenjuantiaocha.png" style="height: 175rpx;width: 100%;padding: 0 2% 0 2%;"></image>
		</view>
		<view class="q-content">
		<!-- <view class="q-title">
			问卷调查
		</view> -->
		<view class="q-sub-title">
			<view class="">
				<image src="../../../static/img/dcwj_sp.png" mode="widthFix"></image>
			</view>
			<view class="title-content">
				{{dataTemp.questionnaireName==''?'暂无新问卷':dataTemp.questionnaireName}}
			</view>
			<view class="">
				<image src="../../../static/img/dcwj_sp.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="q-logo">
			<image src="../../../static/img/dcwj_icon.png" mode="widthFix"></image>
		</view>
		<view class="q-intro">
			{{dataTemp.description}}
		</view>
		<view v-if="id.length>0&&!isAnswered" class="q-button">
			<u-button :ripple="true" @click="handleAnswer(dataTemp)" :custom-style="customStyle">立即开始</u-button>
		</view>
		<view v-else class="text-bold">
			您已经做过问卷了，感谢您的参与!
		</view>
	</view>
	</view>
</template>

<script>
	import Questionnaire from '../../../api/questionnaire.js'
	import UserApi from 'api/user.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					height: '100rpx'
				},
				dataTemp: {
					questionnaireName: '',
					description: ''
				},
				id: '', //选中问卷id，
				openId: '',
				isAnswered: false
			};
		},
		onLoad() {
			// this.fetchList()
			this.openId = uni.getStorageSync('openId')
			// #ifdef MP-WEIXIN
			if (!this.openId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log('loginRes', loginRes);
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							console.log(res)
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
		},
		onShow() {
			this.openId = uni.getStorageSync('openId')
			this.fetchList()
		},
		methods: {
			fetchList() {
				Questionnaire.getQuestionnaireList().then(res => {
					console.log(res)
					if (res.data.code == 0) {
						if (res.data.data.content.length > 0) {
							this.id = res.data.data.content[0].id
							this.fetchDetail()
							//判断是否作过问卷
							let data = {
								openid: this.openId,
								questionnaireId: this.id
							}
							if (this.openId) {
								Questionnaire.isAnswered(data).then(res => {
									if (res.data.desc != '未填写') {
										this.isAnswered = true
									}
								})
							}
						}
					}
				})
			},
			fetchDetail() {
				uni.showLoading({
					title: '加载中...'
				})
				Questionnaire.getQuestionnaireDetail(this.id).then(res => {
					console.log('detail', res)
					if (res.data.code == 0) {
						this.dataTemp = JSON.parse(JSON.stringify(res.data.data))
					}
					uni.hideLoading()

				})
			},
			handleAnswer(item) {
				uni.navigateTo({
					url: '../answer/answer?id=' + item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.q-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		// height: 80vh;
		// background-color: red;
	}

	.q-title {
		font-size: 2.0em;
		letter-spacing: 10rpx;
		padding: 60rpx 0 30rpx 0;
		font-weight: bold;
	}

	.q-sub-title {
		display: flex;
		justify-content: center;
		padding: 20rpx 0 100rpx 0;

		image {
			width: 12rpx;
			margin: 0 15rpx;
		}

		.title-content {
			width: 55%;
			font-size: large;
			font-weight: bold;
			text-align: center;
			letter-spacing: 1rpx;
		}
	}

	.q-logo {
		image {
			width: 40vw;
		}
	}

	.q-intro {
		text-align: center;
		padding: 90rpx 50rpx;
		font-weight: bold;
	}

	.q-button {
		position: fixed;
		bottom: 10%;
		width: 90%;
		text-align: center;
		color: #FFFFFF;
		letter-spacing: 1rpx;
		// background-image: url(../../../static/img/dcwj_button.png);
		// background-size: 100% 100%;

	}
</style>
