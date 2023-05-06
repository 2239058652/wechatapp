import Request from '@/common/request/index.js'
import qs from 'qs'

export default {
	// 经纬度查询网格
	getGridByCoordinate(query) {
		let r = new Request()
		return r.get('/grid/gis/search/coordinate', {
			params: query,
			custom: {
				'publish': true
			}
		})
	},
	// 根据范围查询
	getGridByMapScope(query) {
		let r = new Request()
		return r.post('/grid/gis/search/map-scope',
			query, {
				custom: {
					'publish': true
				}
			}
		)
	}

}
