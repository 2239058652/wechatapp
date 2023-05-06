<template>
	<view>
		<view class="page-section page-section-gap">
			<map id="mapInfo" ref="mapInfo" class="mapinfo" :enable-3D="true" :latitude="coordinate.lat" :longitude="coordinate.lng"
			 :markers="covers" :show-location="true" enable-overlooking="true" :polygons="polygons" :scale="scale" :show-compass="true"
			 @markertap="markertap" @callouttap="markertap" @regionchange="regionchange">
			</map>
		</view>
		<u-popup v-model="popupShow" mode="bottom" width="600rpx" height="700rpx">
			<view class="padding">
				<u-form :model="dataTemp" ref="uFormJB" label-width="150" label-position="left">
					<u-form-item label="网格名称:" prop="targetOrgId" :border-bottom="true">
						<view class="flex justify-between">
							<view class="">
								{{dataTemp.name}}
							</view>
							<view class="text-blue" @click="showDuty">
								查看网格员职责
							</view>
						</view>
						<!-- <u-select v-model="leaderListShow" value-name="id" label-name="name" :list="leaderList" @confirm="leaderSelectConfirm"></u-select> -->
					</u-form-item>
					<u-form-item label="网格范围:" prop="gridRange" :border-bottom="true">
						<view class="">
							{{dataTemp.gridRange}}
						</view>
					</u-form-item>
					
					<u-form-item v-for="(item,index) in dataTemp.gridMember" :key="index" :label="item.name" label-position="left">
						<view class="text-blue" @click="makeCall(item.mobile)">
							{{item.mobile}}
							<u-icon name="phone-fill" color="#2979ff" margin-left="60rpx"></u-icon>
						</view>
					</u-form-item>
					<u-empty v-if="dataTemp.gridMember.length<=0" text="无网格员信息" mode="data" margin-top="30" icon-size="80"></u-empty>
				</u-form>
			</view>
		</u-popup>
		<u-popup v-model="dutyPop" mode="center" width="600rpx" height="800rpx">
			<view class="padding">
				<u-parse :html="dutyContent"></u-parse>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import MapGisApi from '../../../api/mapgis.js'
	import UserApi from '../../../api/user.js'
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				dutyPop: false,
				dutyContent: '',
				scale: 16,
				buttonLoading: false,
				popupShow: false,
				dataTemp: {
					gridMember: []
				},
				coordinate: {
					lat: '22.009029',
					lng: '100.797071',
					mapType: ''
				},
				covers: [],
				mapquery: {
					mapType: '',
					scopeCoordinates: []
				},
				polygons: [],
				gridList: []
			}
		},
		mounted() {
			this.fetchLocation()
			// this.fetchGrid()
		},
		onReady() {
			this.fetchGrid()
			this.fetchLocation()
		},
		methods: {
			showDuty() {
				UserApi.getUserDutyPublic().then(res => {
					console.log(res)
					this.$nextTick(function() {
						this.dutyContent = res.data.data
						console.log('this.dutyContent', this.dutyContent)
					})
				})
				this.dutyPop = true
			},
			makeCall(phoneNo) {
				if (phoneNo) {
					uni.makePhoneCall({
						// 手机号
						phoneNumber: phoneNo,
						// 成功回调
						success: (res) => {
							console.log('调用成功!')
						},
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}

					});
				}

			},
			handleClickButton() {},
			markertap(e) {
				console.log(e)
				let item = this.gridList[e.detail.markerId]
				console.log('点击事件', item)
				// uni.showModal({
				// 	title: '网格信息',
				// 	content: item.name,
				// 	showCancel: false
				// })
				this.dataTemp = Object.assign({
					gridMember: {}
				}, item)
				this.popupShow = true
				if (this.dataTemp) {
					let query = {
						orgId: this.dataTemp.id
					}
					UserApi.getUserListPublic(query).then(res => {
						console.log('网格人员', res)
						if (res.data.code == 0) {
							this.dataTemp.gridMember = res.data.data
						}

					})

				}
			},
			fetchGrid() {
				let _this = this
				// let params={
				// 	"coordinate.lat": '22.009029',
				// 	"coordinate.lng": '100.797071',
				// 	mapType: this.$MapType
				// }
				// MapGisApi.getGridByCoordinate(params).then(res => {
				// 	console.log('网格信息', res)
				// })
				let nmap = uni.createMapContext("mapInfo", this)
				// console.log(nmap.$getAppMap())
				let scale = this.scale
				// console.log(888, nmap)
				nmap.getScale({
					success: res => {
						console.log(999, res)
						scale = res.scale
					}
				})
				nmap.getRegion({
					success: res => {
						let obj = {
							latitude: {
								min: res.southwest.latitude.toString(),
								max: res.northeast.latitude.toString()
							},
							longitude: {
								min: res.southwest.longitude.toString(),
								max: res.northeast.longitude.toString()
							}
						}
						// console.log('11123123', res)
						// this.getMarks(obj);//捕获到对角线经纬度后，调用方法传参给后端
						let scopeCoordinates = [{
							lng: 0,
							lat: 0
						}]
						let query = {
							mapType: 2,
							scopeCoordinates: []
						}
						//西北角
						query.scopeCoordinates.push({
							lng: obj.longitude.min,
							lat: obj.latitude.max
						})
						// 东北角
						query.scopeCoordinates.push({
							lng: obj.longitude.max,
							lat: obj.latitude.max
						})
						// 东南角
						query.scopeCoordinates.push({
							lng: obj.longitude.max,
							lat: obj.latitude.min
						})
						// 西南角
						query.scopeCoordinates.push({
							lng: obj.longitude.min,
							lat: obj.latitude.min
						})

						MapGisApi.getGridByMapScope(query).then(res => {
							// console.log('网格数据', res)
							if (res.data.code == 0) {
								_this.polygons.length = 0
								_this.covers.length = 0
								_this.gridList = res.data.data
								// _this.polygons = _this.calGridCoordinate(res.data.data[0].jsonGeo)
								// _this.polygons.push(_this.calGridCoordinate(res.data.data[0].jsonGeo)[0])
								res.data.data.forEach((item, index) => {
									// console.log('转换后数据', _this.calGridCoordinate(item.jsonGeo))
									// 重构网格边界
									if (scale >= 16) {
										let arr = _this.calGridCoordinate(item.jsonGeo)
										_this.polygons = _this.polygons.concat(arr)
									}
									console.log('scale', scale)
									// if (scale > 11) {
									// 网格中心点标记
									let point = JSON.parse(item.centerJsonGeo)
									if (scale >= 16) {
										_this.covers.push({
											id: index,
											longitude: point.coordinates[0],
											latitude: point.coordinates[1],
											callout: {
												content: item.name,
												display: 'ALWAYS',
												padding: '10',
												backgroundColor: "#f1f1f1"
											},
											// width: 20,
											// height: 30
										})
									} else {
										_this.covers.push({
											id: index,
											longitude: point.coordinates[0],
											latitude: point.coordinates[1],
											callout: {
												content: item.name,
												display: 'BYCLICK',
												padding: '10',
												backgroundColor: "#cacaca"
											},
											// width: 20,
											// height: 30
										})
									}


									// }
								})
								// console.log('转换后数据', JSON.stringify(_this.polygons))
							}
						})
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				})
			},
			calGridCoordinate(jsonGeo) {
				let obj = JSON.parse(jsonGeo)
				// console.log('sssssss', obj)
				if (obj.type == 'MultiPolygon') {
					let iarr = []
					obj.coordinates.forEach(item => {
						item.forEach(i => {
							let earr = []
							i.forEach(e => {
								earr.push({
									longitude: e[0],
									latitude: e[1]
								})
							})
							if (earr.length > 0) {
								iarr.push({
									points: earr,
									fillColor: "#ADD8E693",
									strokeColor: "#1261d4",
									strokeWidth: 2,
									// zIndex: 1,
								})
							}
						})

					})
					// console.log('arr', iarr)
					return iarr
				}
			},
			regionchange() {
				this.fetchGrid()
			},
			fetchLocation() {
				var _this = this
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						// console.log(res)
						_this.coordinate.lat = res.latitude
						_this.coordinate.lng = res.longitude
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mapinfo {
		height: 100vh;
		width: 100%;
	}

	.control {
		position: absolute;
		top: 30upx;
		left: 2%;
		z-index: 999;
		width: 30%;
		background-color: #fff;
		height: 150upx;
	}
</style>
