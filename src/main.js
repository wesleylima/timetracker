import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueGun from 'vue-gun';

Vue.config.productionTip = false;

Vue.use(VueGun, {
    peers: ['someurl.com:9000/gun']
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
