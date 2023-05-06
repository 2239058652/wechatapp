export default {
	// 判断是否是图片
	isImg(FileName) {
		let ext = this.getFileExt(FileName)
		return [
			'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'
		].indexOf(ext.toLowerCase()) !== -1;
	},
	// 是否视频
	isVideo(FileName) {
		let ext = this.getFileExt(FileName)
		//微信小程序支持的格式
		let arr = [
			'mp4', 'mov', 'm4v', '3gp', 'avi', 'm3u8', 'webm'
		]
		return arr.indexOf(ext.toLowerCase()) !== -1;
	},
	// 获取文件类型
	getFileType(FileName){
		if(this.isImg(FileName)){
			return 'img'
		}
		if(this.isVideo(FileName)){
			return 'video'
		}
		return 'other'
	},
	// 获取文件名后缀
	getFileExt(FileName) {
		return FileName.substr(FileName.lastIndexOf(".") + 1);
	},
	// 获取能打开的文件后缀列表
	getFileExtSupport(){
		return ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
	}

}
