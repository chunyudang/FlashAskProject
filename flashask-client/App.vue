<script>
import { doVerify } from './store/user'

export default {
	onLaunch: async function() {
		const autoLoggedIn = await doVerify()
		if (autoLoggedIn) {
			console.log('自动登录成功')
		}
		console.log('App Launch')
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style>
	/*每个页面公共css */
</style>
