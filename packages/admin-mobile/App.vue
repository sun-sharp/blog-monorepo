<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	onLaunch: function () {
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
})
</script>

<style>
/*每个页面公共css */
</style>
