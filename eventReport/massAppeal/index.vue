<template>
	<view>
		<view class="index-head">
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的填报" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140" :error-type="errorType">
				<view class="select_head">
					<view class="select_body">
						<u-form-item :required="true" prop="claimObject" :border-bottom="false">
							<u-input type="select" v-model="dataTemp.claimObject" :border="true" placeholder="请选择诉求类型"
							 @click="popupTypeShow=true"></u-input>
						</u-form-item>
					</view>
				</view>
				<u-form-item :required="true" prop="content">
					<u-input v-model="dataTemp.content" type="textarea"
						height="250" :border="true"
						placeholder="请填写诉求说明,为利于您反映的意见和建议得到及时处理,请明确填写相关问题的时间、地点、事件过程。"
					/>
				</u-form-item>
				<view class="u-flex u-row-between">
					<view>是否实名建议</view>
					<view><u-switch v-model="checked" /></view>
				</view>
				<!-- 姓名 -->
				<u-form-item v-if="checked" :required="true" prop="name">
					<u-input v-model="dataTemp.name" :border="true" placeholder="请输入姓名"/>
				</u-form-item>
				<!-- 身份证件号 -->
				<u-form-item v-if="checked" :required="true" prop="idCard">
					<u-input v-model="dataTemp.idCard" :border="true" placeholder="请输入身份证件号"/>
				</u-form-item>
				<!-- 联系方式 -->
				<u-form-item :required="true" prop="contact">
					<u-input type="number" v-model="dataTemp.contact" autosize maxlength="11" :border="true" placeholder="请输入联系方式" />
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
				<!-- 视频 -->
				<u-form-item>
					<view class="upload-media">
						<view class="upload-video">
							<view class="bg-img item" v-for="(item,index) in videoList" :key="index" @tap="viewVideo" :data-url="videoList[index]">
								<video id="myVideo" :src="videoList[index].videoPath" x5-video-player-fullscreen="true"></video>
								<view class="cu-tag bg-red icon-delete" @tap.stop="delVideo" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids uploadIcon" @tap="chooseVideo">
								<u-icon class="icon" color="#8799a3" size="48" name="camera" label="上传视频" label-pos="bottom"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view>
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button>
		</view>
		<u-popup v-model="popupTypeShow" mode="bottom" min-height="600rpx">
			<view>
				<view style="height: 80rpx;font-size: 40rpx;font-weight: bold;padding: 2%;border-bottom: 8upx solid #f1f1f1;">
					选择诉求类型
				</view>
				<view class="u-menu-wrap">
					<scroll-view scroll-y scroll-with-animation class="u-tab-view" :scroll-top="scrollTop">
						<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
						 :data-current="index" @tap.stop="swichMenu(index)">
							<text class="u-line-1">{{item.name}}</text>
						</view>
					</scroll-view>
					<block v-for="(categories,a) in tabbar" :key="categories.id">
						<scroll-view scroll-y class="right-box" v-if="current==a">
							<view class="class-item">
								<view class="scenario-category">
									<view class="item-title" v-for="(smallClass, b) in categories.childen" :key="smallClass.id" style="padding: 10rpx 0rpx;">
										<view class="small-scenario">
											{{smallClass.name}}
										</view>
										<view class="scenario-iconbox">
											<view class="category-list">
												<view class="icon-scenario" v-for="(fineItem, index) in smallClass.childen" :key="fineItem.id">
													<view>
														<div class="scenario-circle" :class="sstt[index]" @click="handleToScenario(fineItem)">
															<text>{{fineItem.name | fineItemFilter}}</text>
														</div>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</block>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FileApi from '../../api/fileupload.js'
	import DictionaryApi from '../../api/dictionary.js'
	import MassAppealApi from '../../api/massAppeal.js'
	import RoleJS from '../../utils/role.js'
	import SituationApi from '../../api/scenario.js';
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		filters: {
			fineItemFilter(val) {
				if (val.length > 10) {
					return val.substring(0, 10) + '...'
				}
				return val
			}
		},
		data() {
			return {
				checked: true,
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '100rpx'
				},
				hasAuth: false,
				popupTypeShow: false,
				appealObjectList: [],
				dataTemp: {
					claimObject: '',
					appealType: '',
					content: '',
					contact: '',
					openid: '',
					coordinate: {
						lat: '',
						lng: ''
					},
					videoFiles: [],
					imageFiles: [],
					mapType: 2,
				},
				imgList: [],
				videoList: [],
				rules: {
					claimObject: [{
						required: true,
						message: '请选择诉求类型',
						trigger: ['change', 'blur'],
					}],
					content: [{
						required: true,
						message: '请填写诉求说明',
						trigger: ['change', 'blur'],
					}],
					name: [{
						required: true,
						message: '请填写姓名',
						trigger: 'change'
					}],
					idCard: [
						{ required: true, message: '请填写您的身份证号', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.idCard(value)},
							message: '身份证件号不正确'}
					],
					contact: [
						{
							required: true,
							message: '请填写联系方式',
							trigger: 'change'
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						}
					]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false,
				//直接办结附件列表
				imgFileList: [],
				tabbar: [],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度,
				sstt: [
					"ss1","ss2","ss3","ss4","ss5","ss6","ss7","ss8","ss9","ss10","ss11","ss12"
				]
			}
		},
		onShow() {},
		onLoad() {
			this.dataTemp.mapType = this.$MapType
			this.fetchDir()
			this.fechSituationTree()
			this.getLocation()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 跳转我的填报列表
			handleGoToList() {
				uni.navigateTo({
					url: '/eventReport/massAppeal/list/publicList'
				})
			},
			// 跳转诉求类型列表
			handleToScenarioIndex() {
				uni.navigateTo({
					url: '/eventReport/massAppeal/appealTypeList'
				});
			},
			fechSituationTree() {
				this.situationTree = []
				SituationApi.getSceneAppealClsTree().then(res => {
					this.tabbar = res.data.data.content
				});
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			handleToScenario(val) {
				this.dataTemp.claimObject = val.name
				this.dataTemp.appealType = val.id
				this.popupTypeShow = false
			},
			// 保存数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				this.$refs.uForm.validate(valid => {
					// 处理图片
					_this.imgList.forEach(item => {
						_this.dataTemp.imageFiles.push(item.fileId)
					})
					//处理视频
					_this.videoList.forEach(item => {
						_this.dataTemp.videoFiles.push(item.fileId)
					})
					_this.dataTemp.openid = openid
					if (valid) {
						_this.buttonLoading = true
						MassAppealApi.saveMassAppeal(this.dataTemp).then(res => {
							console.log('报送结果', res)
							if (res.data.code === 0) {
								uni.showToast({
									title: '平安景洪，共建·共享·共治，感谢您的参与。',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										// url: '/pages/massAppeal/index'
										url: '/pages/index/index'
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
						console.log('验证通过');
						console.log(this.dataTemp)
					} else {
						console.log('验证失败');
						_this.buttonLoading = false
					}
				});
			},
			//取数据字典
			fetchDir() {
				var _this = this
				// 获取诉求类型
				DictionaryApi.getDictionaries({
					dictSubjectId: 'appeal_object'
				}).then(res => {
					this.$nextTick(function() {
						this.appealObjectList = res.data.data
					})
				})
			},
			//选择图片表单中
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
								console.log(resupload[1])
								if (resupload[1].statusCode == 200) {
									var i = JSON.parse(resupload[1].data)
									console.log('转换', i)
									_self.imgList.push({
										imgPath: item,
										fileId: i.data.fileId
									})
									console.log(_self.imgList)
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
			delFileImg(e) {
				this.imgFileList.splice(e.currentTarget.dataset.index, 1)
			},
			viewFileImage(e) {
				uni.previewImage({
					urls: this.imgFileList,
					current: e.currentTarget.dataset.url
				});
			},
			// 直接办结附件选择 end
			chooseVideo() {
				var _this = this
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						console.log(res)
						FileApi.uploadFileByUni(res.tempFilePath).then(resupload => {
							console.log('resupload[1]', resupload)
							if (resupload[1].statusCode == 200) {
								var i = JSON.parse(resupload[1].data)
								console.log('转换', i)
								_this.videoList.push({
									videoPath: res.tempFilePath,
									fileId: i.data.fileId
								})
							}
						})
					}
				});
			},
			viewVideo() {},
			delVideo(e) {
				this.videoList.splice(e.currentTarget.dataset.index, 1)
			},
			getLocation() {
				var _this = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						_this.dataTemp.coordinate.lat = res.latitude
						_this.dataTemp.coordinate.lng = res.longitude
						console.log(_this.dataTemp)
					}
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.index-head {
		background: url(../../eventReport/static/img/yjjy.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 220rpx;
		width: 92%;
		margin: 2% 4% 0 4%;
		border-radius: 10upx;
	}
	.index-text {
		text-align: right;
		height: 220rpx;
		line-height: 380rpx;
		margin-right: 2%;
		color: #FFFFFF;
	}
	.form {
		padding: 20upx 40upx;
	}
	.select_head {
		width: 100%;
		height: 110rpx;
		border-radius: 10px;
		display: flex;
	}
	.select_body {
		width: 100%;
		margin: 5rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}
	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}
	.u-tab-view {
		width: 35%;
		height: 100%;
	}
	.scenario-title {
		height: 100rpx;
		font-size: 40rpx;
		font-weight: bold;
		padding: 2%;
		border-bottom: 8upx solid #f1f1f1;
	}
	.small-scenario {
		height:30px;
		line-height: 30px;
		text-align: center;
		margin-left: 2%;
		border-bottom: 2px solid #efefef;
	}
	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 50rpx;
		left: 0;
		top: 30rpx;
	}
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	.item-title {
		font-size: 1.1em;
		color: $u-main-color;
		font-weight: bold;
		padding: 1%;
	}
	.scenario-category {
		.scenario-iconbox {
			margin-top: 2%;
			.category-list {
				display: flex;
				flex-wrap: wrap;
				.icon-scenario {
					flex: 0 0 50%;
					text-align: center;	
					color: #666666;
					border-bottom: #f1f1f1 1px solid;
					view {
						display: flex;
						justify-content: center;
						padding: 7rpx;
					}
				}
			}
		}
		.scenario-circle{
			width:100%;
			height:100rpx;
			border: 2px solid #ececec;
			display: flex;
			font-size: 0.85em;
			font-weight: 550;
			align-items: center;
			justify-content: center;
			word-break:break-all;
		}
	}
	.ss1{
		background: #F5FAFF;
	}
	.ss2{
		background: #FFFAF5;
	}
	.ss3 {
		background: #F3FFFE;
	}
	.ss4{
		background: #F5FAFF;
	}
	.ss5{
		background: #FFFAF5;
	}
	.ss6{
		background: #F3FFFE;
	}
	.ss7{
		background: #F5FAFF;
	}
	.ss8{
	 	background: #FFFAF5;
	}
	.ss9{
		background: #F3FFFE;
	}
	.ss10{
	 	background: #F5FAFF;
	}
	.ss11{
		background: #FFFAF5;
	}
	.ss12 {
		background: #F3FFFE;
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
	.bottombutton {
		width: 90%;
		margin: 0 auto;
	}
	.upload-files {
		border: #F1F1F1 1upx solid;
		width: 100%;
		display: flex;
		align-items: center;
		justify-items: flex-start;
		height: 100upx;
		.upload-files-img {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			flex: 1;
			padding: 10upx;
			width: 150upx;
			height: 110upx;

			.item {
				// width: 50upx;
				// height: 50upx;
			}
		}
		.uploadFileIcon {
			height: 90upx;
			width: 90upx;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		image {
			border: #F1F1F1 1upx solid;
			width: 90upx;
			height: 90upx;
		}
		.icon-file-delete {
			width: 30upx;
			height: 30upx;
			position: relative;
			right: 20upx;
			top: -75upx;
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
		}
	}
</style>
