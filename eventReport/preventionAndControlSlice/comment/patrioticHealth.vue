<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item v-if="orgList.length > 1" label="填报单位" :required="true">
					<u-input type="select" :select-open="orgSelectShow" :border="true" v-model="dataTemp.orgName"
					 @click="orgSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="id" label-name="name" :list="orgList" v-model="orgSelectShow"
					 @confirm="orgSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item label="检查日期:" :required="true" prop="reportTime">
					<input type="select" :select-open="eventReportDateShow"
						v-model="dataTemp.reportTime" :border="true"
						placeholder="请选择检查日期" @click="eventReportDateShow = true" />
					<u-calendar v-model="eventReportDateShow" mode="date"
						@change="eventDateSelectConfirm"></u-calendar>
				</u-form-item>
				<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
					<u-form-item label="村户名称:" :required="true" prop="houseName">
						<u-input type="select" :select-open="houseSelectShow" :border="true" v-model="dataTemp.houseName" placeholder="请选择检查村户"
						 @click="houseSelectShow = true"></u-input>
						<u-select mode="single-column" value-name="id" label-name="name" :list="houseList" v-model="houseSelectShow"
						 @confirm="houseSelectConfirm"></u-select>
					</u-form-item>
				</u-form>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view style="height: 110rpx;">
					<u-icon name="tags" size="40" />
					一：房前屋后干净、卫生、整洁，房前不堆码柴草、杂物、建材、建渣、房屋周围沟系畅通，污水、粪水不随意排放。
				</view>
				<u-form-item prop="eventType" style="height: 80rpx;width: 90%;margin-left: 10%;">
					<u-radio-group
						v-model="dataTemp.itemA"
						size="45rpx" width="50%"
						:activeColor="itemAActiveColor"
						style="width: 100%;">
						<u-radio @change="itemAChange(item)" v-for="(item, index) in itemAList" :key="index"
							:name="item.value" :value="item.value" :text="item.label">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view style="height: 110rpx;">
					<u-icon name="tags" size="40" />
					 二：室内物品摆放整齐，墙壁无乱涂乱画，无果皮屑烟头，无乱堆乱放，室外无乱张帖广告、宣传画等。
				</view>
				<u-form-item prop="eventType" style="height: 80rpx;width: 90%;margin-left: 10%;">
					<u-radio-group
						v-model="dataTemp.itemB"
						size="45rpx" width="50%"
						:activeColor="itemBActiveColor"
						style="width: 100%;">
						<u-radio @change="itemBChange(item)" v-for="(item, index) in itemBList" :key="index"
							:name="item.value" :value="item.value" :text="item.label">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view style="height: 80rpx;">
					<u-icon name="tags" size="40" />
					三：衣物不乱挂乱晾，生产农具规范放置室内，不乱丢乱扔。
				</view>
				<u-form-item prop="eventType" style="height: 80rpx;width: 90%;margin-left: 10%;">
					<u-radio-group
						v-model="dataTemp.itemC"
						size="45rpx" width="50%"
						:activeColor="itemCActiveColor"
						style="width: 100%;">
						<u-radio @change="itemCChange(item)" v-for="(item, index) in itemCList" :key="index"
							:name="item.value" :value="item.value" :text="item.label">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view style="height: 80rpx;">
					<u-icon name="tags" size="40" />
					四：鸡鸭猪牛羊畜牧实行圈养，不敞放，圈舍保持干净卫生，并定期消毒。
				</view>
				<u-form-item prop="eventType" style="height: 80rpx;width: 90%;margin-left: 10%;">
					<u-radio-group
						v-model="dataTemp.itemD"
						size="45rpx" width="50%"
						:activeColor="itemDActiveColor"
						style="width: 100%;">
						<u-radio @change="itemDChange(item)" v-for="(item, index) in itemDList" :key="index"
							:name="item.value" :value="item.value" :text="item.label">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view style="height: 50rpx;">
					<u-icon name="tags" size="40" />
					五：垃圾入桶入箱，不乱扔乱丢。
				</view>
				<u-form-item prop="eventType" style="height: 80rpx;width: 90%;margin-left: 10%;">
					<u-radio-group
						v-model="dataTemp.itemE"
						size="45rpx" width="50%"
						:activeColor="itemEActiveColor"
						style="width: 100%;">
						<u-radio @change="itemEChange(item)" v-for="(item, index) in itemEList" :key="index"
							:name="item.value" :value="item.value" :text="item.label">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveEventData" :loading="buttonLoading">
				确定
			</u-button>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import BorderOrganization from '../../../api/borderOrganization.js'
	import PreventionAndControlSlice from '../../../api/preventionAndControlSlice.js'
	import moment from 'moment'
	export default {
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {
				orgList: [],
				houseList: [],
				orgSelectShow: false,
				houseSelectShow: false,
				eventReportDateShow: false,
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
					houseId: '',
					houseName: '',
					itemA: 0,
					itemB: 0,
					itemC: 0,
					itemD: 0,
					itemE: 0,
					mapType: 2,
					openid: '',
					orgId: '',
					orgName: '',
					reportTime: ''
				},
				rules: {
					reportTime: [{
						required: true,
						message: '请选择填报时间',
						trigger: ['change', 'blur'],
					}],
					houseName: [{
						required: true,
						message: '请选择检查村户',
						trigger: ['change', 'blur'],
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				itemAList: [{ label: '合格', value: 0 }, { label: '不合格', value: 1 }],
				itemBList: [{ label: '合格', value: 0 }, { label: '不合格', value: 1 }],
				itemCList: [{ label: '合格', value: 0 }, { label: '不合格', value: 1 }],
				itemDList: [{ label: '合格', value: 0 }, { label: '不合格', value: 1 }],
				itemEList: [{ label: '合格', value: 0 }, { label: '不合格', value: 1 }],
				itemAActiveColor: '#18b566',
				itemBActiveColor: '#18b566',
				itemCActiveColor: '#18b566',
				itemDActiveColor: '#18b566',
				itemEActiveColor: '#18b566'
			}
		},
		onShow() {},
		created() {
			this.dataTemp.reportTime = new moment().format('YYYY-MM-DD')
			this.dataTemp.orgName = uni.getStorageSync('borderUserorg').name
			this.dataTemp.orgId = uni.getStorageSync('borderUserorg').id
			this.fetchBorderOrganization()
			this.getLocation()
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 防控户选择（预留）
			orgSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.orgName = val.label
					this.dataTemp.orgId = val.value
					this.getRecentlyReport()
				})
			},
			//取数据字典
			fetchBorderOrganization() {
				BorderOrganization.getBorderOrganizationChild({
					parentId: uni.getStorageSync('borderUserorg').id
				}).then(res => {
					this.houseList = res.data.data
				})
			},
			// 户选择
			houseSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.houseName = val.label
					this.dataTemp.houseId = val.value
				})
			},
			// 日期选择切换
			eventDateSelectConfirm(e) {
				this.dataTemp.reportTime = e.result
			},
			// 合格不合格选择切换
			itemAChange(e) {
				if (e.value == 1) {
					this.itemAActiveColor = '#ff9900'
				} else {
					this.itemAActiveColor = '#18b566'
				}
			},
			itemBChange(e) {
				if (e.value == 1) {
					this.itemBActiveColor = '#ff9900'
				} else {
					this.itemBActiveColor = '#18b566'
				}
			},
			itemCChange(e) {
				if (e.value == 1) {
					this.itemCActiveColor = '#ff9900'
				} else {
					this.itemCActiveColor = '#18b566'
				}
			},
			itemDChange(e) {
				if (e.value == 1) {
					this.itemDActiveColor = '#ff9900'
				} else {
					this.itemDActiveColor = '#18b566'
				}
			},
			itemEChange(e) {
				if (e.value == 1) {
					this.itemEActiveColor = '#ff9900'
				} else {
					this.itemEActiveColor = '#18b566'
				}
			},
			// 保存事件报送数据
			saveEventData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				if (_this.dataTemp.houseId == '') {
					uni.showToast({
						title: '请选择检查村户',
						icon: 'none'
					})
				} else {
					this.$refs.uForm.validate(valid => {
						if (valid) {
							_this.buttonLoading = true
							PreventionAndControlSlice.addBorderAreaSanitation(this.dataTemp).then(res => {
								if (res.data.code === 0) {
									uni.showToast({
										title: '填报成功！',
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
						} else {
							_this.buttonLoading = false
						}
					});
				}
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
	margin:1% 2% 4% 2%;
	// min-height: 100rpx;
	color: #000000;
}
</style>
