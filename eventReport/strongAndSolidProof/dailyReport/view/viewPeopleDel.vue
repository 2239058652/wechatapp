<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" label-width="280">
				<view style="height: 80rpx;line-height: 80rpx;text-align: center;width: 100%;font-size: 18px;">{{dataTemp.reportTime}}情况统计</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">出勤情况</view>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="text">出勤总人数</view>{{dataTemp.attendance}} 人</view>
						<view class="li"><view class="text">出勤州级机关干部数</view>{{dataTemp.attendanceCityOfficials}} 人</view>
						<view class="li"><view class="text">出勤市级机关干部数</view>{{dataTemp.attendanceCountyOfficials}} 人</view>
						<view class="li"><view class="text">出勤公安警察</view>{{dataTemp.attendancePolice}} 人</view>
						<view class="li"><view class="text">出勤移民警察</view>{{dataTemp.attendanceImmigrationPolice}} 人</view>
						<view class="li"><view class="text">出勤乡镇本机民兵</view>{{dataTemp.attendanceMilitia}} 人</view>
						<view class="li"><view class="text">出勤对口支援力量数</view>{{dataTemp.attendanceSupport}} 人</view>
						<view class="li"><view class="text">出勤村援边突击队数</view>{{dataTemp.attendanceCommando}} 人</view>
						<view class="li"><view class="text">出勤村民</view>{{dataTemp.attendanceVillager}} 人</view>
					</view>
				</view>
				<view style="height: 80rpx;line-height: 80rpx;text-align: left;width: 100%;background-color: #ececec;padding-left: 20upx;">巡逻情况</view>
				<view class="list-content">
					<view class="list">
						<view class="li"><view class="text">一级段长巡逻次数</view>{{dataTemp.patrolTimesLevelOne}} 次</view>
						<view class="li"><view class="text">二级段长巡逻次数</view>{{dataTemp.patrolTimesLevelTwo}} 次</view>
						<view class="li"><view class="text">三级段长巡逻次数</view>{{dataTemp.patrolTimesLevelThree}} 次</view>
						<view class="li"><view class="text">防控点人员巡逻次数</view>{{dataTemp.patrolTimes}} 次</view>
						<view class="li"><view class="text">过往人员常驻人口数</view>{{dataTemp.permanentPopulation}} 人</view>
						<view class="li"><view class="text">过往人员流动人口数</view>{{dataTemp.floatingPopulation}} 人</view>
						<view class="li"><view class="text">过往车辆数</view>{{dataTemp.carNumber}} 辆</view>
					</view>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				dataTemp: {
					reportTime: '',
					attendance: '0',
					attendanceCityOfficials: '0',
					attendanceCountyOfficials: '0',
					attendancePolice: '0',
					attendanceImmigrationPolice: '0',
					attendanceMilitia: '0',
					attendanceSupport: '0',
					attendanceCommando: '0',
					attendanceVillager: '0',
					patrolTimes: '0',
					patrolTimesLevelOne: '0',
					patrolTimesLevelTwo: '0',
					patrolTimesLevelThree: '0',
					permanentPopulation: '0',
					floatingPopulation: '0',
					carNumber: '0'
				}
			}
		},
		watch: {},
		onLoad(option) {
			this.dataTemp.reportTime = option.reportTime
			this.dataTemp.attendance = option.attendance
			this.dataTemp.attendanceCityOfficials = option.attendanceCityOfficials
			this.dataTemp.attendanceCountyOfficials = option.attendanceCountyOfficials
			this.dataTemp.attendancePolice = option.attendancePolice
			this.dataTemp.attendanceImmigrationPolice = option.attendanceImmigrationPolice
			this.dataTemp.attendanceMilitia = option.attendanceMilitia
			this.dataTemp.attendanceSupport = option.attendanceSupport
			this.dataTemp.attendanceCommando = option.attendanceCommando
			this.dataTemp.attendanceVillager = option.attendanceVillager
			this.dataTemp.patrolTimes = option.patrolTimes
			this.dataTemp.patrolTimesLevelOne = option.patrolTimesLevelOne
			this.dataTemp.patrolTimesLevelTwo = option.patrolTimesLevelTwo
			this.dataTemp.patrolTimesLevelThree = option.patrolTimesLevelThree
			this.dataTemp.permanentPopulation = option.permanentPopulation
			this.dataTemp.floatingPopulation = option.floatingPopulation
			this.dataTemp.carNumber = option.carNumber
		},
		onShow() {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
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
