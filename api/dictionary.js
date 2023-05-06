import Request from '@/common/request/index.js'

export default {
	// 获取树形数据字典
	getDictionariesTree(query) {
		let r = new Request()
		return r.get('/dictionaries/tree', {
			params: query
		})
	},
	// 获取数据字典
	getDictionaries(query) {
		let r = new Request()
		return r.get('/dictionaries', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 字典内容[所有父级及自己]
	getDictionariesSelf(query) {
		let r = new Request()
		return r.get('/dictionaries/tree/path', {
			params: query
		})
	},
	
	
	//具体查询功能
	// 获取性别
	getGender(query) {
	  query = {
	    dictSubjectId: 'dict_gender'
	  }
	  return this.getDictionaries(query)
	},
	// 获取民族
	getNation(query) {
	  query = {
	    dictSubjectId: 'dict_nation'
	  }
	  return this.getDictionaries(query)
	},
	// 获取学历
	getEducation(query) {
	  query = {
	    dictSubjectId: 'dict_education'
	  }
	  return this.getDictionaries(query)
	},
	// 获取政治面貌
	getPolitic(query) {
	  query = {
	    dictSubjectId: 'dict_zhengzhi_mm'
	  }
	  return this.getDictionaries(query)
	},
	// 获取证件类型
	getCardType(query) {
	  query = {
	    dictSubjectId: 'certificate_type'
	  }
	  return this.getDictionaries(query)
	}
	
}
