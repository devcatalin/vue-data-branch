import Vue from 'vue'
import App from './App.vue'
import { BranchPlugin } from "vue-data-branch";

import branchRoots from "./branchRoots";

Vue.use(BranchPlugin, { roots: branchRoots });

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
