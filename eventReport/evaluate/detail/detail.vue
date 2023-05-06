<template>
	<view>
		<!-- <u-subsection :list="tabsList" :current="sectionCurrent" @change="sectionChange"></u-subsection> -->
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="140">
				<u-form-item :required="false" label="考核月份:" prop="title">
					{{dataTemp.year}} 年 {{dataTemp.month}} 月考核
				</u-form-item>
				<!-- <u-form-item :required="false" label="考核名称:" prop="title">
					{{dataTemp.guiZeMc}}
				</u-form-item> -->
				<u-form-item :required="false" label="总得分:" prop="title">
					{{dataTemp.totalScore}}
				</u-form-item>
			</u-form>
			<!-- <view class="" v-for="(item,index) in dataTemp.kaoHeMxList" :key="index">
				{{item.kaoHeXmMingCheng}}({{item.fenZhi}}分)
			</view> -->
			<view class="table">
				<view class="tr-hd flex justify-start padding-xs">
					<view class="th_item1 text-center" style="width: 500rpx;">
						考核项
					</view>
					<view class="th_item2 text-center" style="width: 100rpx;">
						得分
					</view>
				</view>
				<view class="tr-td" v-for="(item,index) in dataTemp.kaoHeMxList" :key="index">
					<view class="td1">
						<view class="padding-tb-xs">
							({{index+1}}) {{item.kaoHeXmMingCheng}}({{item.fenZhi}}分)
						</view>
						<view class="text-sm text-grey">
							{{item.neiRong}}
						</view>
						<view class="text-sm text-black padding-tb-xs">
							考评方式：{{item.typeDesc}}
						</view>
					</view>
					<view class="td2">
						{{item.score}}
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="padding-lr">
			<u-button v-if="dataTemp.signedStatus!=0" type="success" @click="handleSign" :loading="buttonLoading">签收</u-button>
		</view> -->
	</view>
	</view>
</template>

<script>
	import FileApi from '../../../api/fileupload.js'
	import EvaluateApi from '../../../api/evaluate.js'
	import RoleJS from '../../../utils/role.js'
	import moment from 'moment'
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

		},
		data() {
			return {
				buttonLoading: false,
				userList: [],
				sectionCurrent: 0,
				tabsList: [{
					name: '考核详情'
				}],
				dataTemp: {
					year: '',
					month: '',
					totalScore: 0,
					kaoHeMxList: []
				},
				departmentList: [],
				imgList: [],
				timeQuery: {
					eventId: '',
					sort: 0
				},
				id: '',
				type: ''
			}
		},
		onLoad(option) {
			console.log(option)
			this.id = option.id
			// this.type = option.type
			this.fetchDetail()
			// this.fetchReceiveList()
		},
		onShow() {

		},
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
			// this.$refs.uFormJB.setRules(this.rulesJB);

		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			sectionChange(index) {
				this.sectionCurrent = index
			},
			//加载邮件详情
			fetchDetail() {
				var _this = this

				uni.showLoading({
					title: '读取中',
				})
				// 读个人发文详情

				EvaluateApi.getEvaluateDetail(this.id).then(res => {
					console.log(res)

					_this.dataTemp = res.data.data
					uni.hideLoading()
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		padding: 20upx 40upx;
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

		.icon {
			// margin-top: 40upx;
		}

		.uploadText {
			// margin-top: 75upx;
		}
	}

	.upload-video {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
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
		// background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
		color: #FFFFFF;
		z-index: 999;
		border-radius: 50px;
		// border-top-right-radius: 20upx;
		// border-bottom-left-radius: 20upx;
	}

	.button {
		width: 70%;
		margin: 0 auto;
	}

	.actionPopup {
		padding: 20upx;
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
			// background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
			color: #FFFFFF;
			z-index: 999;
			border-radius: 50px;
			// border-top-right-radius: 20upx;
			// border-bottom-left-radius: 20upx;
		}

	}

	.listitem {
		border-bottom: #F1F1F1 1upx solid;
	}

	.table {
		border: #F1F1F1 1rpx solid;

		.tr-hd {
			background-color: #f5f6f8;
			font-weight: bold;
		}

		.th_item1 {
			text-align: center;
			flex: 0 0 80%;
		}

		.th_item2 {
			text-align: center;
			flex: 0 0 20%;
		}

		.tr-td {
			display: flex;
			justify-content: flex-start;

			.td1 {
				text-align: left;
				flex: 0 0 80%;
				padding: 12rpx;
				border: #F1F1F1 1rpx solid;
				border-top: none;
			}

			.td2 {
				// text-align: center;
				display: flex;
				flex: 0 0 20%;
				justify-content: center;
				align-items: center;
				border: #F1F1F1 1rpx solid;
				border-top: none;
			}
		}

	}
</style>
