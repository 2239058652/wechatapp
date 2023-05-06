<template>
	<view>
		<view v-for="(item,index) in subjectList" :key="item.id" class="subject">
			<view class="subject-title">
				{{index+1}}. {{item.questionTitle}}
				<text class="text-red">*</text>
			</view>
			<view class="subject-option">
				<view v-if="item.questionType==1" class="">
					<u-radio-group :key="item.id" v-model="subjectList[index].answer" :wrap="true" size="50" :label-disabled="false"
					 width="100%">
						<u-radio @change="radioChange(option,index)" v-for="(option, i) in item.optionVOList" :key="option.id" :name="option.id"
						 class="subject_item">
							{{option.option}}
						</u-radio>
					</u-radio-group>
				</view>
				<view v-if="item.questionType==2" class="">
					<u-checkbox-group :key="item.id" :wrap="true" @change="checkboxGroupChange" :label-disabled="false" size="50"
					 width="100%">
						<u-checkbox @change="checkboxChange" v-model="subjectList[index].optionVOList[i].checked" v-for="(option, i) in item.optionVOList"
						 :key="option.id" :name="option.id">
							{{option.option}}
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</view>
		<view class="footer">
			<u-button v-if="showButton" type="primary" @click="handleAnswer">提交</u-button>
		</view>
	</view>
</template>

<script>
	import Questionnaire from '../../../api/questionnaire.js'
	export default {
		data() {
			return {
				id: '',
				dataTemp: {},
				subjectList: [],
				jumpNo: 1, //跳转的题号，用于控制显示
				showButton: false,
				// value: ''
				// 单选->1、多选->2、简答->3

			}
		},
		watch: {
			subjectList(val) {
				console.log(val.length)
				// 显示题库最后一题
				let [sublast, ...rest] = [...val].reverse()
				// 问卷的题库最后一题
				let [olast, ...orest] = [...this.dataTemp.questionDTOList].reverse()
				console.log(sublast)
				// console.log(olast)
				//显示的最后一题为题库的最后一题，则显示提交按钮
				if (sublast.displayNumber == olast.displayNumber) {
					this.showButton = true
				} else {
					this.showButton = false
				}
				// 选项中有提前结束，显示提交按钮
				// 单选题
				if (sublast.questionType == 1) {
					let selectoption = sublast.optionVOList.find(i => i.id == sublast.answer)
					console.log('selectoption', selectoption)
					if (selectoption && selectoption.jumpQuestionId == "0") {
						this.showButton = true
					} else {
						// this.showButton = false
					}
				}

			}
		},
		onLoad(option) {
			this.id = option.id
			this.fetchDetail()
		},
		methods: {
			handleAnswer() {

				let answer = []
				let openid = uni.getStorageSync('openId')
				for (let i = 0; i < this.subjectList.length; i++) {
					let item = this.subjectList[i]
					if (item.questionType == 1) {
						if (item.required == 1 && item.answer.length <= 0) {
							uni.showToast({
								title: '第' + (i + 1) + '题为必选题',
								icon: 'none'
							})
							answer = []
							// uni.hideLoading()
							break
						}
						answer.push({
							answer: '',
							openid: openid,
							optionId: item.answer,
							questionId: item.id,
							questionnaireId: item.questionnaireId
						})
					}
					if (item.questionType == 2) {
						let selectarr = item.optionVOList.filter(u => u.checked == true)
						let answerarr = Array.from(selectarr, ({
							id
						}) => id)
						console.log('duoxuan', answerarr)
						if (answerarr.length <= 0) {
							uni.showToast({
								title: '第' + (i + 1) + '题为必选题',
								icon: 'none'
							})
							answer = []
							// uni.hideLoading()
							break
						}
						answer.push({
							answer: '',
							openid: openid,
							optionId: answerarr.join(','),
							questionId: item.id,
							questionnaireId: item.questionnaireId
						})
					}
				}
				if (answer.length > 0) {
					console.log('sdfasfdasdf',answer)
					Questionnaire.saveAnswer(answer).then(res => {
						// console.log('答完', res)
						uni.showLoading({
							title: '提交中...'
						})
						uni.hideLoading()
						if (res.data.code == 0) {
							uni.showModal({
								title: '访问到此结束，再次感谢您的支持与配合！祝您生活愉快。',
								showCancel: false,
								success: function(r) {
									console.log(r)
									if (r.confirm) {
										uni.reLaunch({
											url: '/pages/index/index'
										})
									}
								}
							})
						}
					})
				}

				// this.subjectList.forEach(item => {

				// })
			},
			fetchDetail() {
				var _this = this
				uni.showLoading({
					title: '加载中...'
				})
				Questionnaire.getQuestionnaireDetail(this.id).then(res => {
					console.log('detail', res)
					if (res.data.code == 0) {
						this.dataTemp = JSON.parse(JSON.stringify(res.data.data))

						//增加answer字段
						this.dataTemp.questionDTOList.forEach(item => {
							_this.$set(item, 'answer', "")
							item.optionVOList.forEach(i => {
								_this.$set(i, 'checked', false)
							})
						})
						this.subjectList = this.computerSubject(0)
					} else {
						uni.showToast({
							title: "加载失败,请返回后重试",
							icon: 'none'
						})
					}

					uni.hideLoading()
				})
			},
			//返回后续的题，传入index，返回后续遇到下一个跳转的题，包含该题
			computerSubject(displayIndex) {
				var arr = []
				let index = 0
				if (displayIndex > 1) {
					index = displayIndex - 1
				}
				for (let i = index; i < this.dataTemp.questionDTOList.length; i++) {
					if (this.dataTemp.questionDTOList[i].displayNumber >= displayIndex) {
						arr.push(this.dataTemp.questionDTOList[i])
					}
					if (this.dataTemp.questionDTOList[i].isJump == 1) {
						break;
					}
				}
				// arr=this.dataTemp.questionDTOList.find(i=>i.displayNumber>=displayIndex)
				// arr=this.dataTemp.questionDTOList.filter(u => u.displayNumber > displayIndex&&u.isJump != 1 )
				// console.log('asdfasdf', arr)
				return arr
			},
			radioChange(option, currindex) {
				uni.showLoading({

				})
				if (option.jumpQuestionId == "0") {
					//删除当前题之后的题目
					this.subjectList.splice(currindex + 1, this.subjectList.length - currindex + 1)
					// 显示提交按钮
					this.showButton = true
				}
				//获取跳转题
				let item = this.dataTemp.questionDTOList.find(i => i.id == option.jumpQuestionId)
				console.log('sdfasdf', item)
				if (item) {
					//获取跳转题及后续题目
					let arr = this.computerSubject(item.displayNumber)
					console.log('llllll', arr)
					//删除当前题之后的题目
					this.subjectList.splice(currindex + 1, this.subjectList.length - currindex + 1)
					//合并后续题
					this.subjectList = this.subjectList.concat(arr)
				}

				uni.hideLoading()

			},
			checkboxChange(e) {
				// console.log(e)
			},
			checkboxGroupChange(e, index) {
				// console.log(e)
				// console.log(this.subjectList)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.subject {
		padding: 20rpx 40rpx;

		.subject-title {
			padding: 10rpx 0;
			font-size: 1.1em;
			font-weight: bold;
			letter-spacing: 1rpx;

			text {
				margin-left: 5rpx;
			}
		}

		.subject-option {
			padding: 0 25rpx;

			.subject_item {
				// border-bottom: #F1F1F1 1rpx solid !important;
				// padding: 10rpx 20rpx;
			}
		}
	}

	.footer {
		padding: 50rpx;
	}

	/deep/.u-radio {
		// padding: 10rpx 20rpx;
		margin: 10rpx 20rpx;
		border-bottom: #F1F1F1 1rpx solid !important;
	}

	/deep/.u-checkbox {
		// padding: 10rpx 20rpx;
		margin: 10rpx 20rpx;
		border-bottom: #F1F1F1 1rpx solid !important;
	}
</style>
