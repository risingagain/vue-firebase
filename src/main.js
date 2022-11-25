import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/app.scss'
import {firestorePlugin} from 'vuefire'
import 'bootstrap'
import LoadScript from 'vue-plugin-load-script';

Vue.config.productionTip = false
Vue.use(firestorePlugin)
Vue.use(LoadScript);

Vue.loadScript("https://maps.google.com/maps/api/js?key=***")
  .then(() => {
    // Script is loaded, do something
    // eslint-disable-next-line no-undef
    //   window.google = google
  })
  .catch(() => {
    // Failed to fetch script
  });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
