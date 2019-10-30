import Gun from 'gun';
// import open from 'gun/lib/open';
import SEA from 'gun/sea'; // Required for SEA functions and user authentication

const gun = new Gun(['https://movieday-host.herokuapp.com/gun']);
const user = gun.user();
/*
export default ({ Vue }) => {
  Vue.prototype.$gun = gun;
  Vue.prototype.$user = user;
};
*/


export default {
  install(Vue, options) {
    Vue.prototype.$gunClass = Gun;
    Vue.prototype.$gun = gun;
    Vue.prototype.$user = user;
  }
};
