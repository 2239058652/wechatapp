import Request from '@/common/request/index'
import qs from 'qs'

export default {
	uploadFile(data) {
		let r = new Request()
		return r.post('/file-record', {
			data: data
		})
	},
	downloadFile(id) {
		let r = new Request()
		return r.get('/file-record/download/' + id, {
			responseType: 'blob'
		})
	},

	uploadFileByUni(data) {
		let r = new Request()
		var requestTask = uni.uploadFile({
			url: r.config.baseURL + '/file-record',
			filePath: data,
			name: 'uploadFile',
			// formData: {
			// 	'user': 'test'
			// },
			header: {
				// 'Authorization': 'bearer ' + uni.getStorageSync('token')
				'Authorization': ''
			},
		});
		return requestTask
	},
	downloadFileByUni(id) {
		let r = new Request()
		var requestTask = uni.downloadFile({
			url: r.config.baseURL + 'file-record/download/' + id,
			header: {
				// 'Authorization': 'bearer ' + uni.getStorageSync('token')
				'Authorization': ''
			},
		});
		return requestTask
	}
}
