<template>
	<view>
		<view class="u-search-box">
			<u-search v-model="query.name" :show-action="false" @search="handleSearch()"></u-search>
		</view>
		<view class="scenario-category">
			<view class="scenario-iconbox">
				<view class="category-list">
					<view class="icon-scenario" v-for="(situation, a) in situationlList" :key="situation.id" @tap="handleToScenario(situation)">
						<div class="scenario-circle" :class="sstt[a]">
							<text style="width: 60rpx;">{{ situation.name }}</text>
						</div>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import SituationApi from '../../api/scenario.js';
	export default {
		data() {
			return {
				situationlList: [],
				query: {
					status: 0,
					parentClsId: '',
					name: ''
				},
				sstt: [
					"ss1","ss2","ss3","ss4","ss5","ss6","ss7","ss8","ss9","ss10",
					"ss11","ss12","ss13","ss14","ss15","ss16","ss17","ss18","ss19","ss20",
					"ss21","ss22","ss23","ss24","ss25","ss26","ss27","ss28","ss29","ss30",
					"ss31","ss32","ss33","ss34","ss35","ss36","ss37","ss38","ss39","ss40"
				]
			}
		},
		computed: {},
		onLoad(option) {
			this.scenarioId = option.scenarioId
			this.scenarioName = option.scenarioName
			this.query.parentClsId = option.scenarioId
			this.fechSituationList()
		},
		methods: {
			fechSituationList() {
				this.situationDetailList = []
				SituationApi.getSituationList(this.query).then(res => {
					if (res.data.code === 0) {
						this.situationList = []
						this.situationlList = res.data.data.content
					} else {
						uni.showToast({
							title: '场景获取失败:' + res.data.desc,
							icon: 'none'
						})
					}
				});
			},
			handleSearch(e) {
				this.fechSituationList()
			},
			handleToScenario(e) {
				uni.navigateTo({
					url: '/eventReport/scenario/scenarioList?scenarioId=' + e.id + '&scenarioName=' + e.name
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-search-box {
		padding: 30rpx 30rpx;
	}
	.scenario-title {
		width: 100%;
		text-align: center;
		font-size: 2em;
		font-weight: bold;
	}
	.scenario-category {
		.scenario-iconbox {
			.category-list {
				display: flex;
				flex-wrap: wrap;
				.icon-scenario {
					flex: 0 0 20%;
					text-align: center;	
					color: #666666;
					padding: 10rpx;
					// border-bottom: #f1f1f1 1px solid;
					view {
						display: flex;
						justify-content: center;
						padding: 5rpx;
					}
				}
			}
		}
		.scenario-circle{
			width:100rpx;
			height:100rpx;
			border: 5px solid #ececec;
			display: flex;
			color: #ffffff;
			font-size: 0.8em;
			font-weight: 550;
			align-items: center;
			justify-content: center;
			word-break:break-all;
			border-radius: 50%;
		}
	}
	.ss1{ background: #41A2F8; }
	.ss2{ background: #F0BB41; }
	.ss3{ background: #8FD963; }
	.ss4{ background: #62C2BA; }
	.ss5{ background: #4775CB; }
	.ss6{ background: #3E8B30; }
	.ss7{ background: #F49047; }
	.ss8{ background: #6288b2; }
	.ss9{ background: #ecac60; }
	.ss10{ background: #f87171; }
	.ss11{ background: #41A2F8; }
	.ss12{ background: #F0BB41; }
	.ss13{ background: #8FD963; }
	.ss14{ background: #62C2BA; }
	.ss15{ background: #4775CB; }
	.ss16{ background: #3E8B30; }
	.ss17{ background: #F49047; }
	.ss18{ background: #6288b2; }
	.ss19{ background: #ecac60; }
	.ss20{ background: #f87171; }
	.ss21{ background: #41A2F8; }
	.ss22{ background: #F0BB41; }
	.ss23{ background: #8FD963; }
	.ss24{ background: #62C2BA; }
	.ss25{ background: #4775CB; }
	.ss26{ background: #3E8B30; }
	.ss27{ background: #F49047; }
	.ss28{ background: #6288b2; }
	.ss29{ background: #ecac60; }
	.ss30{ background: #f87171; }
	.ss31{ background: #41A2F8; }
	.ss32{ background: #F0BB41; }
	.ss33{ background: #8FD963; }
	.ss34{ background: #62C2BA; }
	.ss35{ background: #4775CB; }
	.ss36{ background: #3E8B30; }
	.ss37{ background: #F49047; }
	.ss38{ background: #6288b2; }
	.ss39{ background: #ecac60; }
	.ss40{ background: #f87171; }
</style>
