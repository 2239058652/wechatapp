<template>
	<view>
		<view  v-if="isShow" class="form">
			<u-form :model="dataTemp" label-width="280">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">
					案件汇总
				</view>
				<view style="width: 80%;margin-left: 10%;">
					<u-form-item label="汇总日期:" label-width="130" prop="reportDate">
						<u-input type="select" :select-open="starTimeShow"
							v-model="query.reportDate" :border="true"
						 @click="starTimeShow = true" />
						<u-calendar v-model="starTimeShow" mode="date" @change="starTimeSelectConfirm"></u-calendar>
					</u-form-item>
				</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;background-color: #ececec;padding-left: 20upx;">
					案件总数:  {{ dataTemp.eventNum }} 件
				</view>
				<view class="list-content">
					<view class="list">
						<view class="li" v-for="(item,i) in resultEventType" :key='i'>
							<view class="text">{{item.name}}</view>
							{{item.num}} 件
						</view>
					</view>
				</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;background-color: #ececec;padding-left: 20upx;">
					涉案人员: {{ dataTemp.peopleNum }} 人
				</view>
				<view class="list-content">
					<view class="list">
							<view class="li" v-for="(item,i) in resultPeopleType" :key='i'>
								<view class="text">
								{{item.name}}
								</view>
									{{item.num}} 人
							</view>
					</view>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	import PreventionAndControlSlice from '@/api/preventionAndControlSlice.js';
	import moment from 'moment';
	
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
				isShow:false,
				starTimeShow: false,
				query: {
					reportDate: ''
				}
			}
		},
		watch: {},
		created() {
			this.query.reportDate = new moment().format('YYYY-MM-DD')
			this.getEventTotal();
		},
		methods: {
			starTimeSelectConfirm(e) {
				this.query.reportDate = moment(e.result).format('YYYY-MM-DD')
				this.getEventTotal()
			},
			getEventTotal(){
				PreventionAndControlSlice.getLevelAreaLeaderEventReportSummary(this.query).then(res => {
					if(res.data.code === 0){
						this.isShow = true
						this.dataTemp =res.data.data
						this.resultEventType = res.data.data.eventList
						this.resultPeopleType = res.data.data.peopleList
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
