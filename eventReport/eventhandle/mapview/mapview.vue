<template>
	<view>
		<view class="page-section page-section-gap">
			<map class="mapinfo" :latitude="latitude" :longitude="longitude" :markers="covers">
			</map>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			coordinate: {
				type: Object,
				default: () => {
					return {
						latitude: 22.016621,
						longitude: 100.806326,
					}
				}
			}
		},
		data() {
			return {
				latitude: '',
				longitude: '',
				covers: []
			}
		},
		mounted() {
			this.fetchLocation()
		},
		onShow() {
			this.fetchLocation()
		},
		methods: {
			// fetchLocation() {
			// 	var _this = this
			// 	uni.getLocation({
			// 		type: 'gcj02',
			// 		success: function(res) {
			// 			console.log(res)
			// 			_this.latitude = res.latitude
			// 			_this.longitude = res.longitude
			// 			JSON.stringify()
			// 			// latitude: 25.04347
			// 			// longitude: 102.70737
			// 		}
			// 	})
			// }
			fetchLocation() {
				console.log('this.coordinate', this.coordinate)
				if (this.coordinate) {
					this.latitude = this.coordinate.lat
					this.longitude = this.coordinate.lng
					this.covers = []
					this.covers.push({
						latitude: this.coordinate.lat,
						longitude: this.coordinate.lng,
						title: '报送地点'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mapinfo {
		height: 100vh;
		width: 100%;
	}
</style>
