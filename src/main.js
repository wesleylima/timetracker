import Vue from 'vue';
import gun from '@/plugins/gun';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

// require('gun/lib/open.js');

Vue.use(gun);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
