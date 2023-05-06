<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="填报日期:" :required="true" prop="reportTime" label-width="140">
					<u-input type="select" :select-open="reportDateShow" v-model="dataTemp.reportTime"
						:border="true" placeholder="请选择填报时间" @click="reportDateShow = true" />
					<u-calendar v-model="reportDateShow" mode="date" @change="dateSelectConfirm"></u-calendar>
				</u-form-item>
			</u-form>
		</view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="160" :error-type="errorType">
				<view v-for="(item,index) in dataTemp.itemSet" :key="item.typeId">
					<view style="height: 70rpx;line-height: 70rpx;text-align: center;background-color: #ececec;color: #000000;">{{item.typeNmae}}</view>
					<view style="width: 100%;height: 120rpx;line-height: 120rpx;display: flex;">
						<view style="width: 95%;height: 120rpx;line-height: 120rpx;">
							<u-form-item label="当前使用量:" :required="true">
								<input
									v-model.trim="item.usedUnit" 
									cursor-spacing="180px"
									placeholder="请填写该物资使用量"
									style="border: 1rpx #ececec solid;width: 100%;height: 70rpx;line-height: 70rpx;"
								/>
							</u-form-item>
						</view>
						<view style="width: 5%;height: 120rpx;line-height: 120rpx;">
							{{item.unit}}
						</view>
					</view>
					<view style="width: 100%;height: 120rpx;line-height: 120rpx;display: flex;">
						<view style="width: 95%;height: 120rpx;line-height: 120rpx;">
							<u-form-item label="剩余库存量:" :required="true">
								<input
									v-model.trim="item.leftUnit" 
									cursor-spacing="180px"
									placeholder="请填写该物资剩余量"
									style="border: 1rpx #ececec solid;width: 100%;height: 70rpx;line-height: 70rpx;"
								/>
							</u-form-item>
						</view>
						<view style="width: 5%;height: 120rpx;line-height: 120rpx;">
							{{item.unit}}
						</view>
					</view>
				</view>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
	</view>
</template>

<script>
	import DictionaryApi from '../../../api/dictionary.js'
	import StrongAndSolidProof from '../../../api/strongAndSolidProof.js'
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
				dataTemp: {
					coordinate: {
						lat: '',
						lng: ''
					},
					itemSet: [],
					mapType: 2,
					openid: '',
					reportTime: ''
				},
				rules: {
					reportTime: [{
						required: true,
						message: '请选择填报时间',
						trigger: ['change', 'blur'],
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				reportDataList: []
			}
		},
		onShow() {
		},
		created() {
			this.dataTemp.mapType = this.$MapType
			this.dataTemp.reportTime = new moment().format('YYYY-MM-DD')
			this.getLogisticsMaterialTypeList()
			this.getLocation()
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			getLogisticsMaterialTypeList() {
				StrongAndSolidProof.getLogisticsMaterialTypeList().then(res => {
					if (res.data.code === 0) {
						res.data.data.forEach(element => {
							this.dataTemp.itemSet.push({
								typeNmae: element.name,
								typeId: element.id,
								dataTypeDesc: element.dataTypeDesc,
								unit: element.unit,
								usedUnit: '0',
								leftUnit: '0'
							})
						})
					}
				})
			},
			// 填报数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				_this.dataTemp.openid = openid
				_this.buttonLoading = true
				for (let i = 0; i < _this.dataTemp.itemSet.length; i++) {
					if (i != _this.dataTemp.itemSet.length - 1) {
						if (_this.dataTemp.itemSet[i].usedUnit == '') {
							uni.showToast({
								title: '请填写' + _this.dataTemp.itemSet[i].typeNmae + '当前使用量',
								icon: 'none'
							})
							break;
						} else if (_this.dataTemp.itemSet[i].leftUnit == '') {
							uni.showToast({
								title: '请填写' + _this.dataTemp.itemSet[i].typeNmae + '剩余库存量',
								icon: 'none'
							})
							break;
						} else if (_this.dataTemp.itemSet[i].dataTypeDesc == '整数' && this.$u.test.digits(_this.dataTemp.itemSet[i].usedUnit) != true) {
							uni.showToast({
								title: '请正确填写' + _this.dataTemp.itemSet[i].typeNmae + '当前使用量, 只能填写整数',
								icon: 'none'
							})
							break;
						} else if (_this.dataTemp.itemSet[i].dataTypeDesc == '整数' && this.$u.test.digits(_this.dataTemp.itemSet[i].leftUnit) != true) {
							uni.showToast({
								title: '请正确填写' + _this.dataTemp.itemSet[i].typeNmae + '剩余库存量, 只能填写整数',
								icon: 'none'
							})
							break;
						}
					} else {
						if (_this.dataTemp.itemSet[i].usedUnit == '') {
							uni.showToast({
								title: '请填写' + _this.dataTemp.itemSet[i].typeNmae + '当前使用量',
								icon: 'none'
							})
							break;
						} else if (_this.dataTemp.itemSet[i].leftUnit == '') {
							uni.showToast({
								title: '请填写' + _this.dataTemp.itemSet[i].typeNmae + '剩余库存量',
								icon: 'none'
							})
							break;
						} else if (_this.dataTemp.itemSet[i].dataTypeDesc == '整数' && this.$u.test.digits(_this.dataTemp.itemSet[i].usedUnit) != true ) {
							uni.showToast({
								title: '请正确填写' + _this.dataTemp.itemSet[i].typeNmae + '当前使用量, 只能填写整数',
								icon: 'none'
							})
							break;
						} else if (_this.dataTemp.itemSet[i].dataTypeDesc == '整数' && this.$u.test.digits(_this.dataTemp.itemSet[i].leftUnit) != true ) {
								uni.showToast({
									title: '请正确填写' + _this.dataTemp.itemSet[i].typeNmae + '剩余库存量, 只能填写整数',
									icon: 'none'
								})
						} else {
							console.log('aaaaaaaaaaaaa', this.dataTemp)
							StrongAndSolidProof.addLogisticsMaterialReport(this.dataTemp).then(res => {
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
								}
							})
						}
					}
				}
				_this.buttonLoading = false
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
