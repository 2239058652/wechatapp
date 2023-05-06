<template>
	<view>
		<view class="formSelect" v-if="borderUserlineOrgInfos.length > 1">
			<u-form  ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="选择报送段:" :required="true">
					<u-input type="select" :select-open="selectShow" v-model="lineName" :border="true" placeholder="选择报送段" @click="selectShow = true" />
					<u-select v-model="selectShow" :list="segmentList" @confirm="segmenSelectconfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view  v-if="isShow" class="form">
			<u-form :model="dataTemp" label-width="280">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">案件汇总</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">涉案人员</view>
				<view class="list-content">
					<view class="list">
							<view class="li" v-for="(item,i) in resultEventType.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count}} 件</view>
					</view>
				</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">涉案类型</view>
				<view class="list-content">
					<view class="list">
							<view class="li" v-for="(item,i) in resultPeopleType.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count}} 件</view>
					</view>
				</view>
			</u-form>
		</view>
		<view v-if="!isShow" class="text-center justify-center flex flex-wrap padding align-center nodata">
			<u-empty text="请先选择报送段" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import segmentDaily from '@/api/segmentDaily.js';
	export default {
		components: {},
		data() {
			return {
				dataTemp: {
					
				},
				resultEventType:{},
				resultPeopleType:{},
				// 选择框
				lineName:'',
				selectShow:false,
				borderUserlineOrgInfos: [],
				segmentList: [],
				errorType: ['toast', 'border'],
				query: {
					lineId:''
				},
				isShow:false
			}
		},
		watch: {},
		onLoad() {
			// console.log(uni.getStorageSync('borderUserlineOrgInfos'));
			this.borderUserlineOrgInfos = uni.getStorageSync('borderUserlineOrgInfos');
			if (this.borderUserlineOrgInfos.length > 1) {
				this.borderUserlineOrgInfos.forEach(Element => {
					this.segmentList.push({ value: Element.id, label: Element.name });
				});
				
			}
			if (this.borderUserlineOrgInfos.length === 1) {
				this.query.lineId=this.borderUserlineOrgInfos[0].id
				this.getEventTotal();
			}
		},
		methods: {
			// 选择段长后确认按钮
			segmenSelectconfirm(e) {
				this.lineName = e[0].label;
				this.query.lineId = e[0].value;
				this.getEventTotal();
			},
			getEventTotal(){
				segmentDaily.fetchEventTotal(this.query).then(res => {
					// console.log('案件汇总',res)
					if(res.data.code === 0){
						this.isShow = true
						this.dataTemp =res.data.data
						this.resultEventType = res.data.data.resultEventType
						this.resultPeopleType = res.data.data.resultPeopleType
					}
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.formSelect {
		padding: 20upx 40upx;
	}
.list-content {
		margin-top: 10px;
		background: #fff;
	}
	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}
		.li {
			width: 100%;
			height: 80upx;
			padding: 0 2%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;
			&.noborder {
				border-bottom: 0
			}
			.text {
				padding-left: 10upx;
				width: 88%;
				color: #666;
			}
		}
	}
</style>
