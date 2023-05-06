<template>
	<view>
		<view class="form">
			<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="填报日期:" :required="true" prop="reportTime">
					<u-input
						type="select"
						:select-open="reportDateShow"
						v-model="dataTemp.reportTime"
						:border="true"
						placeholder="请选择事件发生时间"
						@click="reportDateShow = true"
					/>
					<u-calendar v-model="reportDateShow" mode="date" @change="dateSelectConfirm"></u-calendar>
				</u-form-item>
			</u-form>
		</view>
		<view class="form" v-if="borderUserlineOrgInfos.length > 1">
			<u-form :model="dataTemp" ref="uForm" label-width="170" :error-type="errorType">
				<u-form-item label="选择报送段:" :required="true" prop="lineName">
					<u-input type="select" :select-open="selectShow" v-model="lineName" :border="true" placeholder="选择报送段" @click="selectShow = true" />
					<u-select v-model="selectShow" :list="segmentList" @confirm="segmenSelectconfirm"></u-select>
				</u-form-item>
			</u-form>
		</view>
		<view v-if="haveData">
			<view class="form report-viewarea" v-if="dataTemp.resultEventType.detail.length > 0">
				<u-divider>案件类型</u-divider>
				<view class="header-index">案件总数</view>
				<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
					<u-form-item label="案件总数:" :required="true" prop="attendance">
						<u-number-box
							v-model="dataTemp.resultEventType.total"
							:min="1"
							:max="10000"
							:input-width="250"
							:step="1"
							:input-height="70"
							@change="attendanceChange"
						></u-number-box>
						<text style="margin-left: 5%;">件</text>
					</u-form-item>
					<!-- <view >
						<view class="header-index">所有案件类型</view>
						<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultEventType.detail">
							<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
							<text style="margin-left: 5%;">件</text>
						</u-form-item>
					</view> -->
					<uni-collapse accordion="true">
						<uni-collapse-item title="所有案件类型">
							<view>
								<view class="header-index">所有案件类型</view>
								<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultEventType.detail" :key="i">
									<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
									<text style="margin-left: 5%;">件</text>
								</u-form-item>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</u-form>
			</view>
			<view class="form report-viewarea" v-if="dataTemp.resultPointPatrol.detail.length > 0">
				<u-divider>巡逻次数</u-divider>
				<view class="header-index">巡逻总数</view>
				<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
					<u-form-item label="巡逻总数:" :required="true" prop="attendance">
						<u-number-box
							v-model="dataTemp.resultPointPatrol.total"
							:min="1"
							:max="10000"
							:input-width="250"
							:step="1"
							:input-height="70"
							@change="attendanceChange"
						></u-number-box>
						<text style="margin-left: 5%;">次</text>
					</u-form-item>
					<uni-collapse accordion="true">
						<uni-collapse-item title="巡逻情况">
							<view>
								<view class="header-index">巡逻情况</view>
								<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultPointPatrol.detail" :key="i">
									<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
									<text style="margin-left: 5%;">次</text>
								</u-form-item>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</u-form>
			</view>
			<view class="form report-viewarea" v-if="dataTemp.resultPointPermanent.detail.length > 0">
				<u-divider>常驻人口</u-divider>
				<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
					<view class="header-index">常驻人口总数</view>
					<u-form-item label="常驻人口总数:" :required="true" prop="attendance">
						<u-number-box
							v-model="dataTemp.resultPointPermanent.total"
							:min="1"
							:max="10000"
							:input-width="250"
							:step="1"
							:input-height="70"
							@change="attendanceChange"
						></u-number-box>
						<text style="margin-left: 5%;">人</text>
					</u-form-item>
					<uni-collapse accordion="true">
						<uni-collapse-item title="常驻人口">
							<view >
								<view class="header-index">常驻人口</view>
								<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultPointPermanent.detail" :key="i">
									<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
									<text style="margin-left: 5%;">人</text>
								</u-form-item>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</u-form>
			</view>
			<view class="form report-viewarea" v-if="dataTemp.resultPointPeople.detail.length > 0">
				<u-divider>流动人口</u-divider>
				<view class="header-index">流动人口总数</view>
				<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
					<u-form-item label="流动人口总数:" :required="true" prop="attendance">
						<u-number-box
							v-model="dataTemp.resultPointPeople.total"
							:min="1"
							:max="10000"
							:input-width="250"
							:step="1"
							:input-height="70"
							@change="attendanceChange"
						></u-number-box>
						<text style="margin-left: 5%;">人</text>
					</u-form-item>
					<uni-collapse accordion="true">
						<uni-collapse-item title="流动人口">
							<view >
								<view class="header-index">流动人口</view>
								<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultPointPeople.detail" :key="i">
									<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
									<text style="margin-left: 5%;">人</text>
								</u-form-item>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</u-form>
			</view>
			<view class="form report-viewarea" v-if="dataTemp.resultPointEvent.detail.length > 0">
				<u-divider>案件数量</u-divider>
				<view class="header-index">案件总数</view>
				<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
					<u-form-item label="案件总数:" :required="true" prop="attendance">
						<u-number-box
							v-model="dataTemp.resultPointEvent.total"
							:min="1"
							:max="10000"
							:input-width="250"
							:step="1"
							:input-height="70"
							@change="attendanceChange"
						></u-number-box>
						<text style="margin-left: 5%;">件</text>
					</u-form-item>
					<uni-collapse accordion="true">
						<uni-collapse-item title="所有案件汇总">
							<view >
								<view class="header-index">所有案件汇总</view>
								<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultPointEvent.detail" :key="i">
									<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
									<text style="margin-left: 5%;">件</text>
								</u-form-item>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</u-form>
			</view>
			<view class="form report-viewarea" v-if="dataTemp.resultPeopleType.detail.length > 0">
				<u-divider>涉案人数</u-divider>
				<view class="header-index">涉案人总数</view>
				<u-form :model="dataTemp" ref="uForm" label-width="190" :error-type="errorType">
					<u-form-item label="案件总数:" :required="true" prop="attendance">
						<u-number-box
							v-model="dataTemp.resultPeopleType.total"
							:min="1"
							:max="10000"
							:input-width="250"
							:step="1"
							:input-height="70"
							@change="attendanceChange"
						></u-number-box>
						<text style="margin-left: 5%;">人</text>
					</u-form-item>
					<!-- 所有案件类型 -->
					<uni-collapse accordion="true">
						<uni-collapse-item title="所有案件汇总">
							<view>
								<view class="header-index">所有案件汇总</view>
								<u-form-item :label="item.type + ':'" v-for="(item, i) in dataTemp.resultPeopleType.detail" :key="i">
									<u-number-box :disabled="true" :input-width="250" :input-height="70" v-model="item.count"></u-number-box>
									<text style="margin-left: 5%;">人</text>
								</u-form-item>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</u-form>
			</view>
			<view class="form report-viewarea">
				<u-divider>物资使用和储备情况</u-divider>
				<u-form :model="dataTemp" ref="uForm" label-width="180" :error-type="errorType">
					<u-form-item label="物资使用情况:" prop="patrolDetail">
						<u-input v-model="dataTemp.usedDesc" type="textarea" height="180" :border="true" placeholder="请填写物资使用情况" />
					</u-form-item>
					<u-form-item label="物资储备情况:" prop="patrolDetail">
						<u-input v-model="dataTemp.leftDesc" type="textarea" height="180" :border="true" placeholder="请填写物资储备情况" />
					</u-form-item>
				</u-form>
			</view>
			<view class="form report-viewarea">
				<u-divider>其他工作情况</u-divider>
				<u-form :model="dataTemp" ref="uForm" label-width="180" :error-type="errorType">
					<u-form-item label="其他工作情况:" prop="patrolDetail">
						<u-input v-model="dataTemp.otherDesc" type="textarea" height="180" :border="true" placeholder="请填写其他工作情况" />
					</u-form-item>
				</u-form>
			</view>
			<view><u-button :custom-style="customStyle" @click="saveData" :loading="buttonLoading">提交</u-button></view>
		</view>
		<view v-if="!haveData" class="text-center justify-center flex flex-wrap padding align-center nodata"><u-empty text="暂无数据" mode="data"></u-empty></view>
	</view>
</template>

<script>
import DictionaryApi from '@/api/dictionary.js';
import segmentDaily from '@/api/segmentDaily.js';
import RoleJS from '@/utils/role.js';
import moment from 'moment';
export default {
	components: {
		
	},
	onShareAppMessage() {
		return {
			from: 'menu'
		};
	},
	onShareTimeline() {},
	data() {
		return {
			reportDateShow: false,
			selectShow: false,
			haveData: false,
			countHeight: '58',
			segmentList: [],
			borderUserlineOrgInfos: [],
			customStyle: {
				backgroundColor: '#1941A0',
				color: '#FFFFFF',
				width: '90%',
				height: '100rpx'
			},
			rules: {
				reportTime: [
					{
						required: true,
						message: '请选择填报时间',
						trigger: ['change', 'blur']
					}
				],
				lineName: [
					{
						required: true,
						message: '请选择您要报送的段',
						trigger: ['change', 'blur']
					}
				]
			},
			errorType: ['toast', 'border'],
			buttonLoading: false,
			currentAttendance: 1,
			// 数据
			lineName: '',
			dataTemp: {
				coordinate: {
					lat: '',
					lng: ''
				},
				reportTime: '',
				lineId: '',
				mapType: 2,
				openid: '',
				resultPointEvent: '',
				resultEventType: '',
				resultPointPeople: '',
				resultPointPermanent: '',
				resultPointPatrol: '',
				resultPeopleType: ''
			},
			listQuery: {
				lineId: ''
			}
		};
	},
	onShow() {},
	created() {
		// 是否有多个段长角色
		// console.log(uni.getStorageSync('borderUserlineOrgInfos'));
		this.borderUserlineOrgInfos = uni.getStorageSync('borderUserlineOrgInfos');
		if (this.borderUserlineOrgInfos.length > 1) {
			this.borderUserlineOrgInfos.forEach(Element => {
				this.segmentList.push({ value: Element.id, label: Element.name });
			});
		}
		if (this.borderUserlineOrgInfos.length === 1) {
			this.listQuery.lineId = this.borderUserlineOrgInfos[0].id;
			this.getTotalData();
		}
		this.dataTemp.mapType = this.$MapType;
		this.dataTemp.reportTime = new moment().format('YYYY-MM-DD');
		// 获取段长日报数据
	},

	mounted() {
		// this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		// 选择段长后确认按钮
		segmenSelectconfirm(e) {
			this.lineName = e[0].label;
			this.dataTemp.lineId = e[0].value;
			this.listQuery.lineId = e[0].value;
			this.getTotalData();
		},
		// 获取段长日报总数
		getTotalData() {
			let _this = this;
			segmentDaily.fetchTotalData(this.listQuery).then(res => {
				// console.log('获取段长日报总数', res);
				if (res.data.code === 0) {
					_this.dataTemp = res.data.data;
					_this.$set(_this.dataTemp, 'reportTime', '');
					_this.$set(_this.dataTemp, 'usedDesc', '');
					_this.$set(_this.dataTemp, 'leftDesc', '');
					_this.$set(_this.dataTemp, 'otherDesc', '');
					_this.$set(_this.dataTemp, 'lineId', this.listQuery.lineId);
					_this.dataTemp.reportTime = new moment().format('YYYY-MM-DD');
					this.haveData = true;
					this.getLocation();
				} else {
					this.haveData = false;
				}
			});
		},
		// 出勤人数监听
		attendanceChange(e) {},
		// 提交数据
		saveData() {
			var _this = this;
			if (_this.dataTemp.reportTime == '') {
				uni.showToast({
					title: '请选择填报日期！',
					icon: 'none'
				});
			} else if (_this.lineName == '' && _this.borderUserlineOrgInfos.length > 1) {
				uni.showToast({
					title: '请选择您要报送的段！',
					icon: 'none'
				});
			} else {
				let openid = uni.getStorageSync('openId');
				_this.dataTemp.openid = openid;
				_this.dataTemp.eventCount = _this.dataTemp.resultPointEvent.total;
				_this.dataTemp.eventTypeCount = _this.dataTemp.resultEventType.total;
				_this.dataTemp.floatingPopulation = _this.dataTemp.resultPointPeople.total;
				_this.dataTemp.permanentPopulation = _this.dataTemp.resultPointPermanent.total;
				_this.dataTemp.patrolTimes = _this.dataTemp.resultPointPatrol.total;
				_this.dataTemp.peopleCount = _this.dataTemp.resultPeopleType.total;
				_this.dataTemp.mapType = 2;
				// console.log(_this.dataTemp, '777777777777777777777777777777777');
				segmentDaily.saveDate(this.dataTemp).then(res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '填报成功，记得明日继续哦！',
							icon: 'none'
						});
						setTimeout(function() {
							uni.reLaunch({
								url: '/pages/main/main'
							});
						}, 1500);
					} else {
						uni.showToast({
							title: '报送失败:' + res.data.desc,
							icon: 'none'
						});
						_this.buttonLoading = false;
					}
				});
			}
		},
		getLocation() {
			var _this = this;
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					_this.$set(_this.dataTemp, 'coordinate', {});
					_this.dataTemp.coordinate.lat = res.latitude;
					_this.dataTemp.coordinate.lng = res.longitude;
				}
			});
		},
		eventDateSelectConfirm(e) {
			this.eventDataTemp.reportTime = e.result;
		},
		dateSelectConfirm(e) {
			this.dataTemp.reportTime = e.result;
		}
	}
};
</script>

<style lang="scss" scoped>
.form {
	padding: 20upx 40upx;
}
.report-viewarea {
	border-radius: 15px;
	border: 1px #909399 solid;
	margin: 1% 2% 2% 2%;
	min-height: 300rpx;
	color: #000000;
}
.header-index {
	font-weight: bold;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	width: 100%;
	background-color: #ececec;
}
.head-style {
	font-weight: bold;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	width: 100%;
	// background-color: #ececec;
}
element.style {
	height: 518px;
}
.number_style {
	display: inline-block;
	color: #000000;
	width: 40%;
	height: 70rpx;
	border-radius: 5rpx;
	background-color: #f2f3f5;
	text-align: center;
	// margin: 0 auto;
}
</style>
