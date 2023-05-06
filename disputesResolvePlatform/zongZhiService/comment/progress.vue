<template>
	<view style="background-color: #ececec;min-height: 100vh;">
		<!-- 调解进度 -->
		<view class="progress-show">
			<u-time-line>
				<view v-for="item in recordHistoryList" :key="item.id">
					<u-time-line-item nodeTop="120">
						<template v-slot:node>
							<u-icon :name="item.iconName" :color="item.iconColor" :size="38"></u-icon>
						</template>
						<template v-slot:content>
							<view class="show-body">
								<view class="show-content">
									<view>
										<!-- 纠纷状态 -->
										<u-tag v-if="item.type == 0 " :text="item.typeDesc" type="success" />
										<u-tag v-if="item.type == 1 || item.type == 2 " :text="item.typeDesc" type="primary" />
										<u-tag v-if="item.type == 3 || item.type == 8 " :text="item.typeDesc" type="warning" />
										<u-tag v-if="item.type == 4 " :text="item.typeDesc" type="success" />
										<u-tag v-if="item.type == 5 " :text="item.typeDesc" type="error" />
										<u-tag v-if="item.type == 6 " :text="item.typeDesc" type="success" />
										<u-tag v-if="item.type == 7 " :text="item.typeDesc" type="warning" />
										<u-tag v-if="item.type == 9 " :text="item.typeDesc" type="success" />
										<u-tag v-if="item.type == 10 " :text="item.typeDesc" type="primary" />
										<u-tag v-if="item.type == 11 " :text="item.typeDesc" type="error" />
									</view>
									<view style="display: flex;">
										<view v-if="item.orgName != null">[ {{ item.orgName }} ] - </view>
										 <view>{{ item.userName }}</view>
									</view>
									<view>{{ item.createdDate }}</view>
									<view style="text-align: right;margin-bottom: 1vh;margin-right: 5%;">
										<!-- <u-button size="mini" type="primary" @click="viewNode(item)">
											查看详情
										</u-button> -->
									</view>
								</view>
							</view>
						</template>
					</u-time-line-item>
				</view>
			</u-time-line>
		</view>
		<u-popup v-model="historyShow" mode="center" width="650rpx" min-height="1000rpx" border-radius="10">
			<view class="partiesShow-form">
				<u-form :model="historyDataTemp" label-width="160rpx">
					<view class="historyShow-title">{{ historyDataTemp.historytypeDesc }}信息</view>
					<!-- 登记 -->
					<view v-if="historyDataTemp.historytype == 0">
						<u-form-item label="操作内容:"> {{ historyDataTemp.sourceTypeDesc }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.linkman }}</u-form-item>
						<u-form-item label="联系方式:"> {{ historyDataTemp.mobile }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
					</view>
					<!-- 受理信息 -->
					<view v-if="historyDataTemp.historytype == 1">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
					</view>
					<!-- 分流信息 -->
					<view v-if="historyDataTemp.historytype == 2">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="主办单位:"> {{ historyDataTemp.sponsorOrg.name }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
					</view>
					<!-- 催办信息 -->
					<view v-if="historyDataTemp.historytype == 3">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
						<u-form-item label="催办内容:"> {{ historyDataTemp.urgeDemand }}</u-form-item>
						<u-form-item label="限办时间:">
							{{ historyDataTemp.deadlineDate.year }}年
							{{ historyDataTemp.deadlineDate.monthValue }}月
							{{ historyDataTemp.deadlineDate.dayOfMonth }}日 之前
							</u-form-item>
					</view>
					<!-- 受理拒绝 -->
					<view v-if="historyDataTemp.historytype == 4">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
						<u-form-item label="调解结果:"> 调解成功</u-form-item>
					</view>
					<!-- 调解失败 -->
					<view v-if="historyDataTemp.historytype == 5">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
						<u-form-item label="调解结果:"> 调解失败</u-form-item>
					</view>
					<!-- 完成评价 -->
					<view v-if="historyDataTemp.historytype == 7">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="评价时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
						<u-form-item label="评价星级:">
							<u-rate active-color="#ff9900" :count="historyDataTemp.star" v-model="historyDataTemp.star"></u-rate>
						</u-form-item>
						<u-form-item label="评价内容:"> {{ historyDataTemp.content }}</u-form-item>
					</view>
					<!-- 督办 -->
					<view v-if="historyDataTemp.historytype == 8">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
						<u-form-item label="督办内容:"> {{ historyDataTemp.urgeDemand }}</u-form-item>
						<u-form-item label="限办时间:">
							{{ historyDataTemp.deadlineDate.year }}年
							{{ historyDataTemp.deadlineDate.monthValue }}月
							{{ historyDataTemp.deadlineDate.dayOfMonth }}日 之前
							</u-form-item>
					</view>
					<view v-if="historyDataTemp.historytype == 11">
						<u-form-item label="操作内容:"> {{ historyDataTemp.historytypeDesc }}</u-form-item>
						<u-form-item label="机构名称:"> {{ historyDataTemp.orgName }}</u-form-item>
						<u-form-item label="操作人:"> {{ historyDataTemp.userName }}</u-form-item>
						<u-form-item label="操作时间:"> {{ historyDataTemp.createdDate }}</u-form-item>
						<u-form-item label="拒绝原因:"> {{ historyDataTemp.refuseContent }}</u-form-item>
					</view>
					<view style="margin-bottom: 2vh;">
						<u-button @click="historyShow = false">关闭</u-button>
					</view>
				</u-form>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ZongZhiService from '@/api/zongZhiService.js'
	
	export default {
		props:["registId"],
		data() {
			return {
				recordHistoryList: [],
				historyShow: false,
				historyDataTemp: {}
			}
		},
		watch: {},
		created() {},
		mounted() {
			this.fetchDetail()
		},
		onShow() {},
		methods: {
			// 获取纠纷信息
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				ZongZhiService.getRecordHistoryList(_this.$props.registId).then(res => {
					if (res.data.code == 0) {
						_this.recordHistoryList = res.data.data
						console.log('qqqqqqqqq', _this.recordHistoryList)
						_this.recordHistoryList.forEach(element => {
							if (element.type == 0) {
								// 登记
								element.iconName = 'pushpin'
								element.iconColor = '#19be6b'
							} else if (element.type == 1) {
								// 受理
								element.iconName = 'checkmark'
								element.iconColor = '#2979ff'
							} else if (element.type == 2) {
								// 分流
								element.iconName = 'share'
								element.iconColor = '#2979ff'
							} else if (element.type == 3) {
								// 催办
								element.iconName = 'volume-up'
								element.iconColor = '#ff9900'
							} else if (element.type == 4) {
								// 调解成功
								element.iconName = 'checkmark-circle'
								element.iconColor = '#19be6b'
							} else if (element.type == 5) {
								// 调解失败
								element.iconName = 'close-circle'
								element.iconColor = '#fa3534'
							} else if (element.type == 7) {
								// 完成评价
								element.iconName = 'edit-pen'
								element.iconColor = '#ff9900'
							} else if (element.type == 8) {
								// 督办
								element.iconName = 'hourglass'
								element.iconColor = '#ff9900'
							} else if (element.type == 9) {
								// 督办
								element.iconName = 'email'
								element.iconColor = '#19be6b'
							} else if (element.type == 10) {
								// 办理
								element.iconName = 'cut'
								element.iconColor = '#2979ff'
							} else if (element.type == 11) {
								// 回复
								element.iconName = 'close'
								element.iconColor = '#fa3534'
							} 
						})
						uni.hideLoading()
					} else {
						uni.showToast({
							title: '查询失败请稍后重试。',
							icon: 'none'
						})
					}
				})
			},
			// 节点流水信息
			viewNode(item) {
				var _this = this
				DisputesResolvePlatform.getRecordHistoryType({ id: item.oprEntityId, type: item.type }).then(res => {
					if (res.data.code === 0) {
						_this.historyDataTemp = res.data.data
						_this.historyDataTemp.historytype = item.type
						_this.historyDataTemp.historytypeDesc = item.typeDesc
						_this.historyShow = true
						console.log('122222222', _this.historyDataTemp)
					} else {
						uni.showToast({
							title: '查看调解记录失败: 请检查后重试',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.progress-show {
		width: 100%;
		padding: 0px 5px 0px 20px;
	}
	.show-body {
		min-width: 650rpx;
		margin: 10px 0px 0px 0px;
		background-color: #FFFFFF;
		line-height: 4vh;
		border-radius: 5px;
		.show-content {
			padding: 5px 5px 0px 10px;
		}
	}
	.partiesShow-form {
		padding: 0px 10px 0px 10px;
	}
	.historyShow-title {
		height: 5vh;
		line-height: 5vh;
		text-align: center;
		font-size: 1rem;
	}
</style>
