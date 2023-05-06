<template>
	<view class="card-control" :style="{width: screenWidth+'%'}" @click="handleGoto">
		<view class="card-bg light bg-white text-white" style="background: linear-gradient(to right, #1261d4, #4AB0f6);color: #FFFFFF;box-shadow: 7px 7px 7px #888888;">
			<view class="card-content">
				<view class="padding-tb-sm padding-lr text-xl text-cut">
					<!-- <view>未添加</view> -->
					<text v-if="user.binderName !='未添加'" class="cuIcon-people"></text>
					<text v-if="user.binderName !='未添加'" class="margin-left-xs">{{user.binderName}}</text>
					<text v-if="user.binderName =='未添加'" class="margin-left-xs">还未添加绑定签约用户</text>
					<!-- <text v-if="user.binderName !='未添加'" class="text-xs margin-left-xs" style="margin-left: 50upx;">
						<view class="cu-tag xs round margin-left-xs shadow" :class="user.openCardStatus==0?'bg-green text-white':'bg-orange'">
							{{user.openCardStatusDesc}}
						</view>
					</text> -->
					<!-- <text v-if="user.binderName !='未添加'" class="text-xs margin-left-xs">{{user.agreementPayDesc}}</text>
					<text v-if="user.binderName !='未添加'" class="text-xs margin-left-xs">{{user.openCardStatusDesc}}</text> -->
				</view>
				<view class="padding text-sm">
				</view>
			</view>
			<view v-if="user.binderName!='未添加'" class="card-function flex justify-between align-end flex-wrap">
				<view class="padding-top-sm">
					<view class="item">
						<text class="cuIcon-home padding-right-xs"></text>
						所属学校：{{user.schoolName}}
					</view>
					<view class="item margin-top-xs">
						<text class="cuIcon-activity padding-right-xs">用户类型：{{user.bindTypeDesc}}</text>
						<text v-if="user.bindType =='0'" class="cuIcon-vipcard padding-right-xs" style="margin-left: 40upx;">所属班级：{{user.className}}</text>
					</view>
					<!-- <view class="item margin-top-xs">
						<text class="cuIcon-vipcard padding-right-xs"></text>
						班级：{{user.className}}
					</view> -->
				</view>
				<!-- <view class="">
					<view class="cu-tag xs round margin-left-xs shadow" :class="user.openCardStatus==0?'bg-green text-white':'bg-orange'">{{user.openCardStatusDesc}}</view>
				</view> -->
			</view>
			<view v-if="user.binderName =='未添加'">
				<view class="forget-btn">
					<button type="primary" class="btn-forgot-two">立即添加</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'

	export default {
		name: 'userCard',
		computed: {
			...mapState(['userInfo']),
			// ...mapGetters(['getValidData']),
			data3: function() {
				// console.log('validType', this.userInfo, this.validType)
				var userAuthData = {
					school: String,
					sex: String
				}
				if (this.isValid) {
					userAuthData['sex'] = this.userInfo.gender == 1 ? '男' : '女'
					userAuthData['school'] = this.userInfo.userAuthData['school']['result'][1]
				}

				return [{
					icon: 'friendfill',
					text: '学校：' + userAuthData['school']
				}, {
					icon: 'peoplefill',
					text: '性别：' + userAuthData['sex']
				}]
			},
		},
		props: {
			user: {
				type: Object,
				default: () => {
					var userInfo = {
						accountId: '',
						bindId: '',
						binderName: '未添加',
						schoolName: '',
						className: '',
						binderIdentityCode: '',
						bindStatus: 1,
						bindStatusDesc: '未绑定',
						agreementPay: 1,
						agreementPayDesc: '未签约',
						bindType: 0,
						bindTypeDesc: "",
						validTime: '',
						openCardStatus: 1,
						openCardStatusDesc: '未开通'
					}
					return userInfo
				}
			},
		},
		data() {
			// '访客','微信认证','学生认证'
			return {
				level: [{
						text: '访客',
						validtext: '点我登录',
						'path': '../login/login'
					},
					{
						text: '微信登录',
						validtext: '学生认证',
						'path': '../reg/reg'
					},
					{
						text: '学生',
						validtext: '学生认证',
						'path': '../reg/reg'
					},
				],
				screenWidth: 100,
				screenHeight: this.screenHeight,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				getValidData: 2
			}
		},
		mounted() {
			// console.log('mouted')
			var that = this
			// setTimeout(function() {
			// 	that.$forceUpdate()
			// }, 2000);
		},
		onLoad() {

		},
		updated() {
			var that = this
		},
		methods: {
			handleGoto() {
				if (this.user.binderName == '未添加') {
					console.log('11123123',this.user.binderName)
					my.navigateToMiniProgram({
						appId: '77700194',
						path: '/pages/payment-open-landing/index',
						extraData: {
							// "uid": "2088012098736637"
						},
						success: (res) => {
							console.log(res)
						},
						fail: (res) => {
							console.log(res)
						}
					});
				} else {
					uni.navigateTo({
						url: '../../pages/parentchildservice/detail/detail?bindId=' + this.user.bindId
					})
				}
			}
		}
	}
</script>

<style>
	.card-function {

		padding: 30upx 30upx 0 30upx;
	}

	.card-function .item {
		padding: 1vw;
		width: 100%;
	}

	.card-content {
		justify-content: space-between;
		display: flex;
		border-bottom: 1px solid #dbdbdb;
		border-top: 0px;
		border-left: 0px;
		border-right: 0px;
	}

	.card-title {
		font-size: 70upx;
		margin-top: 20upx;
		margin-left: 20upx;
	}

	.card-control {
		padding: 20upx;
	}

	.card-id {
		padding: 10upx;
	}

	.card-bg {
		width: 100%;
		padding: 10upx;
		border-radius: 20upx 20upx;
		min-height: 290upx;
		color: #979797;
		/* background-color: #ffffff; */
	}
	.forget-btn {
		padding: 10upx 20upx;
	}
	.btn-forgot-two {
		margin-top: 30upx;
		border-radius: 60upx;
		font-size: 16px;
		color: #fff;
		width: 100%;
		border-color: #FFFFFF;
		background: linear-gradient(to right, #1261d4, #4AB0f6);
		
	}
</style>
