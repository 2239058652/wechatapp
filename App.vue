<script>
	import Vue from 'vue'
	import UserApi from 'api/user.js'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			Vue.prototype.ColorList = [{
					title: '嫣红',
					name: 'red',
					color: '#e54d42'
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d'
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08'
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f'
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a'
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4'
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff'
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6'
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0'
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997'
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f'
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3'
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa'
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333'
				},
				{
					title: '雅白',
					name: 'white',
					color: '#ffffff'
				},
			]
			// console.log('App Launch')
			// Baidu(1, "百度"),
			// Tencent(2, "腾讯"),
			// AMap(3, "高德"),
			// SuperMap(4, "超图");
			Vue.prototype.$MapType = 2 //腾讯地图
		},
		onShow: function() {
			// console.log('App Show')
			try {
				var token = uni.getStorageSync('token');
			} catch (e) {
				uni.removeStorageSync('tokenexp');
				uni.reLaunch({
					url: '/pages/login/authlogin'
				})
			}
			if (token == null || token == '') {
				// console.log('....')
				uni.removeStorageSync('tokenexp');
				uni.reLaunch({
					url: '/pages/login/authlogin'
				})
			} else {
				// console.log('1')
			}

			let wechatOpenId = uni.getStorageSync('openId')
			// console.log('1', '12312'+wechatOpenId)
			// #ifdef MP-WEIXIN
			if (!wechatOpenId) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log('loginRes', loginRes);
						UserApi.getWechatOpenId(loginRes.code).then(res => {
							console.log(res)
							uni.setStorageSync('openId', res.data.data.openId)
						})
					}
				});
			}
			// #endif
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/* 头条小程序需要把 iconfont 样式放到组件外 */
	/* @import "components/m-icon/m-icon.css"; */
	@import "colorui/main.css";
	@import "colorui/icon.css";

	/*每个页面公共css */
	page {
		// min-height: 100%;
		/* width: 100%;
		display: flex;
		font-size: 16px; */
		background-color: #fff;
		// min-height: 100%;
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		// height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		// min-height: 100vh;
		/* background-color: #efeff4; */
		background-color: #fff;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		/* min-height: 100%; */
		display: flex;
		flex: 1;
	}

	/*.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		
		 padding: 10px; 
	}*/

	button.primary {
		background-color: #39b54a;
	}

	.listitem {
		border-bottom: #F1F1F1 1upx solid;
	}
</style>
