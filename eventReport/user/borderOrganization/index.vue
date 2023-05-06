<template>
	<view style="padding: 15rpx;">
		<view>
			<u-form :model="dataTemp" ref="uForm" label-width="160" :error-type="errorType">
				<u-form-item label="防控点名称:">
					<u-input type="select" :select-open="pointSelectShow" :border="true" v-model="dataTemp.pointName"
					 @click="pointSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="id" label-name="name" :list="pointList" v-model="pointSelectShow"
					 @confirm="pointSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item>
					<map :id="maps" ref="maps" class="mapinfo" :enable-3D="false" :latitude="coordinate.lat" :longitude="coordinate.lng"
					 :markers="covers" :show-location="true" enable-overlooking="false" :scale="scale" :show-compass="true" @tap="tapMap">
					</map>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="getCurrentCustomStyle" @click="getCurrent" :loading="buttonLoading">获取当前位置</u-button>
		</view>
		<view style="margin-top: 2%;">
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">更新位置信息</u-button>
		</view>
	</view>
</template>

<script>
	import StrongAndSolidAPI from '../../../api/strongAndSolidProof.js'
	export default {
		data() {
			return {
				getCurrentCustomStyle: {
					backgroundColor: '#67C23A',
					color: '#FFFFFF',
					width: '90%',
					height: '85rpx'
				},
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '85rpx'
				},
				scale: 18,
				coordinate: {
					lat: '22.009029',
					lng: '100.797071',
					mapType: 2
				},
				maps: '1',
				covers: [],
				dataTemp: {
					coordinate: {
						lat: '',
						lng: ''
					},
					name: '',
					parentOrgId: '',
					regionCode: '',
					shortName: '',
					pointName: '',
					pointId: '',
					sort: ''
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				pointList: [],
				pointSelectShow: false
			}
		},
		onLoad() {
			this.pointList = uni.getStorageSync('borderUserpointOrgInfos');
			this.dataTemp.pointName = this.pointList[0].name
			this.dataTemp.pointId = this.pointList[0].id
			this.getLocation()
		},
		methods: {
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...',
				})
				StrongAndSolidAPI.getBorderOrganization(_this.dataTemp.pointId).then(res => {
					if (res.statusCode == 200) {
						_this.dataTemp = Object.assign(_this.dataTemp, res.data.data)
						if (_this.dataTemp.pointTenTenantsJosn != null) {
							_this.covers = []
							_this.covers.push({
								id: 1,
								longitude: _this.dataTemp.pointTenTenantsJosn.lng,
								latitude: _this.dataTemp.pointTenTenantsJosn.lat,
								iconPath: '/eventReport/static/img/fkd.png',
								width: 28,
								height: 28,
							})
							_this.coordinate.lat = _this.dataTemp.pointTenTenantsJosn.lat
							_this.coordinate.lng = _this.dataTemp.pointTenTenantsJosn.lng
						}
					}
					uni.hideLoading()
				})
			},
			tapMap(e) {
				this.covers = []
				var that = this;
				this.covers.push({
					id: 1,
					longitude: e.detail.longitude,
					latitude: e.detail.latitude,
					iconPath: '/eventReport/static/img/fkd.png',
					width: 28,
					height: 28,
				})
				this.coordinate.lat = e.detail.latitude,
				this.coordinate.lng = e.detail.longitude
				var id = e.currentTarget.id;
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				});
			},
			getLocation() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.covers = []
						_this.covers.push({
							id: 1,
							longitude: res.longitude,
							latitude: res.latitude
						})
						_this.coordinate.lat = res.latitude
						_this.coordinate.lng = res.longitude
						if (_this.dataTemp.pointId != '') {
							_this.fetchDetail()
						}
					}
				});
			},
			getCurrent() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.covers = []
						_this.covers.push({
							id: 1,
							longitude: res.longitude,
							latitude: res.latitude
						})
						_this.coordinate.lat = res.latitude
						_this.coordinate.lng = res.longitude
					}
				});
			},
			// 防控点选择
			pointSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.pointName = val.label
					this.dataTemp.pointId = val.value
					this.fetchDetail()
				})
			},
			// 保存数据
			saveData() {
				var _this = this
				var postData = {
					orgId: _this.dataTemp.id,
					coordinate: {
						lng: _this.coordinate.lng,
						lat: _this.coordinate.lat
					},
					mapType: 2
				}
				_this.buttonLoading = true
				StrongAndSolidAPI.fitBorderOrganization(postData).then(res => {
					console.log('修改结果', res)
					if (res.data.code === 0) {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					} else {
						uni.showToast({
							title: '修改失败:' + res.data.desc,
							icon: 'none'
						})
						_this.buttonLoading = false
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		padding: 20upx 40upx;
	}
	.mapinfo {
		height: 52vh;
		width: 100%;
	}
</style>
