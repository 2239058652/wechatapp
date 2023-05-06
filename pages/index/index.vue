<template>
	<view>
		<view class="wrap">
			<u-swiper :list="bgImageList" mode="dot" :effect3d="true"></u-swiper>
		</view>
		<view class="border-head">
			<view class="list">
				<view class="indexTitle">
					共建·共享·共治
				</view>
				<view style="width: 100%;display: flex;">
					<view class="li" @click="handleGoTo('矛盾纠纷多元化解')" style="border-right: 1px #ececec solid;">
						<image class="hdImage" src="../../static/img/dyhjpt.png"></image>
						<view class="text">
							<view class="titleText">矛盾纠纷</view>
						</view>
					</view>
					<view class="li" @click="handleGoTo('综治服务')">
						<image class="hdImage" src="../../static/img/toWJDC.png"></image>
						<view class="text">
							<view class="titleText">综治服务</view>
						</view>
					</view>
				</view>
				<view style="width: 100%;display: flex;">
					<view class="li" @click="handleGoTo('监督举报')" style="border-right: 1px #ececec solid;">
						<image class="hdImage" src="../../static/img/toYJJB.png"></image>
						<view class="text">
							<view class="titleText">监督举报</view>
						</view>
					</view>
					<view class="li" @click="handleGoTo('意见建议')">
						<image class="hdImage" src="../../static/img/toQZSQ.png"></image>
						<view class="text">
							<view class="titleText">意见建议</view>
						</view>
					</view>
				</view>
				<view style="width: 100%;display: flex;">
					<view class="li" @click="handleGoTo('问卷调查')" style="border-right: 1px #ececec solid;">
						<image class="hdImage" src="../../static/img/toWJDC.png"></image>
						<view class="text">
							<view class="titleText">问卷调查</view>
						</view>
					</view>
					<view class="li" @click="handleGoTo('法律咨询')">
						<image class="hdImage" src="../../static/img/flfwzx.png"></image>
						<view class="text">
							<view class="titleText">法律咨询</view>
						</view>
					</view>
				</view>
				<view style="width: 100%;display: flex;">
					<view class="li" @click="handleGoTo('数字认证')">
						<image class="hdImage" src="../../static/img/flfwzx.png"></image>
						<view class="text">
							<view class="titleText">数字认证</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="infoList.length > 0" class="border-head" style="margin-top: 3%;">
			<view class="list">
				<view class="indexTitle" style="display: flex;">
					<view style="width: 60%;">平安资讯</view>
					<view style="text-align: right;width: 30%;color: #C0C0C0;font-size: small;" @click="handleToMoreNews()">
						更多 <u-icon name="arrow-right" />
					</view>
				</view>
				<view class="info-list ">
					<view v-for="(item,index) in infoList" :key="index" class="item" @click="handleDetail(item.id)">
						<view style="width: 100%;display: flex;">
							<view>
								<view class="toPAZX">
									{{item.fenLeiMs}}
								</view>
							</view>
							<view class="info-item-left" style="margin-left: 5%;">
								<view class="title">
									{{item.title | titleFilter}}
								</view>
								<view class="datetime text-sm text-grey">
									{{item.publishTime}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100;margin-top: 2%;height: 100rpx;line-height: 100rpx;text-align: center;color: #C0C0C0;">
			中国共产党景洪市委员会政法委员会
		</view>
	</view>
</template>
<script>
	import CommonFileApi from '../../api/commonFile.js'
	import InfomationApi from '../../api/infomation.js'
	import FileApi from '../../api/fileupload.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		filters: {
			titleFilter(val) {
				if (val == null) {
					return val = '工作上报'
				} else if (val.length > 20) {
					return val.substring(0, 20) + '...'
				}
				return val
			}
		},
		data() {
			return {
				bgImageList: [],
				city: '',
				currentWeather: {},
				dayWeather: {},
				listQuery: {
					sorts: '-createdDate',
				},
				infoList: [],
				showSubscribe:true,
				textcontent:''
			};
		},
		onLoad() {
			this.getCommonImgList()
			this.fetchList()
		},
		methods: {
			getCommonImgList() {
				CommonFileApi.getCommonImgList().then(res => {
					if (res.data.code === 0) {
						const resPonseList = res.data.data
						resPonseList.forEach( item => {
							FileApi.downloadFileByUni(item.fileId).then(i => {
								this.bgImageList.push({
									image: i[1].tempFilePath
								})
							})
						})
					} else {
						uni.showToast({
							title: res.data.desc,
							icon: 'none'
						})
					}
				})
			},
			fetchList() {
				this.loading = true
				//读信息列表
				InfomationApi.getInfomationList(this.listQuery).then(res => {
					for (let i = 0; i < res.data.data.content.length; i++) {
						if(i <= 4) {
							this.infoList.push(res.data.data.content[i])
						}
					}
					this.loading = false
				})
			},
			handleGoTo(e) {
				if (e == '监督举报') {
					uni.navigateTo({
						url: '/eventReport/keyReport/index'
					})
				}
				if (e == '意见建议') {
					uni.navigateTo({
						url: '/eventReport/opinionSuggestion/index'
					})
				}
				if (e == '问卷调查') {
					uni.navigateTo({
						url: '/eventReport/questionnaire/index/index'
					})
				}
				if (e == '矛盾纠纷多元化解') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/spearAdjustableCenter/public/mediationToDeclare/publicIndex'
					})
				}
				if (e == '法律咨询') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/spearAdjustableCenter/public/legalAdvice/publicIndex'
					})
				}
				if (e == '综治服务') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/zongZhiService/publicIndex'
					})
				}
				if (e == '数字认证') {
					uni.navigateTo({
						url: '/digitalCertificates/certification/index'
					})
				}
			},
			handleToMoreNews() {
				uni.navigateTo({
					url: '/eventReport/news/list'
				})
			},
			handleDetail(id) {
				uni.navigateTo({
					url: '/eventReport/news/view?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 40rpx;
	}
	.border-head {
		width: 92%;
		margin-left: 4%;
		border: 1px #ececec solid;
	}
	.indexTitle {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		margin-left: 5%;
		color: #000000;
		border-bottom: 2upx solid #f1f1f1;
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-size: 1.2rem;
		font-weight: bold;
		display: flex;
	}
	.list {
		width: 100%;
		// padding: 20rpx;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;
		&:last-child {
			border: none;
		}
		.li {
			width: 100%;
			height: 150upx;
			padding: 0 5%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;
			&.noborder {
				border-bottom: 0
			}
			.text {
				padding-left: 20upx;
				width: 90%;
			}
			.titleText {
				font-family: Georgia, 'Times New Roman', Times, serif;
				font-size: 1rem;
				font-weight: bold;
				color: #000000;
			}
			.descriText {
				margin-top: 2%;
				color: #C0C0C0;
			}
			.hdImage {
				flex-shrink: 0;
				width: 75upx;
				height: 75upx;
			}
			.to {
				flex-shrink: 0;
				width: 30upx;
				height: 30upx;
			}
		}
	}
	.info-list {
		margin: 20rpx 20rpx;
		.item {
			display: flex;
			justify-content: space-between;
			padding: 10rpx;
			margin-top: 6%;
			margin-bottom: 3%;
			border-bottom: #F1F1F1 1upx solid;
		}
		.info-item-left {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			.title {
				font-family: Georgia, 'Times New Roman', Times, serif;
				font-size: 1rem;
				font-weight: bold;
				color: #000000;
			}
			.datetime {
				padding-top: 20upx;
			}
		}
	}
	.toPAZX {
		flex-shrink: 0;
		background-color: #1261d4;
		width: 180rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 1rem;
		color: #FFFFFF;
		font-weight: 700;
		font-family: "Times New Roman", Times, serif;
	}
	// 订阅按钮
	.subscribe_style {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		right: 40upx;
		bottom: 30upx;
		overflow: hidden;
		z-index: 100000;
		display: flex;
		align-items: center;
		background-color: #1362D4;
		box-shadow: 2upx 2upx 10upx #000000;
		border-radius: 50%;
		view {
			font-size: 30upx;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
