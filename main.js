import Vue from 'vue'
import App from './App'
import uniIcon from '@/components/uni-icons/uni-icons.vue'
import cuCustom from './colorui/components/cu-custom.vue'

import store from './store'

import uView from "uview-ui";
Vue.use(uView);
import { encrypt, decrypt } from '@/utils/encryp.js';
 
Vue.prototype.encrypt = encrypt
Vue.prototype.decrypt = decrypt
Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'
Vue.component('uniIcon', uniIcon) 
Vue.component('cu-custom',cuCustom)
const app = new Vue({
	store,
	...App
})
app.$mount()
