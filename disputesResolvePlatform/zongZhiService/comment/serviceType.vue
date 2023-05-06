<template>
	<view class="form">
		<view v-for="item in serviceTypeTree" :key="item.dictTreeContent.innerId">
			<view class="situation">
				<u-icon name="arrow-right-double" />
				{{ item.dictTreeContent.text }}
			</view>
			<view class="scenario-category">
				<view class="scenario-iconbox">
					<view class="category-list">
						<view class="icon-scenario" v-for="leafItem in item.children" :key="leafItem.dictTreeContent.innerId">
							<div class="scenario-circle" @click="checkServiceType(leafItem)">
								<text style="width: 60rpx;">{{ leafItem.dictTreeContent.text | titleFilter }}</text>
							</div>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ZongZhiService from '@/api/zongZhiService.js'
	
	export default {
		filters: {
			titleFilter(val) {
				if (val == null) {
					return val = '暂无内容'
				} else if (val.length > 6) {
					return val.substring(0, 6) + '...'
				}
				return val
			}
		},
		data() {
			return {
				serviceTypeTree: []
			}
		},
		onShow() {},
		onLoad() {
			this.fetchServiceTree()
		},
		onReady() {},
		methods: {
			// 获取事件类型树数据
			fetchServiceTree() {
				var _this = this
				ZongZhiService.getSituationLeafTree().then(res => {
					_this.serviceTypeTree = res.data.data
				})
			},
			// 选择事件类型
			checkServiceType(data) {
				uni.$emit('checkServiceType', data)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form {
		padding: 20upx 25upx;
	}
	.situation {
		font-size: 1rem;
		font-weight: blod;
		height: 5vh;
		line-height: 5vh;
		font-weight: 900;
		background-color: #ececec;
	}
	.scenario-category {
		.scenario-iconbox {
			.category-list {
				display: flex;
				flex-wrap: wrap;
				.icon-scenario {
					flex: 0 0 33.3%;
					text-align: center;	
					color: #666666;
					padding: 8rpx;
				}
			}
			.scenario-circle{
				background-image: linear-gradient(to right, #330099 , #1261d4, #9FC7F9);
				border-radius: 10rpx;
				height: 8vh;
				line-height: 8vh;
				color: #FFFFFF;
				font-size: 0.8em;
				font-weight: 550;
			}
		}
	}
</style>
