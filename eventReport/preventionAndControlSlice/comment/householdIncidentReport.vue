<template>
	<view>
		<view v-if="houseList.length > 1" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item label="填报单位" :required="true">
					<u-input type="select" :select-open="houseSelectShow" :border="true" v-model="dataTemp.houseName"
					 @click="houseSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="id" label-name="name" :list="houseList" v-model="houseSelectShow"
					 @confirm="houseSelectConfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<u-form-item label="填报日期:" :required="true" prop="reportTime">
					<input type="select" :select-open="eventReportDateShow"
						v-model="dataTemp.reportTime" :border="true"
						placeholder="请选择事件发生时间" @click="eventReportDateShow = true" />
					<u-calendar v-model="eventReportDateShow" mode="date"
						@change="eventDateSelectConfirm"></u-calendar>
				</u-form-item>
				<u-form-item label="涉 案 人:" :required="true">
					<view class="cu-list menu" style="width: 100%;">
						<view v-for="(item,index) in eventPeopleList" :key="item.idcard" class="cu-item">
							<view style="display: flex;width: 100%;">
								<view style="width: 95%;text-align: left;">
									{{item.name}} <span style="margin-left: 10%;">{{item.mobile}}</span>
								</view>
								<view style="width: 5%;text-align: right;margin-left: 5%;"
									@click="deleteEventPeople(item)">
									<u-icon name="close-circle" size="20px" color="#fa3534"/>
								</view>
							</view>
						</view>
						<view style="text-align: center;">
							<u-button :custom-style="customAddStyle" size="mini" shape="square"
								@click="addEventPeople()">
								<u-icon name="plus-circle" size="20px" style="margin-right: 3%;" />
									添加涉案人员
								</u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="案件类型:" :required="true" prop="eventType">
					<u-input type="select" :select-open="eventTypeSelectShow" :border="true" v-model="dataTemp.eventType" placeholder="请选择案件类型"
					 @click="eventTypeSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text" :list="eventTypeList" v-model="eventTypeSelectShow"
					 @confirm="eventTypeSelectConfirm"></u-select>
				</u-form-item>
				<!-- <u-form-item label="查获地点:" :required="true" prop="region">
					<u-input type="select" :select-open="regionShow" v-model="dataTemp.region" :border="true" placeholder="请选择查获地点"
					 @click="regionShow = true" />
					<u-select
						v-model="regionShow"
						mode="mutil-column-auto"
						:list="tabbarList"
						label-name="name"
						value-name="regionCode"
						@confirm="regionConfirm"
					/>
				</u-form-item> -->
				<u-form-item label="简要案情:" :required="true" prop="eventDetail">
					<u-input v-model="dataTemp.eventDetail"
						type="textarea" :border="true"
						placeholder="请填写简要案情"
					/>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveEventData" :loading="buttonLoading">
				报送
			</u-button>
		</view>
		<u-popup v-model="peopleDetailShow" mode="top" min-height="700rpx">
			<view>
				<view class="peopleDetail">
					添加涉案人员信息
				</view>
				<view class="form">
					<u-form :model="peopleDataTemp" ref="uFormData" label-width="150" :error-type="errorType">
						<u-form-item label="姓名:" :required="true" prop="name">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="peopleDataTemp.name" placeholder="请填写涉案人员姓名"/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="身份证号:" :required="true" prop="idcard">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="peopleDataTemp.idcard" cursor-spacing="200px" :border="true"
										placeholder="请填写涉案人员身份证号码"
									/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="联系方式:" :required="true" prop="mobile">
							<input type="number" v-model="peopleDataTemp.mobile" autosize maxlength="11" placeholder="请输入联系方式" />
						</u-form-item>
						<!-- 图片 -->
						<u-form-item>
							<view class="upload-media">
								<view class="upload-video">
									<view class="bg-img item" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
										<image :src="imgList[index].imgPath" mode="aspectFill"></image>
										<view class="cu-tag bg-red icon-delete" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids uploadIcon" @tap="ChooseImage">
										<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
									</view>
								</view>
							</view>
						</u-form-item>
					</u-form>
					<view style="display: flex;width: 100%;">
						<view style="width: 50%;text-align: center;">
							<u-button style="width: 70%;" @click="peopleDetailShow = false" type="info" >取消</u-button>
						</view>
						<view style="width: 50%;text-align: center;">
							<u-button :custom-style="customAddStyle" style="width: 70%;" @click="addEventPeopleDetail()" >确定</u-button>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import DictionaryApi from '../../../api/dictionary.js'
	import PreventionAndControlSlice from '../../../api/preventionAndControlSlice.js'
	import moment from 'moment'
	export default {
		onShareAppMessage(){
			return {from:"menu"}
		},
		onShareTimeline(){},
		data() {
			return {
				eventPeopleList: [],
				eventTypeList: [],
				houseList: [],
				regionShow: false,
				houseSelectShow: false,
				eventTypeSelectShow: false,
				reportDateShow: false,
				eventReportDateShow: false,
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '100rpx'
				},
				customAddStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
				},
				hasAuth: false,
				peopleDetailShow: false,
				peopleDataTemp: {
					files: [],
					idcard: '',
					mobile: '',
					name: ''
				},
				imgList: [],
				dataTemp: {
					coordinate: {
						lat: '',
						lng: ''
					},
					eventDetail: '',
					eventType: '',
					eventTypeCode: '',
					involvedPeople: [],
					mapType: 2,
					openid: '',
					region: '',
					regionCode: '',
					houseName: '',
					orgId: '',
					reportTime: ''
				},
				rules: {
					reportTime: [{
						required: true,
						message: '请选择填报时间',
						trigger: ['change', 'blur'],
					}],
					eventType: [{
						required: true,
						message: '请选择案件类型',
						trigger: ['change', 'blur'],
					}],
					region: [{
						required: true,
						message: '请选择查获地点',
						trigger: ['change', 'blur'],
					}],
					eventDetail: [{
						required: true,
						message: '请填写简要案情',
						trigger: ['change', 'blur'],
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				tabbarList: [
					{
						regionCode: 1,
						name: '允景洪街道',
						children: [
							{
								regionCode: 2,
								name: '广东'
							},
							{
								regionCode: 3,
								name: '广西'
							}
						]
					},
					{
						regionCode: 4,
						name: '江北街道',
						children: [
							{
								regionCode: 5,
								name: '江北街道江北街道'
							}
						]
					},
					{
						regionCode: 6,
						name: '基诺山基诺族乡',
						children: [
							{
								regionCode: 7,
								name: 'XXXXXXX村委会'
							}
						]
					}
				]
			}
		},
		onShow() {},
		created() {
			this.dataTemp.reportTime = new moment().format('YYYY-MM-DD')
			this.dataTemp.houseName = uni.getStorageSync('borderUserorg').name
			this.dataTemp.orgId = uni.getStorageSync('borderUserorg').id
			this.fetchDir()
			this.getLocation()
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 防控户选择（预留）
			houseSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.houseName = val.label
					this.dataTemp.orgId = val.value
					this.getRecentlyReport()
				})
			},
			regionConfirm(e) {
				// e.forEach(element => {
				// 	this.dataTemp.region = + element.label
				// })
				this.dataTemp.region = e[1].label
				this.dataTemp.regionCode = e[1].value
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 取案件类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'dict_border_area_event_type'
				}).then(res => {
					this.$nextTick(function() {
						let resDataList = []
						resDataList = res.data.data
						resDataList.forEach(element => {
							element.checked = false
							element.disabled = false
						})
						this.eventTypeList = resDataList
					})
				})
			},
			eventTypeSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.eventType = val.label
					this.dataTemp.eventTypeCode = val.value
				})
			},
			// 选择图片表单中
			addIdCard() {
				var _self = this
				uni.chooseImage({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						uni.showLoading({
							title: '正在识别中...'
						})
						const invokeRes = wx.serviceMarket.invokeService({
						  service: 'wx79ac3de8be320b71', // '固定为服务商OCR的appid，非小程序appid',
						  api: 'OcrAllInOne',
						  data: {
							img_url: new wx.serviceMarket.CDN({
								type: 'filePath',
								filePath: res.tempFilePaths[0],
							 }),
							data_type: 3,
							ocr_type: 1,
						  },
						}).then(res => {
						  uni.hideLoading()
						  wx.showModal({
							title: '识别成功',
							content: '姓名：' + res.data.idcard_res.name.text + '，身份证件号码：' + res.data.idcard_res.id.text,
							success: function(i) {
								if (i.confirm == true) {
									_self.peopleDataTemp.name = ''
									_self.peopleDataTemp.idcard = ''
									_self.peopleDataTemp.name = res.data.idcard_res.name.text
									_self.peopleDataTemp.idcard = res.data.idcard_res.id.text
								}
							}
						  })
						}).catch(err => {
						  uni.hideLoading()
						  wx.showModal({
							title: '抱歉，识别失败',
							content: '请您重新检查需要上传的身份证背面图片后进行上传！',
						  })
						})
					}
				});
			},
			// 人员信息弹框
			addEventPeople() {
				this.peopleDataTemp = {
					files: [],
					idcard: '',
					mobile: '',
					name: ''
				},
				this.imgList = []
				this.peopleDetailShow = true;
			},
			// 添加涉案人员信息
			addEventPeopleDetail() {
				var _self = this
				var idCardreg = '(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)'
				var peopleTotal = _self.eventPeopleList.length
				if (_self.peopleDataTemp.name == '') {
					uni.showToast({
						title: '请填写涉案人员姓名',
						icon: 'none'
					})
				} else if (_self.peopleDataTemp.idcard == '') {
					uni.showToast({
						title: '请填写涉案人员身份证号',
						icon: 'none'
					})
				} else if (_self.peopleDataTemp.mobile == '') {
					uni.showToast({
						title: '请填写涉案人员联系方式',
						icon: 'none'
					})
				} else if(_self.$u.test.idCard(_self.peopleDataTemp.idcard) != true) {
					uni.showToast({
						title: '请正确填写涉案人员身份证号码',
						icon: 'none'
					})
				} else if(_self.$u.test.mobile(_self.peopleDataTemp.mobile) != true) {
					uni.showToast({
						title: '请正确填写涉案人员联系方式',
						icon: 'none'
					})
				} else {
					if (peopleTotal > 0) {
						_self.eventPeopleList.forEach(element => {
							if (element.idcard != _self.peopleDataTemp.idcard) {
								_self.imgList.forEach(item => {
									_self.peopleDataTemp.files.push(item.fileId)
								})
								_self.eventPeopleList.push(_self.peopleDataTemp)
								_self.peopleDetailShow = false;
							} else {
								uni.showToast({
									title: '该人员信息已经存在，请您检查后进行添加！',
									icon: 'none'
								})
							}
						})
					} else {
						_self.imgList.forEach(item => {
							_self.peopleDataTemp.files.push(item.fileId)
						})
						_self.eventPeopleList.push(_self.peopleDataTemp)
						_self.peopleDetailShow = false;
					}
				}
			},
			// 删除涉案人员记录
			deleteEventPeople(item, list) {
				for (var key in this.eventPeopleList) {
				    if (this.eventPeopleList[key].idcard === item.idcard) {
				      this.eventPeopleList.splice(key, 1)
				    }
				}
			},
			// 保存事件报送数据
			saveEventData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				_this.dataTemp.involvedPeople = _this.eventPeopleList
				if (_this.dataTemp.involvedPeople.length <= 0) {
					uni.showToast({
						title: '请添加涉案人员明细',
						icon: 'none'
					})
				} else {
					_this.dataTemp.involvedPeopleCount = _this.dataTemp.involvedPeople.length
					this.$refs.uForm.validate(valid => {
						_this.dataTemp.openid = openid
						if (valid) {
							_this.buttonLoading = true
							PreventionAndControlSlice.addBorderAreaEvent(this.dataTemp).then(res => {
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
			},
			// 选择图片表单中
			ChooseImage() {
				var _self = this
				uni.chooseImage({
					count: 9, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						res.tempFilePaths.forEach(item => {
							FileApi.uploadFileByUni(item).then(resupload => {
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
									_self.imgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
								}
							})
						})
					}
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			eventDateSelectConfirm(e) {
				this.dataTemp.reportTime = e.result
			}
		}
	}
</script>

<style lang="scss" scoped>
.form {
	padding: 20upx 40upx;
}
.peopleDetail {
	height: 80rpx;
	font-size: 30rpx;
	font-weight: bold;
	padding: 2%;
	border-bottom: 8upx solid #f1f1f1;
}
.report-viewarea {
	border-radius: 15px;
	border: 1px #909399 solid;
	margin:1% 2% 2% 2%;
	min-height: 350rpx;
	color: #000000;
}
.upload-media {
	border: #F1F1F1 1upx solid;
	width: 100%;
	display: flex;
	align-items: center;
	justify-items: flex-start;
}
.uploadIcon {
	text-align: center;
	width: 25%;
	height: 150upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.upload-video {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	flex: 1;
	padding: 10upx;
	.item {
		width: 150upx;
		height: 150upx;
	}
	video {
		border: #F1F1F1 1upx solid;
		width: 100%;
		height: 100%;
	}
	image {
		border: #F1F1F1 1upx solid;
		width: 100%;
		height: 100%;
	}
}
.icon-delete {
	width: 30upx;
	height: 30upx;
	position: relative;
	right: -110upx;
	top: -185upx;
	color: #FFFFFF;
	z-index: 999;
	border-radius: 50px;
}
</style>
