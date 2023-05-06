//公共js，主要做表单验证，以及基本方法封装
const utils = {
	idcardCheck: function(idcode){
		// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
		// 详情查看javascript的数值范围
		// 加权因子
		    var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
		    // 校验码
		    var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];
		
		    var code = idcode + "";
		    var last = idcode[17];//最后一位
		
		    var seventeen = code.substring(0,17);
		
		    // ISO 7064:1983.MOD 11-2
		    // 判断最后一位校验码是否正确
		    var arr = seventeen.split("");
		    var len = arr.length;
		    var num = 0;
		    for(var i = 0; i < len; i++){
		        num = num + arr[i] * weight_factor[i];
		    }
		    
		    // 获取余数
		    var resisue = num%11;
		    var last_no = check_code[resisue];
		
		    // 格式的正则
		    // 正则思路
		    /*
		    第一位不可能是0
		    第二位到第六位可以是0-9
		    第七位到第十位是年份，所以七八位为19或者20
		    十一位和十二位是月份，这两位是01-12之间的数值
		    十三位和十四位是日期，是从01-31之间的数值
		    十五，十六，十七都是数字0-9
		    十八位可能是数字0-9，也可能是X
		    */
		    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
		
		    // 判断格式是否正确
		    var format = idcard_patter.test(idcode);
		
		    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
		    return last === last_no && format ? true : false;
	},
	isNullOrEmpty: function(value) {
		//是否为空
		return (value === null || value === '' || value === undefined) ? true : false;
	},
	trim: function(value) {
		//去空格
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	isMobile: function(value) {
		//是否为手机号
		return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value);
	},
	isFloat: function(value) {
		//金额，只允许保留两位小数
		return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
	},
	isNum: function(value) {
		//是否全为数字
		return /^[0-9]+$/.test(value);
	},
	checkPwd: function(value) {
		//密码为8~20位数字和字母组合
		return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
	},
	formatNum: function(num) {
		//格式化手机号码
		if (utils.isMobile(num)) {
			num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
		}
		return num;
	},
	rmoney: function(money) {
		//金额格式化
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(
			/\,$/, '').split('').reverse().join('');
	},
	formatDate: function(formatStr, fdate) {
		//日期格式化
		if (fdate) {
			if (~fdate.indexOf('.')) {
				fdate = fdate.substring(0, fdate.indexOf('.'));
			}
			fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
			var fTime, fStr = 'ymdhis';
			if (!formatStr)
				formatStr = "y-m-d h:i:s";
			if (fdate)
				fTime = new Date(fdate);
			else
				fTime = new Date();
			var month = fTime.getMonth() + 1;
			var day = fTime.getDate();
			var hours = fTime.getHours();
			var minu = fTime.getMinutes();
			var second = fTime.getSeconds();
			month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			hours = hours < 10 ? ('0' + hours) : hours;
			minu = minu < 10 ? '0' + minu : minu;
			second = second < 10 ? '0' + second : second;
			var formatArr = [
				fTime.getFullYear().toString(),
				month.toString(),
				day.toString(),
				hours.toString(),
				minu.toString(),
				second.toString()
			]
			for (var i = 0; i < formatArr.length; i++) {
				formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
			}
			return formatStr;
		} else {
			return "";
		}
	}
}

module.exports = {
	isNullOrEmpty: utils.isNullOrEmpty,
	trim: utils.trim,
	isMobile: utils.isMobile,
	isFloat: utils.isFloat,
	isNum: utils.isNum,
	checkPwd: utils.checkPwd,
	formatNum:utils.formatNum,
	rmoney: utils.rmoney,
	formatDate: utils.formatDate,
	idcardCheck:utils.idcardCheck
}
