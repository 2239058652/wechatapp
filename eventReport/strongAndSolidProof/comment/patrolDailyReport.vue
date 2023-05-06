<template>
	<view>
		<view class="report-viewarea">
			<view class="form">
				<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
					<u-form-item label="填报日期:" :required="true" prop="reportTime">
						<u-input type="select" :select-open="reportDateShow" v-model="dataTemp.reportTime"
							:border="true" placeholder="请选择事件发生时间" @click="reportDateShow = true" />
						<u-calendar v-model="reportDateShow" mode="date" @change="dateSelectConfirm"></u-calendar>
					</u-form-item>
				</u-form>
			</view>
			<view class="form">
				<u-divider>巡逻情况</u-divider>
				<u-form :model="dataTemp" ref="uForm" label-width="0" :error-type="errorType">
					<u-form-item prop="patrolDetail">
						<u-input v-model="dataTemp.patrolDetail" type="textarea"
							height="360" :border="true"
							placeholder="请填写巡逻情况"
						/>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData()" :loading="buttonLoading">提交</u-button>
		</view>
	</view>
</template>

<script>
	import DictionaryApi from '../../../api/dictionary.js'
	import StrongAndSolidProof from '../../../api/strongAndSolidProof.js'
	import RoleJS from '../../../utils/role.js'
	import moment from 'moment'
	export default {
		components: {},
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				reportDateShow: false,
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '100rpx'
				},
				hasAuth: false,
				dataTemp: {
					coordinate: {
						lat: '',
						lng: ''
					},
					mapType: 2,
					openid: '',
					patrolDetail: '',
					reportTime: ''
				},
				rules: {
					reportTime: [{
						required: true,
						message: '请选择填报时间',
						trigger: ['change', 'blur'],
					}],
					patrolDetail: [{
						required: true,
						message: '请填写巡逻情况',
						trigger: ['change', 'blur'],
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
			}
		},
		onShow() {
		},
		created() {
			this.dataTemp.mapType = this.$MapType
			this.dataTemp.reportTime = new moment().format('YYYY-MM-DD')
			this.getLocation()
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 保存平安报送数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				this.$refs.uForm.validate(valid => {
					_this.dataTemp.openid = openid
					if (valid) {
						_this.buttonLoading = true
						StrongAndSolidProof.addPatrolLogReport(this.dataTemp).then(res => {
							console.log('报送结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '填报成功，记得明日继续哦！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/main/main'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '报送失败:' + res.data.desc,
									icon: 'none'
								})
								_this.buttonLoading = false
							}
						})
						console.log('验证通过');
						console.log(this.dataTemp)
					} else {
						console.log('验证失败');
						_this.buttonLoading = false
					}
				});
			},
			getLocation() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.dataTemp.coordinate.lat = res.latitude
						_this.dataTemp.coordinate.lng = res.longitude
					}
				});
			},
			dateSelectConfirm(e) {
				this.dataTemp.reportTime = e.result
			},
			eventDateSelectConfirm(e) {
				this.eventDataTemp.reportTime = e.result
			}
		}
	}
</script>

<style lang="scss" scoped>
.form {
	padding: 20upx 40upx;
}
.report-viewarea {
	border-radius: 15px;
	border: 1px #909399 solid;
	margin:1% 2% 2% 2%;
	min-height: 350rpx;
	color: #000000;
}
</style>
