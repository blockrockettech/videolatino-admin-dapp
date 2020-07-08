import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import VueForm from 'vue-form';
import VueMoment from 'vue-moment';
import VueClipboard from 'vue-clipboard2'
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import store from './store';

import {
  faFileUpload,
  faBars,
  faCheckCircle,
  faTimesCircle,
  faCaretDown,
  faCopy
} from '@fortawesome/free-solid-svg-icons';

library.add(faFileUpload);
library.add(faBars);
library.add(faCheckCircle);
library.add(faTimesCircle);
library.add(faCaretDown);
library.add(faCopy);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueMoment);
Vue.use(VueForm, {
  inputClasses: {
    valid: 'form-control-success',
    invalid: 'form-control-danger',
  },
});

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
