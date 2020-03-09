import Vue from 'vue'

const Responsive = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        scrollHeight() {
          return process.client ? window.screen.height > document.body.scrollHeight ? window.screen.height : document.body.scrollHeight : null;
        },
      },
      data() {
        return {
          isMobile: false
        }
      },
      created() {
        if (process.client) {
          this.checkIfMobile()
          window.addEventListener('resize', () => {
            this.checkIfMobile()
          });
        }
      },
      methods: {
        checkIfMobile() {
          this.isMobile = document.body.clientWidth >= 768 ? false : true;
        }
      }
    })
  }
}
Vue.use(Responsive)
