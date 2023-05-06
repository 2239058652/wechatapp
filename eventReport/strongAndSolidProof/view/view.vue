<template>
	<view>
		<u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection>
		<view v-if="sectionCurrent==0" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
				<u-form-item label="填报日期:">
					{{dataTemp.reportTime}}
				</u-form-item>
				<u-form-item label="涉案人数:">
					{{dataTemp.involvedPeopleCount}} 人
				</u-form-item>
				<u-form-item label="涉案人明细:">
					<view class="cu-list menu" style="width: 100%;">
						<view v-for="(item,index) in dataTemp.peopleList" :key="item.idcard">
							<view style="border: 1px #ececec solid;margin-top: 1%;">
								<view style="width: 100%;">
									<view style="width: 95%;text-align: left;">
										{{item.name}} <span style="margin-left: 20%;">{{item.type}}</span>
									</view>
								</view>
								<view class="upload-files">
									<view class="upload-item-media">
										<view class="bg-img" v-for="(element,index) in item.imgList" :key="element.fileId" @click="ViewImage(item, element)" :data-url="element">
											<view class="item">
												<image :src="element.imgPath" mode="aspectFill"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="案件类型:">
					{{dataTemp.eventType}}
				</u-form-item>
				<u-form-item label="简要案情:">
					{{dataTemp.eventDetail}}
				</u-form-item>
				<u-form-item label="查获单位:">
					{{dataTemp.eventUnit | contentFilter }}
				</u-form-item>
				<u-form-item label="查获地点:">
					{{dataTemp.eventAddress | contentFilter }}
				</u-form-item>
				<u-form-item label="入境路线:">
					{{dataTemp.entityInfo | contentFilter }}
				</u-form-item>
				<u-form-item label="出境路线:">
					{{dataTemp.exitInfo | contentFilter }}
				</u-form-item>
				<u-form-item label="核酸检测信息:">
					{{dataTemp.nucleicAcidTest | contentFilter }}
				</u-form-item>
				<u-form-item label="联系民警姓名:">
					{{dataTemp.policeName | contentFilter }}
				</u-form-item>
				<u-form-item label="民警联系方式:">
					{{dataTemp.policeTel | contentFilter }}
				</u-form-item>
				<u-form-item label="其他信息:">
					{{dataTemp.otherInfo | contentFilter }}
				</u-form-item>
			</u-form>
		</view>
		<view v-if="sectionCurrent==1" class="">
			<MapView ref="mapView" :coordinate="(dataTemp.jsonGeo)"></MapView>
		</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import StrongAndSolidProof from '../../../api/strongAndSolidProof.js'
	import MapView from '../../eventhandle/mapview/mapview'
	import JsUtils from '../../../utils/index.js'
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
				dataTemp: {
					audioFiles: [],
					content: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					videoFiles: [],
					imageFiles: [],
				},
				imgList: [],
				videoList: [],
				errorType: ['toast', 'border'],
				tabsList: [{
					name: '填报信息'
				}, {
					name: '地理位置'
				}],
				sectionCurrent: 0
			}
		},
		onLoad(option) {
			this.reportId = option.id
			this.fetchDetail()
		},
		onShow() {},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			//加载报送详情
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '读取中',
				})
				StrongAndSolidProof.getBorderEventReportDetail(_this.reportId).then(res => {
					if (res.data.code == 0) {
						// Object.assign(this.dataTemp, res.data.data)
						_this.dataTemp = res.data.data
						_this.dataTemp.jsonGeo = {
							// lat: 22.016621,
							// lng: 100.806326
							lat:_this.dataTemp.geometryWktY,
							lng: _this.dataTemp.geometryWktX
						}
						console.log('AAAAAAAAAA', _this.dataTemp)
						_this.dataTemp.peopleList.forEach(element => {
							this.$set(element,'imgList',[])
							element.imageFiles.forEach(item => {
								this.$set(item, 'fileType', JsUtils.getFileType(item.name))
								if (item.fileType == 'img') {
									FileApi.downloadFileByUni(item.id).then(i => {
										element.imgList.push({
											imgPath: i[1].tempFilePath,
											fileId: item.id,
											fileType: item.fileType
										})
									})
								}
							})
						})
						uni.hideLoading()
					} else {
						uni.showToast({
							title: '加载失败，请返回后重试',
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			ViewImage(e, v) {
				this.isPreview = true
				let arr = Array.from(e.imgList, ({
					imgPath
				}) => imgPath)
				uni.previewImage({
					urls: arr,
					current: v.imgPath
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		padding: 20upx 40upx;
	}
	.upload-files {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-top: 1%;
		.upload-item-media {
			display: flex;
			flex: 1;
			flex-wrap: wrap;
			image {
				width: 185upx;
				height: 185upx;
				padding: 2%;
			}
		}
	}
</style>
