<template>
	<view class="content">
		<view>
			<!-- 用户卡片信息 -->
			<view style="padding: 20upx;">
				<view class="homepage-head">
					<div class="homepage-container">
						<view class="homepage-content" style="font-size: 37upx;display: flex;align-items:center;">
							<view style="width: 20%;height: 130rpx;line-height: 130rpx;text-align: center;" @tap="handleUserInfo">
								<view style="height: 95rpx;line-height: 95rpx;text-align: center;">
									<img src="../../eventReport/static/img/user.svg" mode="widthFix" style="width: 80%;height: 70rpx;line-height: 70rpx;text-align: center;" />
								</view>
								<view style="height: 35rpx;line-height: 35rpx;text-align: center;">
									<img mode="widthFix" src="../../eventReport/static/img/grzx.png" style="width: 100%;margin-top: 5%;vertical-align:middle;" />
								</view>
							</view>
							<view style="width: 75%;">
								<view v-if="userType != 1" style="width: 100%;height: 110rpx;line-height: 55rpx;text-align: center;">{{ org.name }}</view>
								<view style="font-size: 30upx;width: 100%;height: 70rpx;line-height: 70rpx;text-align: center;" @tap="handleUserInfo">{{ username }}</view>
							</view>
							<view style="width: 15%;height: 130rpx;">
								<view v-if="userType != 1">
									<view style="position: relative;font-size: 50upx;">
										<u-badge type="error" :offset="[-10, 15]" :count="unreadMailCount"></u-badge>
										<u-icon name="email" @tap="handleToInBox" />
									</view>
									<view style="position: relative;font-size: 50upx;margin-top: 5%;">
										<u-badge type="error" :offset="[-10, 15]" :count="unreadNoticeCount"></u-badge>
										<u-icon name="bell" @tap="handleAnnounce" />
									</view>
								</view>
							</view>
						</view>
					</div>
				</view>
			</view>
			<!-- 点长日报统计 -->
			<view v-if="isBJLD" class="category">
				<view class="title" style="display: flex;justify-content: space-between;">
					<view class="">
						<img mode="widthFix" src="../../eventReport/static/img/sjbsqk.png" style="vertical-align:middle;" />
						防控日报统计
					</view>
					<view class="" @click="handleEventReport()">
						详情
					</view>
				</view>
				<view class="iconbox">
					<view style="padding:20rpx 10rpx 20rpx 10rpx">
						<canvas
							canvas-id="canvasColumnStack"
							id="canvasColumnStack"
							disable-scroll=true
							style="width: 100%;height: 320rpx;"
							@touchstart="touchLineA"
							@touchmove="moveLineA"
							@touchend="touchEndLineA">
						</canvas>
					</view>
				</view>
			</view>
			<view v-if="isZZBLD">
				<!-- 问题隐患报送情况 -->
				<view class="category">
					<view class="title">
						<img mode="widthFix" src="../../eventReport/static/img/sjbsqk.png" style="width: 5%;vertical-align:middle;" />
						问题隐患报送情况
					</view>
					<view class="iconbox">
						<view class="situationHeader">截止目前,问题隐患报送总数：{{ eventData.eventReportCount }} 件</view>
						<view style="padding: 10rpx 6.5vw;">
							<u-line-progress height="40" active-color="#41A2F8" :show-percent="false" :percent="eventData.eventCompleteRate"></u-line-progress>
						</view>
						<view style="padding: 5rpx 6.5vw;">
							<text style="color: #41A2F8;">
								<u-icon name="checkmark-circle-fill"></u-icon>
							</text>
							已办结数量：{{ eventData.eventCompleteCount }} 件
							<text style="float: right;">办结率：{{ eventData.eventCompleteRate }} %</text>
						</view>
					</view>
				</view>
				<!-- 工作上报情况 -->
				<view class="category padding-tb-sm">
					<view class="title">
						<img mode="widthFix" src="../../eventReport/static/img/gzsbqk.png" style="width: 5%;vertical-align:middle;" />
						工作上报情况
					</view>
					<view class="situationHeader">截止目前,工作上报总数：{{workReportData.totalWorkCount}} 条</view>
					<view style="height: 280rpx;">
						<canvas canvas-id="canvasRing" id="canvasRing" style="width: 100%;height: 380rpx;" @touchstart="touchRing"></canvas>
					</view>
				</view>
			</view>
			<view v-if="isSJBSRY" class="scenario-category">
				<view class="scenario-iconbox">
					<view class="category-list">
						<view class="icon-scenario" v-for="(situation, a) in situationList" :key="situation.id" @tap="handleToScenario(situation)">
							<view>
								<div class="scenario-circle" :class="sstt[a]">
									<text style="width: 60rpx;">{{ situation.name }}</text>
								</div>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="category" v-if="categoryList[0].length > 0">
				<view v-if="categoryList[0].length > 0" class="title">
					<img mode="widthFix" src="../../eventReport/static/img/sbgz.png" style="width: 5%;vertical-align:middle;" />
					上报工作
				</view>
				<view class="iconbox">
					<view class="category-list">
						<view class="icon" v-for="category in categoryList[0]" :key="category.cat_id" @tap="toCategory(category)">
							<image mode="widthFix" :src="category.img" @load="categoryImgLoad"></image>
							<view>{{ category.title }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="category">
				<view v-if="categoryList[1].length > 0" class="title">
					<img mode="widthFix" src="../../eventReport/static/img/gzcl.png" style="width: 5%;vertical-align:middle;" />
					工作处理
				</view>
				<view class="iconbox">
					<view class="category-list">
						<view class="icon" v-for="category in categoryList[1]" :key="category.cat_id" @tap="toCategory(category)">
							<image mode="widthFix" :src="category.img" @load="categoryImgLoad"></image>
							<view>{{ category.title }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="category">
				<view v-if="categoryList[2].length > 0" class="title">
					<img mode="widthFix" src="../../eventReport/static/img/qtsw.png" style="width: 5%;vertical-align:middle;" />
					其他事务
				</view>
				<view class="iconbox">
					<view class="category-list">
						<view class="icon" v-for="category in categoryList[2]" :key="category.cat_id" @tap="toCategory(category)">
							<image mode="widthFix" :src="category.img" @load="categoryImgLoad"></image>
							<view>{{ category.title }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="categoryList[3].length > 0" class="category">
				<view class="title">
					<img mode="widthFix" src="../../eventReport/static/img/sjtj.png" style="width: 5%;vertical-align:middle;" />
					数据统计
				</view>
				<view class="iconbox">
					<view class="category-list">
						<view class="icon" v-for="category in categoryList[3]" :key="category.cat_id" @tap="toCategory(category)">
							<image mode="widthFix" :src="category.img" @load="categoryImgLoad"></image>
							<view>{{ category.title }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="category" v-if="categoryList[4].length > 0">
				<view class="title">
					<img mode="widthFix" src="../../eventReport/static/img/sjtj.png" style="width: 5%;vertical-align:middle;" />
					防控工作
				</view>
				<view class="iconbox">
					<view class="category-list">
						<view class="icon" v-for="category in categoryList[4]" :key="category.cat_id" @tap="toCategory(category)">
							<image mode="widthFix" :src="category.img" @load="categoryImgLoad"></image>
							<view>{{ category.title }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="category">
				<view v-if="categoryList[5].length > 0" class="title">
					<img mode="widthFix" src="../../eventReport/static/img/gzcl.png" style="width: 5%;vertical-align:middle;" />
					矛盾纠纷多元化解
				</view>
				<view class="iconbox">
					<view class="category-list">
						<view class="icon" v-for="category in categoryList[5]" :key="category.cat_id" @tap="toCategory(category)">
							<image mode="widthFix" :src="category.img" @load="categoryImgLoad"></image>
							<view>{{ category.title }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="place"></view>
		<!-- 点击详情按钮后弹框 -->
		<cover-view class="pop-up"  v-if="showDaily">
		  <cover-view class="pop-up-container">
			  <cover-view class="close_size" @click="colseView">×</cover-view>
		    <cover-view class="top-title" @click="colseView">防控工作动态 </cover-view>		
		    <cover-view class="tip-date">(截止{{todayDailyData.year}}年{{todayDailyData.month}}月{{todayDailyData.day}}日{{nowTime.hours}}时）</cover-view>
		    <cover-view class="tip-content">
				<cover-view class="workTitle">一、出勤情况</cover-view>
				<cover-view class="workContent_frist">边境疫情防控设置卡点{{todayDailyData.pointAll}}个。出勤 </cover-view>
				<cover-view class="workContent">人数共{{todayDailyData.attendance}}人（州级机关干部{{todayDailyData.attendanceCityOfficials}}人、市级机关干部{{todayDailyData.attendanceCountyOfficials}}人、公安警察{{todayDailyData.attendancePolice}}人、移民警察{{todayDailyData.attendanceImmigrationPolice}}人、乡镇本级民兵{{todayDailyData.attendanceMilitia}}人、对口支援力量{{todayDailyData.attendanceSupport}}人、援边突击队{{todayDailyData.attendanceCommando}}人、村民{{todayDailyData.attendanceVillager}}人）。</cover-view>
				
				<cover-view class="workTitle">二、巡逻情况</cover-view>
				<cover-view class="workContent_frist">边境疫情防控点{{todayDailyData.pointAll}}个，共巡逻{{todayDailyData.patrolTimes}}</cover-view>
				<cover-view class="workContent"> 次，较上日{{DailyDetailsData.patrolTimesValueType}}{{DailyDetailsData.patrolTimesValue}}次{{DailyDetailsData.patrolTimesRate}}。
				</cover-view>
				
				<cover-view class="workTitle">三、执勤情况</cover-view>
				<cover-view class="workContent_frist">过往人员常驻人口数{{todayDailyData.permanentPopulation}}人，较上日</cover-view>
				<cover-view class="workContent" >
					  {{DailyDetailsData.permanentValueType}}{{DailyDetailsData.permanentValue}}人{{DailyDetailsData.permanentRate}}。过往人员流动人口数{{todayDailyData.floatingPopulation}}人，较上日{{DailyDetailsData.floatValueType}}{{DailyDetailsData.floatValue}}人{{DailyDetailsData.floatRate}}。过往车辆数{{todayDailyData.carNumber}}辆，较上日{{DailyDetailsData.carValueType}}{{DailyDetailsData.carValue}}辆{{DailyDetailsData.carRate}}。</cover-view>
			</cover-view>
			<cover-view hover-class='sure_hover' @click="colseView" class="sure">确定</cover-view>
		  </cover-view>
		</cover-view>
		<cover-view class="pop-up" v-if="showData">
		  <cover-view class="nodata-container">
			  <cover-view style="height: 60%; display: flex; justify-content: center; align-items: center;"> <cover-image class="pop-up-img" src="../../static/img/noData.png"></cover-image></cover-view>
			  <cover-view class="nodata-title">数据生成中，请稍后。</cover-view>
			<cover-view hover-class='sure_hover' @click="colseView" class="sure">确定</cover-view>
		  </cover-view>
		</cover-view>
	</view>
</template>
<script>
	import RoleJS from '../../utils/role.js';
	import Integral from '../../api/integral.js';
	import CheckUser from '../../utils/CheckUser.js';
	import SituationApi from '../../api/scenario.js';
	import EventReportApi from '../../api/eventdetail.js';
	import WorkReportApi from '../../api/workreport.js';
	import DocmanagementApi from '../../api/docmanagement.js';
	import uCharts from '@/components/u-charts/u-charts.min.js';
	import StrongAndSolidProof from '../../api/strongAndSolidProof.js';
	import dailydetails from '../../api/dailydetails.js';
	var _self;
	var canvaRing = null;
	var canvaColumn = null;

	export default {
		onShareAppMessage() {
			return {
				from: "menu"
			}
		},
		onShareTimeline() {},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				cStackHeight: '',
				pixelRatio: 1,
				query: {
					sorts: '+reportTime'
				},
				serverData: '',
				// 场景列表
				situationList: [],
				//功能列表
				categoryList: [],
				icons: [],
				showDaily:false,
				detailQuery:{
					time:''
				},
				// 没有数据时
				showData:false,
				asyncIcons: [
					[	
						{
							cat_id: 1,
							img: '../../static/img/m_sjbs.png',
							title: '问题隐患报送',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 2,
							img: '../../static/img/m_mdjf.png',
							title: '矛盾纠纷报送',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
							},
						{
							cat_id: 3,
							img: '../../static/img/m_gzsb.png',
							title: '工作上报',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 4,
							img: '../../static/img/m_zdsjsb.png',
							title: '辖区数据填报',
							roles: ['grid_member']
						},
						{
							cat_id: 5,
							img: '../../static/img/m_qfqz.png',
							title: '群防群治',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						}
					],
					[
						{
							cat_id: 6,
							img: '../../static/img/m_ypfl.png',
							title: '研判分流',
							roles: ['userq', 'cpcq', 'gird_manageq', 'gridq', 'grid_cpcq']
						},
						{
							cat_id: 7,
							img: '../../static/img/m_dbsj.png',
							title: '待办事件',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 8,
							img: '../../static/img/m_sjsp.png',
							title: '事件审批',
							roles: ['manage', 'group_manage', 'gird_manage']
						},
						{
							cat_id: 9,
							img: '../../static/img/m_cbsj.png',
							title: '催办事件',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 10,
							img: '../../static/img/m_yclsj.png',
							title: '已处理事件',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 11,
							img: '../../static/img/m_yjjb.png',
							title: '监督举报',
							roles: ['deploy']
						},
						{
							cat_id: 12,
							img: '../../static/img/m_qzsq.png',
							title: '意见建议',
							roles: ['deploy']
						}
					],
					[
						{
							cat_id: 13,
							img: '../../static/img/m_sjx.png',
							title: '收件箱',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 14,
							img: '../../static/img/m_fjx.png',
							title: '发件箱',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 15,
							img: '../../static/img/m_tzgg.png',
							title: '通知公告',
							roles: ['admin', 'manage', 'user', 'cpc', 'group_admin', 'group_manage',
									'group', 'group_cpc', 'grid_admin', 'gird_manage', 'grid',
									'grid_cpc', 'grid_member', 'grid_member_cpc']
						},
						{
							cat_id: 16,
							img: '../../static/img/m_wgxx.png',
							title: '网格信息',
							roles: ['admin', 'manage', 'user', 'cpc', 'grid_admin', 'gird_manage', 'grid', 'grid_cpc']
						}
					],
					[
						{
								cat_id: 17,
								img: '../../static/img/m_gzsbqk.png',
								title: '工作上报情况',
								roles: ['admin', 'manage', 'user', 'cpc', 'grid_admin', 'gird_manage', 'grid']
						},
						{
								cat_id: 18,
								img: '../../static/img/m_zdsjqk.png',
								title: '辖区数据情况',
								roles: ['admin', 'manage', 'user', 'cpc', 'grid_admin', 'gird_manage', 'grid']
						},
						{
							cat_id: 19,
							img: '../../static/img/m_sjtj.png',
							title: '数据统计',
							roles: []
							// roles: ['admin', 'manage', 'user', 'grid_manage', 'grid', 'grid_admin']
						},
						{
							cat_id: 30,
							img: '../../static/img/m_qfqz.png',
							title: '统计报表',
							roles: ['admin', 'manage', 'user', 'grid_admin', 'gird_manage']
						}
					],
					[
						{
							cat_id: 21,
							img: '../../static/img/m_sjtj.png',
							title: '防控日报统计',
							roles: ['border_control_admin', 'border_control_org_lin_1', 'border_control_org_lin_2','border_control_org_lin_3','border_control_org_full_time']
						},
						{
							cat_id: 22,
							img: '../../static/img/m_zdsjqk.png',
							title: '防控事件统计',
							roles: ['border_control_admin', 'border_control_org_lin_1', 'border_control_org_lin_2','border_control_org_lin_3','border_control_org_full_time']
						},
						{
							cat_id: 20,
							img: '../../static/img/m_dzrb.png',
							title: '段长日报',
							roles: ['border_control_org_lin_3','border_control_org_full_time']
						},
						{
							cat_id: 23,
							img: '../../static/img/m_dzrb.png',
							title: '点长日报',
							roles: ['border_control_org_point']
						},
						{
							cat_id: 24,
							img: '../../static/img/m_sjtj.png',
							title: '日常工作汇总',
							roles: ['border_control_org_lin_1','border_control_org_lin_2','border_control_org_lin_3','border_control_org_full_time']
						},
						{
							cat_id: 25,
							img: '../../static/img/m_zdsjqk.png',
							title: '案件汇总',
							roles: ['border_control_org_lin_1','border_control_org_lin_2','border_control_org_lin_3','border_control_org_full_time']
						},
						{
							cat_id: 26,
							img: '../../static/img/m_cbsj.png',
							title: '户长日报',
							roles: ['border_control_org_house']
						},
						{
							cat_id: 27,
							img: '../../static/img/m_yjjb.png',
							title: '村民动态监测',
							roles: ['border_control_org_house']
						},
						{
							cat_id: 28,
							img: '../../static/img/m_sjbs.png',
							title: '案件报送',
							roles: ['border_control_org_house']
						},
						{
							cat_id: 29,
							img: '../../static/img/m_qfqz.png',
							title: '爱国卫生',
							roles: ['border_control_org_area_4']
						},
						{
							cat_id: 31,
							img: '../../static/img/m_sjbs.png',
							title: '片长日报',
							roles: ['border_control_org_area_3', 'border_control_org_area_4']
						},
						{
							cat_id: 32,
							img: '../../static/img/m_sjtj.png',
							title: '工作情况汇总',
							roles: ['border_control_org_area_1', 'border_control_org_area_2', 'border_control_org_area_3', 'border_control_org_area_4']
						},
						{
							cat_id: 33,
							img: '../../static/img/m_sjx.png',
							title: '片区案件汇总',
							roles: ['border_control_org_area_1', 'border_control_org_area_2', 'border_control_org_area_3', 'border_control_org_area_4']
						},
						{
							cat_id: 38,
							img: '../../static/img/m_dbsj.png',
							title: '通行认证',
							roles: ['border_control_org_point']
						},
						{
							cat_id: 39,
							img: '../../static/img/m_yjjb.png',
							title: '认证记录',
							roles: ['border_control_org_point']
						}
					],
					[
						{
							cat_id: 34,
							img: '../../static/img/m_dbsj.png',
							title: '纠纷登记',
							roles: ['mediate_center_admin', 'mediate_center_receiver', 'mediate_shunt_admin', 'other_mediator']
						},
						{
							cat_id: 35,
							img: '../../static/img/m_sjsp.png',
							title: '纠纷受理',
							roles: ['mediate_center_admin', 'mediate_center_receiver', 'mediate_shunt_admin', 'other_mediator']
						},
						{
							cat_id: 36,
							img: '../../static/img/m_ypfl.png',
							title: '纠纷流转',
							roles: ['mediate_center_admin', 'mediate_center_receiver', 'mediate_shunt_admin', 'other_mediator']
						},
						{
							cat_id: 37,
							img: '../../static/img/m_yclsj.png',
							title: '纠纷调解',
							roles: ['mediate_station_mediator', 'mediate_station_lawyer']
						}
					]
				],
				categoryHeight: '120upx',
				currentPageindex: 0,
				username: '',
				userType: '',
				roles: {},
				org: {},
				borderUserorg:{},
				isWGY: true,
				isWGZ: false,
				isZZBLD: false,
				isBJLD: false,
				isSJBSRY: false,
				isBJRY: false,
				// 问题隐患报送信息
				eventData: {
					eventCompleteRate: 0,
					workerRate: 0,
				},
				// 工作上报情况
				workReportData: {},
				// 未读邮件数
				unreadMailCount: 0,
				// 未读通知公告数
				unreadNoticeCount: 0,
				sstt: [
					"ss1", "ss2", "ss3", "ss4", "ss5", "ss6", "ss7", "ss8", "ss9", "ss10"
				],
				borderData: {},
				// 模态框内容
				show: false,
				// 防控日报数据
				DailyDetailsData:{},
				todayDailyData:{},
				nowTime:{
					total:'',
					hours:'',
					nowHours:''
				}
			};
		},
		onReady() {},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},
		onLoad(query) {
			this.checkLogin();
			this.username = uni.getStorageSync('username');
			this.userType = uni.getStorageSync('userType');
			this.org = uni.getStorageSync('org');
			this.borderUserorg = uni.getStorageSync('borderUserorg')
			// 消息推送
			// this.isTap()
		},
		onShow() {
			this.checkLogin();
			this.username = uni.getStorageSync('username');
			this.userType = uni.getStorageSync('userType');
			this.org = uni.getStorageSync('org');
			this.iconInit();
			this.fechLoad();
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(280);
			this.cStackHeight = uni.upx2px(330);
			if(this.userType !== 1) {
				this.fechLoadWorkReport();
				this.fechSituationList();
			}
			this.fechLoadBorderReport()
			this.getNowTime()
		},
		methods: {
			// 检测是否开启  开启提示
			  isTap() {
				const pushReservationTmplIds = 'plquftPq3NEnLR-GX8wPOoWv-6J2f-wVKDDn5oePYaU';
			    let that = this;
			    wx.getSetting({
			      withSubscriptions: true,
			      success(res) {
					  console.log(res)
						if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) { //用户打开了订阅消息总开关
						// 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
						  if (res.subscriptionsSetting.itemSettings && res.subscriptionsSetting.itemSettings[pushReservationTmplIds]) {
						    let item = res.subscriptionsSetting.itemSettings[pushReservationTmplIds]
							console.log(item)
							// 点击拒绝不再询问
						    if (item == "reject") {
							  uni.showModal({
							  title: '“平安景洪”需要获取你的通知权限',
							  content: '您的通知权限将用于及时收到消息提醒',
							      success: function (res) {
							          if (res.confirm) {
							  			wx.openSetting({
							  			  success (res) {
							  			    console.log(res.authSetting)
							  			  }
							  			})
							          }
							      }
							  })
						    } else if (item == "accept") {
								console.log('已授权')
						    } else if (item == "ban") {
							  uni.showModal({
								   title: '“平安景洪”需要获取你的通知权限',
								   content: '您的通知权限将用于及时收到消息提醒',
							      success: function (res) {
							          if (res.confirm) {
							  			wx.openSetting({
							  			  success (res) {
							  			    console.log(res.authSetting)
							  			  }
							  			})
							          }
							      }
							  });
						    }
						  }else{
							  uni.showModal({
							  title: '“平安景洪”需要获取你的通知权限',
							  content: '您的通知权限将用于及时收到消息提醒',
							      success: function (res) {
							          if (res.confirm) {
							  			that.clickBtn()
							          }
							      }
							  });
						  }
						} else {
							// 授权过的用户但是关闭了后台的mainSwitch(订阅消息总开关)
							if(res.subscriptionsSetting.itemSettings && res.subscriptionsSetting.itemSettings[pushReservationTmplIds]){
								uni.showModal({
								   title: '“平安景洪”需要获取你的通知权限',
								   content: '您的通知权限将用于及时收到消息提醒',
								    success: function (res) {
								        if (res.confirm) {
											wx.openSetting({
											  success (res) {
											    console.log(res.authSetting)
											  }
											})
								        }
								    }
								});
							}else{
								// 没有授权的用户
								uni.showModal({
								   title: '“平安景洪”需要获取你的通知权限',
								   content: '您的通知权限将用于及时收到消息提醒',
								    success: function (res) {
								        if (res.confirm) {
											that.clickBtn()
								        }
								    }
								});
							}
						}
			      }
			    })
			  },
			  // 订阅按钮
			  clickBtn(){
			  	wx.requestSubscribeMessage({   // 调起消息订阅界面
			  	  tmplIds: ['plquftPq3NEnLR-GX8wPOoWv-6J2f-wVKDDn5oePYaU'],
			  	  success (res) {
			  	    console.log(res);
			  	  },
			  	  fail (er){
					  if(er.errCode ===20004 || er.errCode === 20005){
						   console.log("订阅消息 失败 ");
						uni.showModal({
						    title: '提示',
						    content: '前往设置界面',
						    success: function (res) {
						        if (res.confirm) {
									wx.openSetting({
									  success (res) {
									    console.log(res.authSetting)
									  }
									})
						        }
						    }
						});
					  }
					}
			  	})     
			  },
			// 获取当前时间
			getNowTime(){
				var date = new Date();
				this.nowTime.nowHours = date.getHours();
                var month = date.getMonth() + 1;
				if (month < 10)
				    month = "0" + month;
				var day = date.getDate();
				if (day < 10)
					day = "0" + day;
                var time = date.getFullYear() + "-" + month + "-" + day;
				this.nowTime.total = time;
				this.nowTime.year = date.getFullYear();
				this.nowTime.month = date.getMonth() + 1;
				this.nowTime.day = date.getDate();
				this.nowTime.hours = date.getHours();
			},
			// 初始化图标
			iconInit() {
				let userRolesList = uni.getStorageSync('roles');
				function unique(arr) {
					return Array.from(new Set(arr))
				}
				this.categoryList[0] = [];
				this.categoryList[1] = [];
				this.categoryList[2] = [];
				this.categoryList[3] = [];
				this.categoryList[4] = [];
				this.categoryList[5] = [];
				let userFirstRolesList = [];
				let userSecondtRolesList = [];
				let userThreetRolesList = [];
				let userFourtRolesList = [];
				let userFiveRolesList = [];
				let userSixRolesList = [];
				this.asyncIcons[0].forEach(item => {
					item.roles.forEach(newItem => {
						userRolesList.forEach(element => {
							if (newItem == element.id) {
								userFirstRolesList.push(item);
							}
						});
					});
				});
				this.categoryList[0] = unique(userFirstRolesList)
				this.asyncIcons[1].forEach(item => {
					item.roles.forEach(newItem => {
						userRolesList.forEach(element => {
							if (newItem == element.id) {
								userSecondtRolesList.push(item);
							}
						});
					});
				});
				this.categoryList[1] = unique(userSecondtRolesList)
				this.asyncIcons[2].forEach(item => {
					item.roles.forEach(newItem => {
						userRolesList.forEach(element => {
							if (newItem == element.id) {
								userThreetRolesList.push(item);
							}
						});
					});
				});
				this.categoryList[2] = unique(userThreetRolesList)
				this.asyncIcons[3].forEach(item => {
					item.roles.forEach(newItem => {
						userRolesList.forEach(element => {
							if (newItem == element.id) {
								userFourtRolesList.push(item);
							}
						});
					});
				});
				this.categoryList[3] = unique(userFourtRolesList)
				this.asyncIcons[4].forEach(item => {
					item.roles.forEach(newItem => {
						userRolesList.forEach(element => {
							if (newItem == element.id) {
								userFiveRolesList.push(item);
							}
						});
					});
				});
				this.categoryList[4] = unique(userFiveRolesList)
				this.asyncIcons[5].forEach(item => {
					item.roles.forEach(newItem => {
						userRolesList.forEach(element => {
							if (newItem == element.id) {
								userSixRolesList.push(item);
							}
						});
					});
				});
				this.categoryList[5] = unique(userSixRolesList)
			},
			// 处理跳转防控日报
			handleEventReport() {
				uni.navigateTo({
					// url: '../../eventReport/eventlist/bordersummary/bordersummary'
					url: '/eventReport/strongAndSolidProof/dailyReport/index'
				})
			},
			// 关闭弹窗
			colseView(){
				this.showDaily = false
				this.showData = false
			},
			// 角色判断使用
			fechLoad() {
				this.isZZBLD = false;//综治办领导
				this.isBJLD = false;//边境领导
				this.isSJBSRY = false;
				this.isBJRY = false;
				let userRolesList = uni.getStorageSync('roles');
				userRolesList.forEach(item => {
					if (item.id == 'merchant' || item.id == 'merchant_center') {
						uni.redirectTo({
							url: '/eventReport/IntegralManagement/peaceBeans/businessCenter'
						})
					}
				});
				userRolesList.forEach(item => {
					if (item.id == 'manage') {
						this.isZZBLD = true;
					}
				});
				userRolesList.forEach(item => {
					if (item.id == 'border_control_admin'||
						item.id =='border_control_org_lin_1'||
						item.id =='border_control_org_lin_2'||
						item.id=='border_control_org_lin_3'||
						item.id=='border_control_org_full_time') {
						this.isBJLD = true;
					}
				});
				userRolesList.forEach(item => {
					if (item.id == 'grid_member' || item.id == 'grid_cpc' ||
						item.id == 'gird_manage' || item.id == 'group_cpc' || 
						item.id == 'cpc') {
						this.isSJBSRY = true;
					}
				});
				userRolesList.forEach(item => {
					if (item.id == 'border_control_admin' || item.id == 'border_control_org_lin_1' ||
						item.id == 'border_control_org_lin_2' || item.id == 'border_control_org_lin_3' || 
						 item.id == 'border_control_org_full_time' ||
						item.id == 'border_control_org_point') {
						this.isBJRY = true;
					}
				});
				// 登录调取获取积分方法：综治用户
				Integral.getIntegralByLoad().then(res => {});
				// 登录调取统计登录次数
				Integral.getLoginRegistWechat().then(res => {});
				if(this.userType != 1) {
					// 获取问题隐患报送情况
					EventReportApi.getEventReportList().then(res => {
						if (res.data.code === 0) {
							this.eventData = res.data.data;
							this.eventData.eventCompleteRate = Number((this.eventData.eventCompleteRate * 100).toFixed(2));
						}
					});
					// 邮件收发情况
					DocmanagementApi.getRemindCount().then(res => {
						// console.log(res , '邮件收发情况')
						this.unreadMailCount = Number(res.data.data.orgEmailCount) + Number(res.data.data.personEmailCount);
						this.unreadNoticeCount = res.data.data.notifyCount;
					});
				}
			},
			fechLoadBorderReport() {
				// 获取边境数据填报情况
				StrongAndSolidProof.getDailyReportCountList(this.query).then(res => {
					if (res.data.code === 0) {
						// 显示为饼图
						let categories = [];
						let borderData = [];
						let saftyData = [];
						// let dateTotal = []
						let arr = res.data.data.content
						arr.forEach(item => {
							categories.push(item.reportTime.substring(5, item.reportTime.length))
							// dateTotal.push(item.reportTime)
							borderData.push(item.pointReport)
							saftyData.push(item.pointNoReport)
						})
						let chartData = {
							categories: categories,
							series: [{
									"name": "已报送点数",
									"data": borderData,
								}, {
									"name": "未报送点数",
									"data": saftyData,
								},
							]
						}
						_self.showColumnStack("canvasColumnStack", chartData);
						uni.hideLoading();
					}
				});
			},
			touchLineA(e) {
				canvaColumn.scrollStart(e);
			},
			moveLineA(e) {
				canvaColumn.scroll(e);
			},
			touchEndLineA(e) {
				let _this = this
				canvaColumn.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						console.log(category)
						_this.detailQuery.time = '2021-'+category
						 _this.getDailyDetails()
						return category + ' ' + item.name + ':' + item.data + '个'
					}
				});
			},
			showColumnStack(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true
					},
					fontSize: 12,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					enableScroll: true, //开启图表拖拽功能
					dataPointShape: true,
					padding: [15,15,0,5],
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						itemCount: 8,
						scrollShow: false,
						scrollAlign: 'right',
						scrollBackgroundColor: '#F7F7FF',
						scrollColor: '#DEE7F7',
						rotateLabel: false,
						labelCount: 8,
						disableGrid: true,
						rotateLabel: true
					},
					yAxis: {
						//disabled:true
						gridType: 'dash',
						  format: (val) => {
						      return val.toFixed(0) + ''
						     }
						// splitNumber: 4,
						// min: 0,
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cStackHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'stack',
							width: 10,
						}
					}
				});
			},
			touchColumn(e) {
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			fechLoadWorkReport() {
				// 获取工作上报情况
				WorkReportApi.getWorkReportListOnRoles().then(res => {
					if (res.data.code === 0) {
						this.workReportData = res.data.data;
						this.workReportData.workerRate = Number((this.workReportData.workerRate * 100).toFixed(2));
						this.workReportData.gridManageRate = Number((this.workReportData.gridManageRate * 100).toFixed(2));
						this.workReportData.gridMemberRate = Number((this.workReportData.gridMemberRate * 100).toFixed(2));
						// 显示为饼图
						let arr = [];
						let arrPress = [];
						let totle = 0;
						arr.push({
							name: '工作人员',
							data: this.workReportData.workerRate,
							count: this.workReportData.workerCount
						});
						arr.push({
							name: '网格长',
							data: this.workReportData.gridManageRate,
							count: this.workReportData.gridManageCount,
						});
						arr.push({
							name: '网格员',
							data: this.workReportData.gridMemberRate,
							count: this.workReportData.gridMemberCount,
						});
						_self.showRing("canvasRing", arr, totle);
						uni.hideLoading();
					}
				});
			},
			// 获取场景列表
			fechSituationList() {
				SituationApi.getSituationList({
					status: 0
				}).then(res => {
					if (res.data.code === 0) {
						this.situationList = []
						const responseList = res.data.data.content
						if (res.data.data.totalElements >= 11) {
							for (var i = 0; i < responseList.length; i++) {
								if (i < 9) {
									this.situationList.push(responseList[i])
								}
							}
							this.situationList.push({
								name: '＋',
								id: '8'
							})
						} else {
							this.situationList = responseList
						}
					} else {
						uni.showToast({
							title: '场景获取失败:' + res.data.desc,
							icon: 'none'
						})
					}
				});
			},
			showRing(canvasId, chartData, totle) {
				canvaRing = new uCharts({
					$this: _self,
					canvasId: canvasId,
					padding: [0, 0, 0, 0],
					type: 'pie',
					fontSize: 12,
					color: "#000",
					legend: {
						show: true,
						position: 'right',
						fontColor: '#000'
					},
					subtitle: {
						name: '总数',
						color: '#666666',
						fontSize: 10 * _self.pixelRatio,
						offsetY: 5 * _self.pixelRatio,
					},
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 20 * _self.pixelRatio,
							labelWidth: 10
						}
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
				});
			},
			touchRing(e) {
				let name = -1
				canvaRing.showToolTip(e, {
					format: function(item) {
						name = item.name
						return item.name + ': ' + item.count + '条,占比 ' + item.data + '%'
					}
				});
			},
			checkLogin() {
				if (CheckUser.isLoginExpired()) {
					uni.redirectTo({
						url: '../login/login'
					});
				}
			},
			// 跳转收件箱
			handleToInBox() {
				uni.navigateTo({
					url: '/eventReport/docmanagement/inboxlist/inboxlist'
				});
			},
			// 跳转通知公告
			handleAnnounce() {
				uni.navigateTo({
					url: '/eventReport/noticemanagement/list/list'
				});
			},
			// 个人信息
			handleUserInfo() {
				uni.navigateTo({
					url: '/eventReport/user/user'
				});
			},
			//更新分类指示器
			categoryChange(event) {
				this.currentPageindex = event.detail.current;
			},
			//分类图片加载完毕
			categoryImgLoad(e) {
				this.categoryImg = this.categoryImg ? this.categoryImg + 1 : 1;
				//完成加载11个分类图片开始计算分类高度，若分类图片不足10个则修改此处的10。
				if (this.categoryImg == 10) {
					this.getCategoryHeight();
				}
			},
			//更新分类高度
			getCategoryHeight() {
				let view = uni.createSelectorQuery().select('.category-list');
				view.fields({
						size: true
					},
					data => {
						this.categoryHeight = data.height + 'px';
					}
				).exec();
			},
			//信息展示跳转
			handleLogin() {
				uni.navigateBack({
					url: '/pages/login/login'
				});
			},
			//分类跳转
			toCategory(e) {
				if (e.title == '问题隐患报送') {
					uni.navigateTo({
						url: '/eventReport/scenario/index'
					});
				}
				if (e.title == '矛盾纠纷报送') {
					uni.navigateTo({
						url: '/eventReport/scenario/disputesIndex'
					});
				}
				if (e.title == '研判分流') {
					uni.navigateTo({
						url: '/eventReport/eventreporting/todolist/todolist'
					});
				}
				if (e.title == '待办事件') {
					uni.navigateTo({
						url: '/eventReport/eventhandle/index'
					});
				}
				if (e.title == '工作上报') {
					uni.navigateTo({
						url: '/eventReport/workreport/list/list'
					});
				}
				if (e.title == '群防群治') {
					uni.showToast({
						title: '系统功能正在建设中',
						icon: 'none'
					});
				}
				if (e.title == '地图展示') {
					uni.navigateTo({
						url: '/eventReport/mapinfo/index/index'
					});
				}
				if (e.title == '已处理事件') {
					uni.navigateTo({
						url: '/eventReport/eventhandle/donelist/donelist'
					});
				}
				if (e.title == '事件审批') {
					uni.navigateTo({
						url: '/eventReport/leaderapprove/list/list'
					});
				}
				if (e.title == '催办事件') {
					uni.navigateTo({
						url: '/eventReport/eventhandle/presslist/presslist'
					});
				}
				if (e.title == '辖区数据填报') {
					uni.navigateTo({
						url: '/eventReport/keydatareport/list/list'
					});
				}
				if (e.title == '信息报送') {
					uni.navigateTo({
						url: '/eventReport/informationSubmit/submit'
					});
				}
				if (e.title == '收件箱') {
					uni.navigateTo({
						url: '/eventReport/docmanagement/inboxlist/inboxlist'
					});
				}
				if (e.title == '发件箱') {
					uni.navigateTo({
						url: '/eventReport/docmanagement/sendboxlist/sendboxlist'
					});
				}
				if (e.title == '通知公告') {
					uni.navigateTo({
						url: '/eventReport/noticemanagement/list/list'
					});
				}
				if (e.title == '辖区数据情况') {
					uni.navigateTo({
						url: '/eventReport/keydatareport/viewlist/viewlist'
					});
				}
				if (e.title == '网格信息') {
					uni.navigateTo({
						url: '/eventReport/mapinfo/index/index'
					});
				}
				if (e.title == '工作上报情况') {
					uni.navigateTo({
						url: '/eventReport/workreport/viewlist/viewlist'
					});
				}
				if (e.title == '监督举报') {
					uni.navigateTo({
						url: '/eventReport/keyReport/list/list'
					});
				}
				if (e.title == '意见建议') {
					uni.navigateTo({
						url: '/eventReport/opinionSuggestion/list/list'
					});
				}
				if (e.title == '数据统计') {
					uni.navigateTo({
						url: '/eventReport/statistics/performance/performance'
					});
				}
				if (e.title == '统计报表') {
					uni.navigateTo({
						url: '/eventReport/statisticalReports/index'
					});
				}
				if (e.title == '点长日报') {
					uni.navigateTo({
						url: '/eventReport/strongAndSolidProof/index'
					});
				}
				if (e.title == '通行认证') {
					uni.navigateTo({
						url: '/digitalCertificates/scanCode/index'
					});
				}
				if (e.title == '认证记录') {
					uni.navigateTo({
						url: '/digitalCertificates/accessRecords/list'
					});
				}
				if (e.title == '段长日报') {
					uni.navigateTo({
						url: '/eventReport/strongAndSolidProof/segmentDaily/index'
					});
				}
				if (e.title == '防控日报统计') {
					uni.navigateTo({
						url: '/eventReport/strongAndSolidProof/dailyReport/index'
					});
				}
				if (e.title == '防控事件统计') {
					uni.navigateTo({
						url: '/eventReport/strongAndSolidProof/eventReport/index'
					});
				}
				if (e.title == '日常工作汇总') {
					uni.navigateTo({
						url: '/eventReport/strongAndSolidProof/dailyReport/view/viewDaily'
					});
				}
				if (e.title == '案件汇总') {
					uni.navigateTo({
						url: '/eventReport/strongAndSolidProof/dailyReport/view/viewCase'
					});
				}
				if (e.title == '户长日报') {
					uni.navigateTo({
						url: '/eventReport/preventionAndControlSlice/householderDailyReport/report'
					});
				}
				if (e.title == '村民动态监测') {
					uni.navigateTo({
						url: '/eventReport/preventionAndControlSlice/villagerDynamicMonitoring/report'
					});
				}
				if (e.title == '案件报送') {
					uni.navigateTo({
						url: '/eventReport/preventionAndControlSlice/householdIncidentReport/report'
					});
				}
				if (e.title == '爱国卫生') {
					uni.navigateTo({
						url: '/eventReport/preventionAndControlSlice/patrioticHealth/report'
					});
				}
				if (e.title == '片长日报') {
					uni.getStorageSync('roles').forEach(item => {
						if (item.id == 'border_control_org_area_3') {
							uni.navigateTo({
								url: '/eventReport/preventionAndControlSlice/levelThreeDailyReport/report'
							});
						} else if (item.id == 'border_control_org_area_4') {
							uni.navigateTo({
								url: '/eventReport/preventionAndControlSlice/levelFourDailyReport/report'
							});
						}
					});
				}
				if (e.title == '工作情况汇总') {
					uni.navigateTo({
						url: '/eventReport/preventionAndControlSlice/dailyReportsummary/summary'
					});
				}
				if (e.title == '片区案件汇总') {
					uni.navigateTo({
						url: '/eventReport/preventionAndControlSlice/caseReportsummary/summary'
					});
				}
				if (e.title == '纠纷登记') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/spearAdjustableCenter/staff/registration/index'
					});
				}
				if (e.title == '纠纷受理') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/spearAdjustableCenter/staff/accept/acceptList'
					});
				}
				if (e.title == '纠纷流转') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/spearAdjustableCenter/staff/shunt/shuntList'
					});
				}
				if (e.title == '纠纷调解') {
					uni.navigateTo({
						url: '/disputesResolvePlatform/spearAdjustableCenter/staff/transferred/transferredList'
					});
				}
				if (e.title == '积分管理') {
					uni.navigateTo({
						url: '/eventReport/IntegralManagement/integral/index'
					});
				}
				if (e.title == '平安豆管理') {
					uni.navigateTo({
						url: '/eventReport/IntegralManagement/peaceBeans/index'
					});
				}
			},
			// 场景跳转
			handleToScenario(e) {
				if (e.name == '＋') {
					uni.navigateTo({
						url: '/eventReport/scenario/scenario'
					});
				} else {
					if (e.situationType == 1) {
						let query = {
							situationId: e.id,
							name: ''
						}
						SituationApi.getSituationDetailList(query).then(res => {
							if (res.data.code == 0) {
								if (res.data.data.totalElements > 0) {
									let situation = res.data.data.content[0]
									uni.navigateTo({
										url: '/eventReport/eventreporting/eventreporting?situationType=' + e.situationType + '&scenarioId=' +
											situation.eventClassificationCriteria.id + '&scenarioName=' +
											situation.eventClassificationCriteria.name
									});
								}

							}

						});

					} else {
						uni.navigateTo({
							url: '/eventReport/scenario/scenarioList?situationType=' + e.situationType + '&scenarioId=' + e.id +
								'&scenarioName=' + e.name
						});
					}
				}
			},
			// 获取详情数据
			getDailyDetails(){
				let _this = this
				dailydetails.fetchdailydetails(this.detailQuery).then(res => {
					if (res.data.code === 0) {
						if(res.data.data == null){
							_this.showData = true
						}else{
							_this.DailyDetailsData = res.data.data
							_this.todayDailyData = res.data.data.todayData
							_this.todayDailyData.year = _this.todayDailyData.reportTime.substring(0,4)
							_this.todayDailyData.month = _this.todayDailyData.reportTime.substring(5,7)
							_this.todayDailyData.day = _this.todayDailyData.reportTime.substring(8,10)
							_this.showDaily = true
							if(_this.nowTime.total !== _this.todayDailyData.reportTime){
								_this.nowTime.hours = 24
							}else{
								_this.nowTime.hours = _this.nowTime.nowHours
							}
						}
					}else{
						_this.showData = true
						_this.DailyDetailsData = null
						_this.todayDailyData =  null
					}
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	.homepage-head {
		// text-align: right;
		background: url(../../eventReport/static/img/homepage_bg.png);
		background-size: 100% 100%;
		color: #ffffff;
		padding: 55upx 0;
	}
	.homepage-head-merchant {
		background: url(../../eventReport/static/img/homepage_bg.png);
		background-size: 100% 100%;
		color: #ffffff;
		padding: 55upx 0;
		height: 240upx;
		line-height: 65upx;
		text-align: center;
		font-size: large;
	}
	.homepage-container {
		/* 定义flex容器 */
		display: flex;
		/*设置容器内部容器的排列方向*/
		flex-direction: column;
		justify-content: space-between;
		height: 130upx;
		width: 100%;
	}

	.homepage-content {
		text-align: center;
		font-size: 30upx;
		height: 130upx;
		margin-left: 15upx;
		margin-right: 10px;
	}

	.category {
		width: 100%;
		// padding: 1.5vw 0vw;

		.title {
			background-color: #f2f2f2;
			padding: 10rpx 2vw;
			// vertical-align: middle;
			// margin-bottom: 20rpx;
			font-weight: bolder;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			img {
				margin-right: 10rpx;
				width: 35rpx;
			}
		}

		.iconbox {

			// padding: 0rpx 6.5vw;
			.category-list {
				width: 100%;
				display: flex;
				flex-wrap: wrap;

				.icon-scenario {
					flex: 0 0 25%;
					text-align: center;
					color: #666666;
					border-bottom: #f1f1f1 1px solid;

					view {
						width: 100%;
						display: flex;
						justify-content: center;
						padding: 7rpx;
					}
				}

				// flex-wrap: wrap;
				.icon {
					// margin: 0 auto;
					flex: 0 0 25%;
					// width: 33%;
					// height: 125upx;
					text-align: center;
					font-size: 0.75em;
					color: #666666;
					font-weight: 400;
					border-right: #f1f1f1 1px solid;
					border-bottom: #f1f1f1 1px solid;
					padding: 25rpx 0;

					image {
						width: 35%;
						// height: 65rpx;
					}

					view {
						width: 100%;
						display: flex;
						// margin-bottom: 100upx;
						justify-content: center;
						// border-bottom: #F1F1F1 1px solid;
						// padding-bottom: 10upx;
						padding-top: 13rpx;
					}

					&:nth-of-type(n + 5) {
						border-bottom: none;
					}
				}
			}

			.category-list:after {}
		}
	}

	.place {
		height: 0rpx;
	}

	.situationHeader {
		padding: 10rpx 6.5vw;
		color: #000000;
	}

	.workReportText {
		padding: 0rpx 6.5vw;
		font-size: 25upx;
		color: #000000;
	}

	.subtitle {
		display: flex;
		justify-content: center;
		font-size: 1.1em;
		text-align: center;
		font-weight: bold;
		width: 100%;
	}

	.scenario-category {
		margin-left: 1%;
		margin-right: 1%;
		padding: 5upx;

		.scenario-iconbox {
			.category-list {
				display: flex;
				flex-wrap: wrap;

				.icon-scenario {
					flex: 0 0 20%;
					text-align: center;
					color: #666666;
					border-bottom: #f1f1f1 1px solid;

					view {
						display: flex;
						justify-content: center;
						padding: 5rpx;
					}
				}
			}
		}

		.scenario-circle {
			width: 100rpx;
			height: 100rpx;
			border: 2px solid #ececec;
			display: flex;
			color: #ffffff;
			font-size: 1em;
			font-weight: 550;
			align-items: center;
			justify-content: center;
			word-break: break-all;
			border-radius: 50%;
		}
	}

	.ss1 {
		background: #41A2F8;
	}

	.ss2 {
		background: #F0BB41;
	}

	.ss3 {
		background: #8FD963;
	}

	.ss4 {
		background: #62C2BA;
	}

	.ss5 {
		background: #4775CB;
	}

	.ss6 {
		background: #3E8B30;
	}

	.ss7 {
		background: #F49047;
	}

	.ss8 {
		background: #6288b2;
	}

	.ss9 {
		background: #ecac60;
	}

	.ss10 {
		background: #f87171;
	}
	// 模态框样式
	.workTitle{
		color: #272727;
		font-size: 32upx;
		margin: 10upx 0;
		margin-bottom: 20rpx;
	}
	.workContent_frist{
		// white-space: pre-wrap;
		padding-left: 60upx;
		font-family:"宋体";
		line-height: 48upx;
		font-size:32upx;
	}
	.workContent{
		// display: inline-block;
		// text-indent: 2em;
		font-family:"宋体";
		line-height: 48upx;
		font-size:32upx;
		white-space: pre-wrap
	}
	.pop-up{
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: rgba(0, 0, 0, 0.7);
	  z-index: 999999; 
	  display: flex;
	  flex-direction: column; 
	  align-items: center;
	  justify-content: center;
	}
	
	.pop-up-container{
	  position: absolute;
	  width: 90%;
	  // height: 520upx;
	  background-color: #fff;
	  border-radius: 20upx;
	  color: #666;
	  font-family:"Times New Roman";
	}
	.nodata-container{
	   height: 520upx;
	  width: 90%;
	  background-color: #fff;
	  border-radius: 20upx;
	}
	.pop-up-img{
		display: flex;
		// flex-direction: column; 
		align-items: center;
		justify-content: center;
		height: 200upx;
		width: 300upx;
	}
	.nodata-title {
	  font-family:"Times New Roman";
	  height: 100rpx;
	  text-align: center;
	  line-height: 100rpx;
	  color: #CCCCCC;
	  font-size: 36rpx;
	}
	.top-title {
	  font-family:"Times New Roman";
	  height: 100rpx;
	  text-align: center;
	  line-height: 100rpx;
	  color: #272727;
	  font-size: 36rpx;
	}
	
	.tip-date {
	  text-align: center;
	  margin-bottom: 30upx;
	  color: #272727;
	  font-size: 28rpx;
	}
	
	.tip-content {
	  margin: 10rpx 57rpx auto 57rpx;
	  white-space: normal;
	  line-height: 1.6;
	}
	.sure{
		font-size: 30upx;
		border-top: 1upx solid #CCCCCC;
		color: #4e6eff;
		text-align: center;
		margin-top: 20upx;
		padding: 30upx;
		background-color: #F1F3F4;
	}
	.sure_hover{
		background-color:#cfd0d1;
	}
	.close_size{
		// width: 100upx;
		position: absolute;
		top: 10upx;
		right: 0upx;
		padding: 5upx;
		line-height: 60rpx;
		color: #ababab;
		font-size: 60upx;
	}
	
</style>
