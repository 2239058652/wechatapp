<template>
	<view>
		<map class="mapinfo" :latitude="latitude" :longitude="longitude" :markers="covers">
		</map>
	</view>
</template>

<script>
	import DigitalCertificates from '@/api/digitalCertificates.js'
	
	export default {
		props: {
			recorId: {
				type: String
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
		onShow() {},
		methods: {
			fetchLocation() {
				var _this = this
				if (_this.recorId !== '') {
					DigitalCertificates.getPointManagementDaily(_this.recorId).then(res => {
						if (res.data.code === 0) {
							_this.latitude = res.data.data.geometryWktY
							_this.longitude = res.data.data.geometryWktX
							_this.covers = []
							_this.covers.push({
								title: '查验地点',
								latitude: res.data.data.geometryWktY,
								longitude: res.data.data.geometryWktX
							})
						} else {
							uni.showToast({
								title: '加载失败',
								icon: 'none'
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mapinfo {
		height: 60vh;
		width: 100%;
	}
</style>
