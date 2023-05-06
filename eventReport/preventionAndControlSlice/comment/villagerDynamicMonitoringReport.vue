<template>
	<view>
		<view v-if="houseList.length > 1" class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="150" :error-type="errorType">
				<u-form-item label="填报单位" :required="true">
					<u-input type="select" :select-open="houseSelectShow" :border="true" v-model="dataTemp.houseName"
					 @click="houseSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="id" label-name="name" :list="houseList" v-model="houseSelectShow"
					 @confirm="houseSelectConfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view class="form report-viewarea">
			<u-form :model="dataTemp" ref="uForm" label-width="200" :error-type="errorType">
				<u-form-item label="填报日期:" :required="true" prop="reportTime">
					<input type="select" :select-open="eventReportDateShow"
						v-model="dataTemp.reportTime" :border="true"
						placeholder="请选择事件发生时间" @click="eventReportDateShow = true" />
					<u-calendar v-model="eventReportDateShow" mode="date"
						@change="eventDateSelectConfirm"></u-calendar>
				</u-form-item>
				<u-form-item label="非本村可疑外来人员:">
					<view class="cu-list menu" style="width: 100%;">
						<view v-for="(item,index) in eventPeopleList" :key="item.index" class="cu-item">
							<view style="display: flex;width: 100%;">
								<view style="width: 95%;text-align: left;">
									{{item.name}} <span style="margin-left: 20%;">{{item.mobile}}</span>
								</view>
								<view style="width: 5%;text-align: right;margin-left: 5%;"
									@click="deleteEventPeople(item)">
									<u-icon name="close-circle" size="20px" color="#fa3534"/>
								</view>
							</view>
						</view>
						<view style="text-align: center;">
							<u-button :custom-style="customAddStyleHead" size="mini" shape="square"
								@click="addEventPeople()">
								<u-icon name="plus-circle" size="20px" style="margin-right: 3%;" />
									添加人员信息
								</u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="深夜外出村民:">
					<view class="cu-list menu" style="width: 100%;">
						<view v-for="(item,index) in lateNightPeopleList" :key="item.index" class="cu-item">
							<view style="display: flex;width: 100%;">
								<view style="width: 95%;text-align: left;">
									{{item.name}} <span style="margin-left: 20%;">{{item.mobile}}</span>
								</view>
								<view style="width: 5%;text-align: right;margin-left: 5%;"
									@click="deleteLateNightPeople(item)">
									<u-icon name="close-circle" size="20px" color="#fa3534"/>
								</view>
							</view>
						</view>
						<view style="text-align: center;">
							<u-button :custom-style="customAddStyleHead" size="mini" shape="square"
								@click="addLateNightPeople()">
								<u-icon name="plus-circle" size="20px" style="margin-right: 3%;" />
									添加人员信息
								</u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="境外务工人员:">
					<view class="cu-list menu" style="width: 100%;">
						<view v-for="(item,index) in overseasPeopleList" :key="item.index" class="cu-item">
							<view style="display: flex;width: 100%;">
								<view style="width: 95%;text-align: left;">
									{{item.name}} <span style="margin-left: 20%;">{{item.mobile}}</span>
								</view>
								<view style="width: 5%;text-align: right;margin-left: 5%;"
									@click="deleteOverseasPeople(item)">
									<u-icon name="close-circle" size="20px" color="#fa3534"/>
								</view>
							</view>
						</view>
						<view style="text-align: center;">
							<u-button :custom-style="customAddStyleHead" size="mini" shape="square"
								@click="addOverseasPeople()">
								<u-icon name="plus-circle" size="20px" style="margin-right: 3%;" />
									添加人员信息
								</u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="有境外务工史人员:">
					<view class="cu-list menu" style="width: 100%;">
						<view v-for="(item,index) in workHistoryPeopleList" :key="item.index" class="cu-item">
							<view style="display: flex;width: 100%;">
								<view style="width: 95%;text-align: left;">
									{{item.name}} <span style="margin-left: 20%;">{{item.mobile}}</span>
								</view>
								<view style="width: 5%;text-align: right;margin-left: 5%;"
									@click="deleteWorkHistoryPeople(item)">
									<u-icon name="close-circle" size="20px" color="#fa3534"/>
								</view>
							</view>
						</view>
						<view style="text-align: center;">
							<u-button :custom-style="customAddStyleHead" size="mini" shape="square"
								@click="addWorkHistoryPeople()">
								<u-icon name="plus-circle" size="20px" style="margin-right: 3%;" />
									添加人员信息
								</u-button>
						</view>
					</view>
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
					添加非本村可疑外来人员信息
				</view>
				<view class="form">
					<u-form :model="peopleDataTemp" ref="uFormData" label-width="190" :error-type="errorType">
						<u-form-item label="姓名:" :required="true" prop="name">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="peopleDataTemp.name" placeholder="请填写人员姓名"/>
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
										placeholder="请填写身份证号码"
									/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="联系方式:" :required="true" prop="mobile">
							<input type="number" v-model="peopleDataTemp.mobile" cursor-spacing="200px"
							autosize maxlength="11" :border="true" placeholder="请输入联系方式" />
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
		<u-popup v-model="lateNightPeopleDetailShow" mode="top" min-height="700rpx">
			<view>
				<view class="peopleDetail">
					添加深夜外出村民信息
				</view>
				<view class="form">
					<u-form :model="lateNightPeopleDataTemp" ref="uFormData" label-width="190" :error-type="errorType">
						<u-form-item label="姓名:" :required="true" prop="name">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="lateNightPeopleDataTemp.name" placeholder="请填写人员姓名"/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addLateNightPeopleIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="身份证号:" :required="true" prop="idcard">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="lateNightPeopleDataTemp.idcard" cursor-spacing="200px" :border="true"
										placeholder="请填写身份证号码"
									/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addLateNightPeopleIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="联系方式:" :required="true" prop="mobile">
							<input type="number" v-model="lateNightPeopleDataTemp.mobile" autosize maxlength="11" placeholder="请输入联系方式" />
						</u-form-item>
						<u-form-item label="外出事由:" :required="true" prop="reason">
							<input v-model="lateNightPeopleDataTemp.reason" height="180"
								type="textarea" placeholder="请填写外出事由"
							/>
						</u-form-item>
						<!-- 图片 -->
						<u-form-item>
							<view class="upload-media">
								<view class="upload-video">
									<view class="bg-img item" v-for="(item,index) in lateNightPeopleImgList" :key="index" @tap="ViewLateNightImage" :data-url="lateNightPeopleImgList[index]">
										<image :src="lateNightPeopleImgList[index].imgPath" mode="aspectFill"></image>
										<view class="cu-tag bg-red icon-delete" @tap.stop="DelLateNightImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids uploadIcon" @tap="lateNightChooseImage">
										<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
									</view>
								</view>
							</view>
						</u-form-item>
					</u-form>
					<view style="display: flex;width: 100%;">
						<view style="width: 50%;text-align: center;">
							<u-button style="width: 70%;" @click="lateNightPeopleDetailShow = false" type="info" >取消</u-button>
						</view>
						<view style="width: 50%;text-align: center;">
							<u-button :custom-style="customAddStyle" style="width: 70%;" @click="addLateNightPeopleDetail()" >确定</u-button>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="overseasPeopleDetailShow" mode="top" min-height="700rpx">
			<view>
				<view class="peopleDetail">
					添加境外务工人员信息
				</view>
				<view class="form">
					<u-form :model="overseasPeopleDataTemp" ref="uFormData" label-width="190" :error-type="errorType">
						<u-form-item label="姓名:" :required="true" prop="name">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="overseasPeopleDataTemp.name" placeholder="请填写人员姓名"/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addOverseasPeopleIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="身份证号:" :required="true" prop="idcard">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="overseasPeopleDataTemp.idcard" cursor-spacing="200px" :border="true"
										placeholder="请填写身份证号码"
									/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addOverseasPeopleIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="联系方式:" :required="true" prop="mobile">
							<input type="number" v-model="overseasPeopleDataTemp.mobile" autosize maxlength="11" placeholder="请输入联系方式" />
						</u-form-item>
						<u-form-item label="境外务工情况:" :required="true" prop="workCase">
							<input v-model="overseasPeopleDataTemp.workCase" height="180"
								type="textarea" placeholder="请填写境外务工情况"
							/>
						</u-form-item>
						<!-- 图片 -->
						<u-form-item>
							<view class="upload-media">
								<view class="upload-video">
									<view class="bg-img item" v-for="(item,index) in overseasPeopleImgList" :key="index" @tap="ViewOverseasImage" :data-url="overseasPeopleImgList[index]">
										<image :src="overseasPeopleImgList[index].imgPath" mode="aspectFill"></image>
										<view class="cu-tag bg-red icon-delete" @tap.stop="DelOverseasImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids uploadIcon" @tap="overseasChooseImage">
										<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
									</view>
								</view>
							</view>
						</u-form-item>
					</u-form>
					<view style="display: flex;width: 100%;">
						<view style="width: 50%;text-align: center;">
							<u-button style="width: 70%;" @click="overseasPeopleDetailShow = false" type="info" >取消</u-button>
						</view>
						<view style="width: 50%;text-align: center;">
							<u-button :custom-style="customAddStyle" style="width: 70%;" @click="addOverseasPeopleDetail()" >确定</u-button>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="workHistoryPeopleDetailShow" mode="top" min-height="700rpx">
			<view>
				<view class="peopleDetail">
					添加有境外务工史人员信息
				</view>
				<view class="form">
					<u-form :model="workHistoryPeopleDataTemp" ref="uFormData" label-width="190" :error-type="errorType">
						<u-form-item label="姓名:" :required="true" prop="name">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="workHistoryPeopleDataTemp.name" placeholder="请填写人员姓名"/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addWorkHistoryPeopleIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="身份证号:" :required="true" prop="idcard">
							<view style="width: 100%;display: flex;">
								<view style="width: 85%;">
									<input v-model="workHistoryPeopleDataTemp.idcard" cursor-spacing="200px" :border="true"
										placeholder="请填写身份证号码"
									/>
								</view>
								<view style="width: 15%;">
									<u-icon @click="addWorkHistoryPeopleIdCard()" name="camera" color="#2979ff" size="50" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="联系方式:" :required="true" prop="mobile">
							<input type="number" v-model="workHistoryPeopleDataTemp.mobile" autosize maxlength="11" placeholder="请输入联系方式" />
						</u-form-item>
						<u-form-item label="境外务工情况:" :required="true" prop="workCase">
							<input v-model="workHistoryPeopleDataTemp.workCase" type="textarea" placeholder="请填写境外务工情况"
							/>
						</u-form-item>
						<!-- 图片 -->
						<u-form-item>
							<view class="upload-media">
								<view class="upload-video">
									<view class="bg-img item" v-for="(item,index) in workHistoryPeopleImgList" :key="index" @tap="ViewWorkHistoryImage" :data-url="workHistoryPeopleImgList[index]">
										<image :src="workHistoryPeopleImgList[index].imgPath" mode="aspectFill"></image>
										<view class="cu-tag bg-red icon-delete" @tap.stop="DelWorkHistoryImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids uploadIcon" @tap="workHistoryChooseImage">
										<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传照片" label-pos="bottom"></u-icon>
									</view>
								</view>
							</view>
						</u-form-item>
					</u-form>
					<view style="display: flex;width: 100%;">
						<view style="width: 50%;text-align: center;">
							<u-button style="width: 70%;" @click="workHistoryPeopleDetailShow = false" type="info" >取消</u-button>
						</view>
						<view style="width: 50%;text-align: center;">
							<u-button :custom-style="customAddStyle" style="width: 70%;" @click="addWorkHistoryPeopleDetail()" >确定</u-button>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
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
				lateNightPeopleList: [],
				overseasPeopleList: [],
				workHistoryPeopleList: [],
				eventTypeList: [],
				houseList: [],
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
				customAddStyleHead: {
					height: '65rpx',
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
				},
				customAddStyle: {
					height: '85rpx',
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
				},
				hasAuth: false,
				// 非本村
				peopleDetailShow: false,
				peopleDataTemp: {
					files: [],
					idcard: '',
					mobile: '',
					name: ''
				},
				imgList: [],
				// 深夜外出
				lateNightPeopleDetailShow: false,
				lateNightPeopleDataTemp: {
					files: [],
					idcard: '',
					mobile: '',
					name: '',
					reason: ''
				},
				lateNightPeopleImgList: [],
				// 境外务工人员
				overseasPeopleDetailShow: false,
				overseasPeopleDataTemp: {
					files: [],
					idcard: '',
					mobile: '',
					name: '',
					workCase: ''
				},
				overseasPeopleImgList: [],
				// 有境外务工史
				workHistoryPeopleDetailShow: false,
				workHistoryPeopleDataTemp: {
					files: [],
					idcard: '',
					mobile: '',
					name: '',
					workCase: ''
				},
				workHistoryPeopleImgList: [],
				dataTemp: {
					coordinate: {
						lat: '',
						lng: ''
					},
					markedPeopleListVo: [],
					levaePeopleListVo: [],
					overseasPeopleListVo: [],
					historyOverseasPeopleListVo: [],
					mapType: 2,
					openid: '',
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
					eventDetail: [{
						required: true,
						message: '请填写简要案情',
						trigger: ['change', 'blur'],
					}]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
			}
		},
		onShow() {},
		created() {
			this.dataTemp.reportTime = new moment().format('YYYY-MM-DD')
			this.dataTemp.houseName = uni.getStorageSync('borderUserorg').name
			this.dataTemp.orgId = uni.getStorageSync('borderUserorg').id
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
			eventDateSelectConfirm(e) {
				this.dataTemp.reportTime = e.result
			},
			// 弹出非本村人员信息弹框
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
			// 身份证选择
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
			// 添加非本村可疑外来人员信息
			addEventPeopleDetail() {
				var _self = this
				var peopleTotal = _self.eventPeopleList.length
				if (_self.peopleDataTemp.name == '') {
					uni.showToast({
						title: '请填写人员姓名',
						icon: 'none'
					})
				} else if (_self.peopleDataTemp.idcard == '') {
					uni.showToast({
						title: '请填写身份证号',
						icon: 'none'
					})
				} else if (_self.peopleDataTemp.mobile == '') {
					uni.showToast({
						title: '请填写联系方式',
						icon: 'none'
					})
				} else if(_self.$u.test.idCard(_self.peopleDataTemp.idcard) != true) {
					uni.showToast({
						title: '请正确填写身份证号码',
						icon: 'none'
					})
				} else if(_self.$u.test.mobile(_self.peopleDataTemp.mobile) != true) {
					uni.showToast({
						title: '请正确填写联系方式',
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
			// 删除非本村可疑外来人员记录
			deleteEventPeople(item, list) {
				for (var key in this.eventPeopleList) {
				    if (this.eventPeopleList[key].idcard === item.idcard) {
				      this.eventPeopleList.splice(key, 1)
				    }
				}
			},
			// 选择可疑人员图片
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
			// 删除可疑人员图片
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			// 查看可疑人员图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			addLateNightPeopleIdCard() {
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
									_self.lateNightPeopleDataTemp.name = ''
									_self.lateNightPeopleDataTemp.idcard = ''
									_self.lateNightPeopleDataTemp.name = res.data.idcard_res.name.text
									_self.lateNightPeopleDataTemp.idcard = res.data.idcard_res.id.text
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
			// 弹出深夜外出人员信息弹框
			addLateNightPeople() {
				this.lateNightPeopleDataTemp = {
					files: [],
					idcard: '',
					mobile: '',
					name: '',
					reason: ''
				},
				this.lateNightPeopleImgList = []
				this.lateNightPeopleDetailShow = true;
			},
			// 添加深夜外出人员信息
			addLateNightPeopleDetail() {
				var _self = this
				var peopleTotal = _self.lateNightPeopleList.length
				if (_self.lateNightPeopleDataTemp.name == '') {
					uni.showToast({
						title: '请填写人员姓名',
						icon: 'none'
					})
				} else if (_self.lateNightPeopleDataTemp.idcard == '') {
					uni.showToast({
						title: '请填写人员身份证号',
						icon: 'none'
					})
				} else if (_self.lateNightPeopleDataTemp.mobile == '') {
					uni.showToast({
						title: '请填写人员联系方式',
						icon: 'none'
					})
				} else if (_self.lateNightPeopleDataTemp.reason == '') {
					uni.showToast({
						title: '请填写人员深夜外出原因',
						icon: 'none'
					})
				} else if(_self.$u.test.idCard(_self.lateNightPeopleDataTemp.idcard) != true) {
					uni.showToast({
						title: '请正确填写身份证号码',
						icon: 'none'
					})
				} else if(_self.$u.test.mobile(_self.lateNightPeopleDataTemp.mobile) != true) {
					uni.showToast({
						title: '请正确填写联系方式',
						icon: 'none'
					})
				} else {
					if (peopleTotal > 0) {
						_self.lateNightPeopleList.forEach(element => {
							if (element.idcard != _self.lateNightPeopleDataTemp.idcard) {
								_self.lateNightPeopleImgList.forEach(item => {
									_self.lateNightPeopleDataTemp.files.push(item.fileId)
								})
								_self.lateNightPeopleList.push(_self.lateNightPeopleDataTemp)
								_self.lateNightPeopleDetailShow = false;
							} else {
								uni.showToast({
									title: '该人员信息已经存在，请您检查后进行添加！',
									icon: 'none'
								})
							}
						})
					} else {
						_self.lateNightPeopleImgList.forEach(item => {
							_self.lateNightPeopleDataTemp.files.push(item.fileId)
						})
						_self.lateNightPeopleList.push(_self.lateNightPeopleDataTemp)
						_self.lateNightPeopleDetailShow = false;
					}
				}
			},
			// 删除深夜外出人员记录
			deleteLateNightPeople(item, list) {
				for (var key in this.lateNightPeopleList) {
				    if (this.lateNightPeopleList[key].idcard === item.idcard) {
				      this.lateNightPeopleList.splice(key, 1)
				    }
				}
			},
			// 选择深夜外出人员图片
			lateNightChooseImage() {
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
									_self.lateNightPeopleImgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
								}
							})
						})
					}
				});
			},
			// 删除深夜外出人员图片
			DelLateNightImg(e) {
				this.lateNightPeopleImgList.splice(e.currentTarget.dataset.index, 1)
			},
			// 预览深夜外出人员图片
			ViewLateNightImage(e) {
				uni.previewImage({
					urls: this.lateNightPeopleImgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 弹出外来务工人员信息弹框
			addOverseasPeople() {
				this.overseasPeopleDataTemp = {
					files: [],
					idcard: '',
					mobile: '',
					name: '',
					workCase: ''
				},
				this.overseasPeopleImgList = []
				this.overseasPeopleDetailShow = true;
			},
			addOverseasPeopleIdCard() {
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
									_self.overseasPeopleDataTemp.name = ''
									_self.overseasPeopleDataTemp.idcard = ''
									_self.overseasPeopleDataTemp.name = res.data.idcard_res.name.text
									_self.overseasPeopleDataTemp.idcard = res.data.idcard_res.id.text
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
			// 添加外来务工人员信息
			addOverseasPeopleDetail() {
				var _self = this
				var peopleTotal = _self.overseasPeopleList.length
				if (_self.overseasPeopleDataTemp.name == '') {
					uni.showToast({
						title: '请填写人员姓名',
						icon: 'none'
					})
				} else if (_self.overseasPeopleDataTemp.idcard == '') {
					uni.showToast({
						title: '请填写人员身份证号',
						icon: 'none'
					})
				} else if (_self.overseasPeopleDataTemp.mobile == '') {
					uni.showToast({
						title: '请填写人员联系方式',
						icon: 'none'
					})
				} else if (_self.overseasPeopleDataTemp.workCase == '') {
					uni.showToast({
						title: '请填写人员务工工作情况',
						icon: 'none'
					})
				} else if(_self.$u.test.idCard(_self.overseasPeopleDataTemp.idcard) != true) {
					uni.showToast({
						title: '请正确填写身份证号码',
						icon: 'none'
					})
				} else if(_self.$u.test.mobile(_self.overseasPeopleDataTemp.mobile) != true) {
					uni.showToast({
						title: '请正确填写联系方式',
						icon: 'none'
					})
				} else {
					if (peopleTotal > 0) {
						_self.overseasPeopleList.forEach(element => {
							if (element.idcard != _self.overseasPeopleDataTemp.idcard) {
								_self.overseasPeopleImgList.forEach(item => {
									_self.overseasPeopleDataTemp.files.push(item.fileId)
								})
								_self.overseasPeopleList.push(_self.overseasPeopleDataTemp)
								_self.overseasPeopleDetailShow = false;
							} else {
								uni.showToast({
									title: '该人员信息已经存在，请您检查后进行添加！',
									icon: 'none'
								})
							}
						})
					} else {
						_self.overseasPeopleImgList.forEach(item => {
							_self.overseasPeopleDataTemp.files.push(item.fileId)
						})
						_self.overseasPeopleList.push(_self.overseasPeopleDataTemp)
						_self.overseasPeopleDetailShow = false;
					}
				}
			},
			// 删除外来务工人员记录
			deleteOverseasPeople(item, list) {
				for (var key in this.overseasPeopleList) {
				    if (this.overseasPeopleList[key].idcard === item.idcard) {
				      this.overseasPeopleList.splice(key, 1)
				    }
				}
			},
			// 选择外来务工人员图片
			overseasChooseImage() {
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
									_self.overseasPeopleImgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
								}
							})
						})
					}
				});
			},
			// 删除外来务工人员图片
			DelOverseasImg(e) {
				this.overseasPeopleImgList.splice(e.currentTarget.dataset.index, 1)
			},
			// 预览外来务工人员图片
			ViewOverseasImage(e) {
				uni.previewImage({
					urls: this.overseasPeopleImgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 弹出有外来务工历史人员信息弹框
			addWorkHistoryPeople() {
				this.workHistoryPeopleDataTemp = {
					files: [],
					idcard: '',
					mobile: '',
					name: '',
					workCase: ''
				},
				this.workHistoryPeopleImgList = []
				this.workHistoryPeopleDetailShow = true;
			},
			addWorkHistoryPeopleIdCard() {
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
									_self.workHistoryPeopleDataTemp.name = ''
									_self.workHistoryPeopleDataTemp.idcard = ''
									_self.workHistoryPeopleDataTemp.name = res.data.idcard_res.name.text
									_self.workHistoryPeopleDataTemp.idcard = res.data.idcard_res.id.text
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
			// 添加有外来务工历史人员信息
			addWorkHistoryPeopleDetail() {
				var _self = this
				var peopleTotal = _self.workHistoryPeopleList.length
				if (_self.workHistoryPeopleDataTemp.name == '') {
					uni.showToast({
						title: '请填写人员姓名',
						icon: 'none'
					})
				} else if (_self.workHistoryPeopleDataTemp.idcard == '') {
					uni.showToast({
						title: '请填写人员身份证号',
						icon: 'none'
					})
				} else if (_self.workHistoryPeopleDataTemp.mobile == '') {
					uni.showToast({
						title: '请填写人员联系方式',
						icon: 'none'
					})
				} else if (_self.workHistoryPeopleDataTemp.workCase == '') {
					uni.showToast({
						title: '请填写人员务工情况',
						icon: 'none'
					})
				} else if(_self.$u.test.idCard(_self.workHistoryPeopleDataTemp.idcard) != true) {
					uni.showToast({
						title: '请正确填写身份证号码',
						icon: 'none'
					})
				} else if(_self.$u.test.mobile(_self.workHistoryPeopleDataTemp.mobile) != true) {
					uni.showToast({
						title: '请正确填写联系方式',
						icon: 'none'
					})
				} else {
					if (peopleTotal > 0) {
						_self.workHistoryPeopleList.forEach(element => {
							if (element.idcard != _self.workHistoryPeopleDataTemp.idcard) {
								_self.workHistoryPeopleImgList.forEach(item => {
									_self.workHistoryPeopleDataTemp.files.push(item.fileId)
								})
								_self.workHistoryPeopleList.push(_self.workHistoryPeopleDataTemp)
								_self.workHistoryPeopleDetailShow = false;
							} else {
								uni.showToast({
									title: '该人员信息已经存在，请您检查后进行添加！',
									icon: 'none'
								})
							}
						})
					} else {
						_self.workHistoryPeopleImgList.forEach(item => {
							_self.workHistoryPeopleDataTemp.files.push(item.fileId)
						})
						_self.workHistoryPeopleList.push(_self.workHistoryPeopleDataTemp)
						_self.workHistoryPeopleDetailShow = false;
					}
				}
			},
			// 删除有外来务工历史人员记录
			deleteWorkHistoryPeople(item, list) {
				for (var key in this.workHistoryPeopleList) {
				    if (this.workHistoryPeopleList[key].idcard === item.idcard) {
				      this.workHistoryPeopleList.splice(key, 1)
				    }
				}
			},
			// 选择有外来务工历史人员图片
			workHistoryChooseImage() {
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
									_self.workHistoryPeopleImgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
								}
							})
						})
					}
				});
			},
			// 删除有外来务工历史人员图片
			DelWorkHistoryImg(e) {
				this.workHistoryPeopleImgList.splice(e.currentTarget.dataset.index, 1)
			},
			// 预览有外来务工历史人员图片
			ViewWorkHistoryImage(e) {
				uni.previewImage({
					urls: this.workHistoryPeopleImgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 保存事件报送数据
			saveEventData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				// 非本村可疑外来人员
				_this.dataTemp.markedPeopleListVo = _this.eventPeopleList
				// 	夜深离村
				_this.dataTemp.levaePeopleListVo = _this.lateNightPeopleList
				// 	外出务工
				_this.dataTemp.overseasPeopleListVo = _this.overseasPeopleList
				// 	有外出务工历史
				_this.dataTemp.historyOverseasPeopleListVo = _this.workHistoryPeopleList
				this.$refs.uForm.validate(valid => {
					_this.dataTemp.openid = openid
					if (valid) {
						_this.buttonLoading = true
						PreventionAndControlSlice.addBorderAreaMonitor(this.dataTemp).then(res => {
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
