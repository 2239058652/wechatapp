<template>
	<view>
		<view class="index-head">
			<view class="title-text">综治服务</view>
			<view class="index-text" @click="handleGoToList()">
				<u-icon name="zhuanfa" label="我的申报" label-color="#FFFFFF" size="40"/>
			</view>
		</view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" :error-type="errorType">
				<u-form-item left-icon="account" :left-icon-style="leftIconStyle" label="申报人:"
					:required="true" label-position="top" prop="linkman">
					<u-input cursor-spacing="150" v-model="dataTemp.linkman" :border="true"
						placeholder="请填写申报人姓名。" />
				</u-form-item>
				<u-form-item left-icon="phone" :left-icon-style="leftIconStyle" label="联系电话:"
				:required="true" label-position="top" prop="mobile">
					<u-input cursor-spacing="150" type="number" maxlength="11"
						v-model="dataTemp.mobile" :border="true" placeholder="请填写申报人联系方式。"
					/>
				</u-form-item>
				<u-form-item left-icon="map" :left-icon-style="leftIconStyle" label="事件发生地:"
					:required="true" label-position="top" prop="happenRegionName">
					<u-input type="select" :select-open="regionShow" v-model="dataTemp.happenRegionName"
						:border="true" placeholder="事件发生地" @click="regionShow = true" />
					<u-select
						v-model="regionShow"
						mode="mutil-column-auto"
						:list="regionTree"
						label-name="shortName"
						value-name="regionCode"
						@confirm="regionConfirm"
					/>
				</u-form-item>
				<u-form-item left-icon="tags" :left-icon-style="leftIconStyle" label="服务类型:"
					:required="true" label-position="top" prop="typeName">
					<u-input cursor-spacing="150" v-model="dataTemp.typeName" @click="addServiceType"
						disabled :border="true" placeholder="请选择服务类型。" />
				</u-form-item>
				<u-form-item left-icon="list" :left-icon-style="leftIconStyle" label="紧急程度:"
					:required="true" label-position="top" prop="emergencyLevelName">
					<u-input type="select" :select-open="emergencyLevelSelectShow" :border="true"
						v-model="dataTemp.emergencyLevelName"
					 @click="emergencyLevelSelectShow = true"></u-input>
					<u-select mode="single-column" value-name="innerId" label-name="text"
						:list="emergencyLevelSelectShowList" v-model="emergencyLevelSelectShow"
					 @confirm="emergencyLevelSelectConfirm"></u-select>
				</u-form-item>
				<u-form-item left-icon="file-text-fill" :left-icon-style="leftIconStyle" label="简要情况:"
					:required="true" label-position="top" prop="briefContent">
					<u-input v-model="dataTemp.briefContent" type="textarea"
						height="150" :border="true"
						placeholder="请填写简要情况"
					/>
				</u-form-item>
			</u-form>
		</view>
		<view style="margin-bottom: 20px;">
			<u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">立即申报</u-button>
		</view>
	</view>
</template>

<script>
	import DictionaryApi from '@/api/dictionary.js'
	import ZongZhiService from '@/api/zongZhiService.js'
	import DispResoPlat from '@/api/disputesResolvePlatform.js'
	
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		data() {
			return {
				// customStyle 按钮样式
				customStyle: {
					backgroundColor: '#1941A0',
					color: '#FFFFFF',
					width: '90%',
					height: '90rpx'
				},
				leftIconStyle: { color: '#1261d4' },
				regionShow: false,
				// 行政区划树
				regionTree: [],
				emergencyLevelSelectShow: false,
				emergencyLevelSelectShowList: [
					{innerId: 0, text: '一般'},
					{innerId: 1, text: '紧急'},
					{innerId: 2, text: '特急'}
				],
				// 数据集
				dataTemp: {
					address: '',
					briefContent: '',
					openid: '',
					emergencyLevel: '',
					emergencyLevelName: '',
					linkman: '',
					mobile: '',
					happenRegionCode: '',
					happenRegionName: '',
					type: '',
					typeName: ''
				},
				rules: {
					briefContent: [{
						required: true,
						message: '请填写简要情况',
						trigger: 'change'
					}],
					mobile: [
						{ required: true, message: '请填写申报人联系电话', trigger: ['change', 'blur'] },
						{ validator: (rule, value, callback) => {
								return this.$u.test.mobile(value)},
							message: '联系电话不正确'}
					],
					linkman: [{ required: true, message: '请填写申报人姓名', trigger: 'change' }],
					emergencyLevelName: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
					typeName: [{ required: true, message: '请选择综治服务类型', trigger: 'change' }],
					happenRegionName: [{ required: true, message: '请选择事件发生地', trigger: 'change' }]
				},
				errorType: ['toast', 'border'],
				buttonLoading: false
			}
		},
		onShow() {},
		onLoad() {
			// 获取openId
			this.openId = uni.getStorageSync('openId')
			// #ifdef MP-WEIXIN
			if (!this.openId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
			// 服务类型
			uni.$on('checkServiceType', (data) => {
				this.dealServiceType(data)
			})
			this.fetchRegionTree()
		},
		onUnload() {
		    // 移除监听事件
		    uni.$off('checkServiceType')
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 跳转我的填报列表
			handleGoToList() {
				uni.navigateTo({
					url: './myServiceList'
				})
			},
			// 获取行政区划树
			fetchRegionTree() {
				var _this = this
				DispResoPlat.getMediateRegionCode().then(res => {
					var listStep = res.data.data.children
					_this.regionTree = _this.deleteChildren(listStep)
				})
			},
			// 处理tree返回数据中children为零的情况，PC可用于处理点击至末尾还加载的情况
			deleteChildren(arr) {
				let childs = arr
				for (let i = childs.length; i--; i > 0) {
					if (childs[i].children) {
						if (childs[i].children.length) {
							this.deleteChildren(childs[i].children)
						} else {
							delete childs[i].children
						}
					}
				}
				return arr
			},
			// 行政区划选择回显处理
			regionConfirm(e) {
				this.dataTemp.happenRegionName = e[0].label + e[1].label + e[2].label
				this.dataTemp.happenRegionCode = e[2].value
			},
			// 纠纷级别选择
			emergencyLevelSelectConfirm(e) {
				e.map((val, index) => {
					this.dataTemp.emergencyLevelName = val.label
					this.dataTemp.emergencyLevel = val.value
				})
			},
			// 跳转选择服务类型
			addServiceType() {
				uni.navigateTo({
					url: './comment/serviceType'
				})
			},
			dealServiceType(data) {
				console.log('11111111', data)
				this.dataTemp.typeName = data.dictTreeContent.text
				this.dataTemp.type = data.dictTreeContent.innerId
			},
			// 保存申报调解填写的数据
			saveData() {
				var _this = this
				let openid = uni.getStorageSync('openId')
				_this.dataTemp.openid = openid
				_this.dataTemp.address = _this.dataTemp.happenRegionName
				this.$refs.uForm.validate(valid => {
					if (valid) {
						_this.buttonLoading = true
						ZongZhiService.registzzfw(_this.dataTemp).then(res => {
							if (res.data.code === 0) {
								uni.showToast({
									title: '综治服务申报成功！',
									icon: 'none'
								})
								setTimeout(function() {
									uni.reLaunch({
										url: '/disputesResolvePlatform/zongZhiService/publicIndex'
									})
								}, 1500)
							} else {
								uni.showToast({
									title: '申报失败: 请检查后重试',
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
	.index-head {
		background: url(../../eventReport/static/img/bianjingTY.png);
		background-size: 100% 100%;
		color: #FFFFFF;
		height: 220rpx;
		width: 92%;
		margin: 2% 4% 0 4%;
		border-radius: 10upx;
	}
	.title-text {
		text-align: center;
		height: 160rpx;
		line-height: 160rpx;
		font-size: 1.5rem;
		color: #FFFFFF;
	}
	.index-text {
		text-align: right;
		margin-right: 2%;
		color: #FFFFFF;
	}
	.notIn-partiesType {
		color: #AAAAAA;
		text-align: center;
		font-size: small;
	}
	.form {
		padding: 20upx 40upx;
	}
	.parties-head {
		height: 80rpx;
	}
	.add-button {
		height: 75rpx;
		width: 180rpx;
	}
	.parties-body {
		padding: 0rpx 20rpx 0rpx 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 1px #ececec solid;
		color: #1CBBB4;
	}
</style>
