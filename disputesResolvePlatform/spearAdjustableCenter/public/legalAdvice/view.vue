<template>
	<view style="background-color: #ececec;height: 100vh;">
		<u-tabs v-if="status != 2" :list="tabsListOne" :is-scroll="false" count="cate_count" :current="tabsIndex" @change="tabsChange" />
		<u-tabs v-if="status == 2" :list="tabsListTwo" :is-scroll="false" count="cate_count" :current="tabsIndex" @change="tabsChange" />
		<!-- 咨询信息 -->
		<view v-if="tabsIndex == 0">
			<view style="display: flex;width: 100%;">
				<view style="text-align: center;height: 100rpx;line-height: 100rpx;width: 10%;margin-top: 20rpx;">
					<img src="../../../statics/img/zixun.svg" mode="widthFix" style="width: 65rpx;height: 65rpx;margin-top: 20rpx;">
				</view>
				<view style="width: 80%;">
					<u-card :show-head="false">
						<view class="content" slot="body">
							<view class="show-body">
								<view class="bodyTop">问题类型: {{ dataTemp.typeDesc }}</view>
								<view class="bodyTop"><view class="content-show">{{ dataTemp.question }}</view></view>
								<view style="font-size: small;text-align: right;margin-top: 5%;margin-bottom: -2%;">{{ dataTemp.createdDate }}</view>
							</view>
						</view>
					</u-card>
				</view>
			</view>
			<view v-for="advisoryReplyRecord in dataTemp.advisoryReplyRecordList" :key="advisoryReplyRecord.id">
				<view style="display: flex;width: 100%;">
					<view style="width: 10%;" />
					<view style="width: 80%;">
						<u-card :show-head="false">
							<view class="content" slot="body">
								<view class="show-body">
									<view class="bodyTop">
											{{ advisoryReplyRecord.orgName }}
											{{ advisoryReplyRecord.userName }}
									</view>
									<view class="bodyTop">
									<view class="content-show">
										{{ advisoryReplyRecord.content }}
									</view></view>
									<view style="font-size: small;text-align: right;margin-top: 5%;margin-bottom: -2%;">{{ advisoryReplyRecord.createdDate }}</view>
								</view>
							</view>
						</u-card>
					</view>
					<view style="text-align: center;height: 100rpx;line-height: 100rpx;width: 10%;margin-top: 20rpx;">
						<img src="../../../statics/img/huifu.svg" mode="widthFix" style="width: 65rpx;height: 65rpx;margin-top: 20rpx;">
					</view>
				</view>
			</view>
		</view>
		<!-- 评价信息 -->
		<view v-if="tabsIndex == 1">
			<u-card :show-head="false" style="margin-bottom: 2vh;min-height: 800rpx;">
				<view class="content" slot="body">
					<view class="show-head-title">
						<view class="titleLeft"><u-icon name="integral" color="#2979ff" size="50"></u-icon></view>
					</view>
					<view class="show-body">
						<view class="bodyTop">评价时间: {{ dataTemp.advisoryEvaluateRecord.createdDate }}</view>
						<view class="bodyTop">评价星级:
							<u-rate active-color="#ff9900" :count="count" v-model="star"></u-rate>
						</view>
						<view class="bodyTop">评价内容:
						<view class="content-show">
							{{ dataTemp.advisoryEvaluateRecord.content }}
						</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
	import LegalAdvice from '../../../../api/legalAdvice.js'
	export default {
		components: {},
		data() {
			return {
				src: '',
				tabsListOne: [
					{name: '咨询信息'}
				],
				tabsListTwo: [
					{name: '咨询信息'},
					{name: '评价信息'}
				],
				count: 5,
				value: 5,
				star: 5,
				dataTemp: {},
				tabsIndex: 0,
				status: '',
				id: ''
			}
		},
		watch: {},
		onLoad(option) {
			if (option.id) {
				this.id = option.id
			}
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			// 选项卡切换
			tabsChange(index) {
				this.tabsIndex = index
			},
			fetchDetail() {
				var _this = this
				LegalAdvice.viewMediateAdvisory(_this.id).then(res => {
					_this.dataTemp = Object.assign({}, res.data.data)
					_this.dataTemp.typeDesc = _this.dataTemp.type.text
					_this.star = _this.dataTemp.advisoryEvaluateRecord.star
					_this.status = _this.dataTemp.status
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.show-head-title {
		border-bottom: 1px #ececec solid;
		height: 70rpx;
		width: 100%;
		display: flex;
		.titleLeft {
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			text-align: left;
			font-weight: bold;
		}
	}
	.show-body {
		min-height: 100rpx;
		.bodyTop {
			margin-top: 2%;
			margin-left: 2%;
			line-height: 40rpx;
			text-align: left;
			font-weight: bold;
			word-wrap:break-word;  
			word-break:break-all;
			.content-show {
				text-indent:2em;
				font-weight: 100;
			}
		}
	}
</style>
