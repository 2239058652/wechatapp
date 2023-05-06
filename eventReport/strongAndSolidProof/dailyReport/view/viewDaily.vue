<template>
	<view>
		<view class="form">
			<view class="formSelect" v-if="borderUserlineOrgInfos.length > 1">
				<u-form  ref="uForm" label-width="170" :error-type="errorType">
					<u-form-item label="选择报送段:" :required="true">
						<u-input type="select" :select-open="selectShow" v-model="lineName" :border="true" placeholder="选择报送段" @click="selectShow = true" />
						<u-select v-model="selectShow" :list="segmentList" @confirm="segmenSelectconfirm"></u-select>
					</u-form-item>
				</u-form>
			</view>
			<view v-if="isShow">
				<u-form :model="dataTemp" label-width="280">
					<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">日常工作汇总</view>
					<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">出勤人员明细</view>
					<view class="list-content">
						<view class="list">
							<view class="li" v-for="(item,i) in resultAttendanceType.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count || 0}} 人</view>
						</view>
					</view>
					<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">巡逻次数</view>
					<view class="list-content">
						<view class="list">
							<view class="li" v-for="(item,i) in resultPointPatrol.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count}} 次</view>
						</view>
					</view>
					<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">过往人员流动人口总数</view>
					<view class="list-content">
						<view class="list">
							<view class="li" v-for="(item,i) in resultPointPeople.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count}} 人</view>
						</view>
					</view>
					<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">过往人员常驻人口总数</view>
					<view class="list-content">
						<view class="list">
							<view class="li" v-for="(item,i) in resultPointPermanent.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count}} 人</view>
						</view>
					</view>
					<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">过往车辆</view>
					<view class="list-content">
						<view class="list">
							<view class="li" v-for="(item,i) in resultPointcar.detail" :key='i'><view class="text">{{item.type}}</view>{{item.count}} 人</view>
						</view>
					</view>
				</u-form>
			</view>
			<view v-if="!isShow" class="text-center justify-center flex flex-wrap padding align-center nodata">
				<u-empty text="请先选择报送段" mode="data"></u-empty>
			</view>
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
				resultAttendanceType:{},
				resultPointPatrol:{},
				resultPointPeople:{},
				resultPointPermanent:{},
				resultPointcar:{},
				listQuery:{
					lineId:''
				},
				isShow:false,
				// 选择框
				lineName:'',
				selectShow:false,
				borderUserlineOrgInfos: [],
				segmentList: [],
				errorType: ['toast', 'border'],
			}
		},
		watch: {},
		onLoad() {
			// 是否有多个段长角色
			// console.log(uni.getStorageSync('borderUserlineOrgInfos'));
			this.borderUserlineOrgInfos = uni.getStorageSync('borderUserlineOrgInfos');
			if (this.borderUserlineOrgInfos.length > 1) {
				this.borderUserlineOrgInfos.forEach(Element => {
					this.segmentList.push({ value: Element.id, label: Element.name });
				});
			}
			if (this.borderUserlineOrgInfos.length === 1) {
				this.listQuery.lineId=this.borderUserlineOrgInfos[0].id
				this.getEventTotal();
			}
		},
		methods: {
			segmenSelectconfirm(e) {
				this.lineName = e[0].label;
				this.dataTemp.lineId = e[0].value;
				this.listQuery.lineId = e[0].value;
				this.getEventTotal();
			},
			getEventTotal(){
				segmentDaily.fetchdailyTotal(this.listQuery).then(res => {
					console.log('日常工作汇总',res)
					if(res.data.code  === 0){
						this.isShow = true
						// this.dataTemp =res.data.data
						this.resultAttendanceType = res.data.data.resultAttendanceType
						this.resultPointPatrol = res.data.data.resultPointPatrol
						this.resultPointPeople= res.data.data.resultPointPeople
						this.resultPointPermanent= res.data.data.resultPointPermanent
						this.resultPointcar= res.data.data.resultPointcar
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
