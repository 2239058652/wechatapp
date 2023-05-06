<template>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<block v-for="(categories,a) in tabbar" :key="categories.id">
				<scroll-view scroll-y class="right-box" v-if="current==a">
					<view class="class-item">
						<view class="scenario-category">
							<view class="item-title" v-for="(smallClass, b) in categories.childen" :key="smallClass.id" style="padding: 10rpx 0rpx;">
								<view style="text-align: center; margin-left: 2%;border-bottom: 2px solid #efefef">
									{{smallClass.name}}
								</view>
								<view class="scenario-iconbox">
									<view class="category-list">
										<view class="icon-scenario" v-for="(fineItem, index) in smallClass.childen" :key="fineItem.id" @tap="handleToScenario(fineItem)">
											<view>
												<div class="scenario-circle" :class="sstt[index]">
													<text>{{fineItem.name | fineItemFilter}}</text>
												</div>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	import SituationApi from '../../api/scenario.js';
	export default {
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
		filters: {
			fineItemFilter(val) {
				if (val.length > 10) {
					return val.substring(0, 10) + '...'
				}
				return val
			}
		},
		data() {
			return {
				tabbar: [],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度,
				sstt: [
					"ss1","ss2","ss3","ss4","ss5","ss6","ss7","ss8","ss9","ss10","ss11","ss12"
				]
			}
		},
		computed: {},
		onLoad() {
			this.fechSituationTree()
		},
		methods: {
			fechSituationTree() {
				this.situationTree = []
				SituationApi.getDisputesClsTree().then(res => {
					this.tabbar = res.data.data.content
				});
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			handleToScenario(e) {
				uni.navigateTo({
					url: '/eventReport/eventreporting/eventreporting?scenarioId=' + e.id + '&scenarioName=' + e.name
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}
	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}
	.u-tab-view {
		width: 35%;
		height: 100%;
	}
	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 50rpx;
		left: 0;
		top: 30rpx;
	}
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	.item-title {
		font-size: 1.1em;
		color: $u-main-color;
		font-weight: bold;
		padding: 1%;
	}
	.scenario-category {
		.scenario-iconbox {
			margin-top: 2%;
			.category-list {
				display: flex;
				flex-wrap: wrap;
				.icon-scenario {
					flex: 0 0 33%;
					text-align: center;	
					color: #666666;
					border-bottom: #f1f1f1 1px solid;
					view {
						display: flex;
						justify-content: center;
						padding: 7rpx;
					}
				}
			}
		}
		.scenario-circle{
			width:100%;
			height:100rpx;
			border: 2px solid #ececec;
			display: flex;
			font-size: 0.85em;
			font-weight: 550;
			align-items: center;
			justify-content: center;
			word-break:break-all;
		}
	}
	.ss1{
		background: #F5FAFF;
	}
	.ss2{
		background: #FFFAF5;
	}
	.ss3 {
		background: #F3FFFE;
	}
	.ss4{
		background: #F5FAFF;
	}
	.ss5{
		background: #FFFAF5;
	}
	.ss6{
		background: #F3FFFE;
	}
	.ss7{
		background: #F5FAFF;
	}
	.ss8{
	 	background: #FFFAF5;
	}
	.ss9{
		background: #F3FFFE;
	}
	.ss10{
	 	background: #F5FAFF;
	}
	.ss11{
		background: #FFFAF5;
	}
	.ss12 {
		background: #F3FFFE;
	}
</style>
