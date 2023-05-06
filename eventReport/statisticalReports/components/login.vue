<template>
	<view>
		<view class="title-header">
			景洪市综治信息系统用户登陆情况
		</view>
		<view style="width: 90%;">
			<u-form-item label="开始日期:" label-width="130" prop="starDate">
				<u-input type="select" :select-open="starTimeShow"
					v-model="query.starDate" :border="true" placeholder="开始时间"
				 @click="starTimeShow = true" />
				<u-calendar v-model="starTimeShow" mode="date" @change="starTimeSelectConfirm"></u-calendar>
			</u-form-item>
			<u-form-item label="结束日期:" label-width="130">
				<u-input type="select" :select-open="endTimeShow"
					v-model="query.endDate" :border="true" placeholder="开始时间"
				 @click="endTimeShow = true" />
				<u-calendar v-model="endTimeShow" mode="date" @change="endTimeSelectConfirm"></u-calendar>
			</u-form-item>
			<u-form-item style="margin-left: 9%;">
				<u-radio-group v-model="query.type" size="30rpx" width="50%">
					<u-radio 
						@change="radioChange" 
						v-for="(item, index) in list" :key="index" 
						:name="item.label"
						:disabled="item.disabled"
					>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</u-form-item>
		</view>
		<view>
			<wyb-table
				ref="table"
				:headers="headers"
				:contents="contents"
				:font-size="[20]"
				:first-line-fixed="true"
				:computed-col="computedCol"
				:sort-col="sortCol"
				:loading="loading"
			/>
		</view>
	</view>
</template>

<script>
	import wybTable from '@/eventReport/components/wyb-table/wyb-table.vue'
	import StatisticalReports from '../../../api/statisticalReports.js'
	import moment from 'moment'
	
	export default {
	    components: { wybTable },
	    data() {
	        return {
				loading: false,
				list: [
					{ name: '平安建设责任单位', label: 0 },
					{ name: '平安建设成员单位', label: 1 }
				],
				query: {
					type: 0,
					regionCode: '',
					starTime: '',
					endTime: '',
					sorts: 'totalLoginTimes',
					starDate: '',
					endDate: ''
				},
	            headers: [
					{ label: '乡镇/街道/农场', key: 'name', width: '200' },
					{ label: '管理平台登录(次)', key: 'pcLoginTimes' },
					{ label: '微信小程序登录(次)', key: 'wxLoginTimes' },
					{ label: '合计(次)', key: 'totalLoginTimes' },
					{ label: '管理平台登录(人)', key: 'pcLoginPeople' },
					{ label: '微信小程序登录(人)', key: 'wxLoginPeople' },
					{ label: '合计(人)', key: 'totalLoginPeople' }
				],
				contents: [],
				computedCol: ['pcLoginPeople', 'pcLoginTimes', 'totalLoginPeople', 'totalLoginTimes',
					'wxLoginPeople', 'wxLoginTimes'
				],
				sortCol: [
					{ key: 'pcLoginPeople', isNumber: true },
					{ key: 'pcLoginTimes', isNumber: true },
					{ key: 'totalLoginPeople', isNumber: true },
					{ key: 'totalLoginTimes', isNumber: true },
					{ key: 'wxLoginPeople', isNumber: true },
					{ key: 'wxLoginTimes', isNumber: true }
				],
				starTimeShow: false,
				endTimeShow: false
	        }
	    },
		onShow() {},
		created() {
			this.query.starDate = new moment().format('YYYY-MM-01')
			this.query.starTime = new moment().format('YYYY-MM-01 00:00:00')
			this.query.endDate = new moment().format('YYYY-MM-DD')
			this.query.endTime = new moment().format('YYYY-MM-DD 00:00:00')
			this.fetchList()
		},
		methods: {
			starTimeSelectConfirm(e) {
				this.query.starTime = moment(e.result).format('YYYY-MM-DD 00:00:00')
				this.query.starDate = moment(e.result).format('YYYY-MM-DD')
				this.fetchList()
			},
			endTimeSelectConfirm(e) {
				this.query.endTime = moment(e.result).format('YYYY-MM-DD 23:59:59')
				this.query.endDate = moment(e.result).format('YYYY-MM-DD')
				this.fetchList()
			},
			radioChange(e) {
				this.fetchList()
				console.log(e);
			},
			fetchList() {
				this.loading = true
				StatisticalReports.getUserLoginStatistics(this.query).then(res => {
					if (res.data.code == 0) {
						this.contents = res.data.data
						this.loading = false
					} else {
						uni.showToast({
							title: '加载失败，请返后重试',
							icon: 'none'
						})
						this.contents = []
						this.loading = false
					}
				})
			}
		}
	}
</script>

<style>
	.title-header {
		height: 80rpx;
		line-height: 80rpx;
		font-weight: 600;
		text-align: center;
		width: 100%;
		font-size: 18px;
	}
</style>
