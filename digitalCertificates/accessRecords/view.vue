<template>
	<view>
		<view class="list-info">
			<view style="height: 60vh;">
				<MapView ref="mapView" :recorId="recorId"></MapView>
			</view>
			<view class="list-content">
				<view style="margin: 2%;">
					<view style="text-align: center;margin-top: 1vh;color: #000000;font-weight: 800;">查验信息</view>
					<view class="u-flex">
						<view style="width: 25%;text-align: left;">查验时间</view>
						<view style="width: 75%;text-align: left;">{{ dataTemp.reportTime }}</view>
					</view>
					<view class="u-flex">
						<view style="width: 25%;text-align: left;">查验机构</view>
						<view style="width: 75%;text-align: left;">{{ dataTemp.workerOrgName }}</view>
					</view>
					<view class="u-flex">
						<view style="width: 25%;text-align: left;">查验人</view>
						<view style="width: 75%;text-align: left;">{{ dataTemp.workerName }}</view>
					</view>
					<view style="text-align: center;margin-top: 1vh;color: #000000;font-weight: 800;">人员信息</view>
					<view style="width: 100%;display: flex;">
						<view style="width: 70%;">
							<view>姓名:{{ userInfo.name }} </view>
							<view>性别:{{ userInfo.gender }} </view>
							<view>出生日期:{{ userInfo.birthday }} </view>
							<view>联系方式:{{ userInfo.mobile }} </view>
						</view>
						<view style="width: 30%;">
							<image
								:src="imgPath"
								mode="aspectFill"
								:lazy-load="true"
								@load="onoff='1'"
								style="height: 18vh;border-radius: 10rpx;"
							/>
						</view>
					</view>
					<view>身份证号:{{ userInfo.idCard }} </view>
					<view>登记地址:{{ userInfo.residenceAddress }} </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import DigitalCertificates from '@/api/digitalCertificates.js'
	import FileApi from '@/api/fileupload.js'
	import MapView from '../mapview/mapview'
	
	export default {
		filters: {
			contentFilter(val) {
				if (!val) {
					return '无'
				}
				return val
			}
		},
		components: {
			MapView
		},
		data() {
			return {
				dataTemp: {},
				recorId: '',
				userInfo: {},
				imgPath: ''
			}
		},
		onLoad(option) {
			this.recorId = option.id
			if (this.recorId !== '') {
				this.fetchLoad()
			}
		},
		methods: {
			fetchLoad() {
				var _this = this
				DigitalCertificates.getPointManagementDaily(_this.recorId).then(res => {
					if (res.data.code === 0) {
						_this.dataTemp = res.data.data
						DigitalCertificates.getUserInfoMore(_this.dataTemp.residentId).then(res => {
							if (res.data.code === 0) {
								_this.userInfo = res.data.data.resident
								this.$nextTick(function() {
									FileApi.downloadFileByUni(_this.userInfo.photoFile).then(i => {
										_this.imgPath = i[1].tempFilePath
									})
								})
							} else {
								uni.showToast({
									title: '加载失败',
									icon: 'none'
								})
							}
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
</script>

<style lang="scss" scoped>
	.list-info {
		margin: 0% 3% 5% 3%;
	}
	.list-content {
		margin-top: 1vh;
		border: 5rpx #ececec solid;
		border-radius: 20rpx;
		line-height: 5vh;
		color: #000000;
		box-shadow:2px 2px 2px 2px #bbb;
	}
</style>
