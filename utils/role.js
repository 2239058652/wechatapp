export default {
	// 判断用户是否具有某个角色
	hasRoles(rolename) {
		let roles = uni.getStorageSync('roles')
		let result = false
		roles.forEach((item) => {
			if (item.id == rolename) {
				result = true
			}
		})
		return result
	},
	// 当前用户角色是否包含数组中的角色
	hasRolesArr(roleArr) {
		let roles = uni.getStorageSync('roles')
		let result = false
		roles.forEach((item) => {
			if (roleArr.findIndex(i => i = item.id) > -1) {
				result = true
			}
		})
		return result
	}
}
