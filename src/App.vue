<template>
  <div class="container-fluid">
    <nav class="navbar navbar-horizontal navbar-main navbar-light navbar-transparent navbar-expand-lg"><div class="container"><div class="navbar-wrapper"><a href="#/" class="navbar-brand active" target="_self"><img src="img/brand/white.png"></a></div><button type="button" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler collapsed"><span class="navbar-toggler-bar navbar-kebab"></span><span class="navbar-toggler-bar navbar-kebab"></span><span class="navbar-toggler-bar navbar-kebab"></span></button><button type="button" aria-label="Toggle navigation" aria-controls="nav-text-collapse" aria-expanded="false" class="navbar-toggler"><span class="navbar-toggler-icon"></span></button><div id="nav-text-collapse" class="navbar-custom-collapse collapse show navbar-collapse collapse justify-content-end" style="display: none;"><div class="navbar-collapse-header"><div class="row"><div class="collapse-brand col-6"><a href="#/" class="active"><img src="img/brand/green.png"></a></div><div class="collapse-close col-6"><button type="button" class="navbar-toggler"><span></span><span></span></button></div></div></div><ul class="navbar-nav mr-auto"><li class="nav-item"><a href="#/dashboard" class="nav-link" target="_self"><span class="nav-link-inner--text">Dashboard</span></a></li><li class="nav-item"><a href="#/pricing" class="nav-link" target="_self"><span class="nav-link-inner--text">Pricing</span></a></li><li class="nav-item"><a href="#/login" class="nav-link" target="_self"><span class="nav-link-inner--text">Login</span></a></li><li class="nav-item"><a href="#/register" class="nav-link" target="_self"><span class="nav-link-inner--text">Register</span></a></li><li class="nav-item"><a href="#/lock" class="nav-link" target="_self"><span class="nav-link-inner--text">Lock</span></a></li></ul><hr class="d-lg-none"><ul class="navbar-nav align-items-lg-center ml-lg-auto"><li data-toggle="tooltip" data-original-title="Like us on Facebook" class="nav-item"><a rel="noopener" target="_blank" href="https://www.facebook.com/creativetim" class="nav-link nav-link-icon"><i class="fab fa-facebook-square"></i><span class="nav-link-inner--text d-lg-none">Facebook</span></a></li><li data-toggle="tooltip" data-original-title="Follow us on Instagram" class="nav-item"><a rel="noopener" target="_blank" href="https://www.instagram.com/creativetimofficial" class="nav-link nav-link-icon"><i class="fab fa-instagram"></i><span class="nav-link-inner--text d-lg-none">Instagram</span></a></li><li data-toggle="tooltip" data-original-title="Follow us on Twitter" class="nav-item"><a rel="noopener" target="_blank" href="https://twitter.com/creativetim" class="nav-link nav-link-icon"><i class="fab fa-twitter-square"></i><span class="nav-link-inner--text d-lg-none">Twitter</span></a></li><li data-toggle="tooltip" data-original-title="Star us on Github" class="nav-item"><a rel="noopener" target="_blank" href="https://github.com/creativetimofficial" class="nav-link nav-link-icon"><i class="fab fa-github"></i><span class="nav-link-inner--text d-lg-none">Github</span></a></li><li class="nav-item d-none d-lg-block ml-lg-4"><a href="https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard-pro?ref=bvadp-index-page" target="_blank" class="btn btn-neutral btn-icon"><span class="btn-inner--icon"><i class="fas fa-shopping-cart mr-2"></i></span><span class="nav-link-inner--text">Purchase now</span></a></li></ul></div></div></nav>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

export default {
  name: 'App',
  data: () => ({
  }),
  methods: {
    home () {
      if (this.$route.name !== '') {
        this.$router.push('/').catch(() => {})
      }
    },

    login () {
      if (this.$route.name !== 'login') {
        this.$router.push('/login').catch(() => {})
      }
    },

    orgs () {
      if (this.$route.name !== 'orgs') {
        this.$router.push('/organisations').catch(() => {})
      }
    },

    isLogged () {
      const loggedIn = localStorage.getItem('login_token')
      return loggedIn !== undefined && loggedIn !== null && loggedIn !== ''
    }
  },
  computed: {
    tokenDecoder () {
      const token = localStorage.getItem('login_token')
      if (token === undefined || token === null || token === '') {
        return ''
      } else {
        const decoded = jwt_decode(token)
        console.log(decoded)
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #main-content {
    margin-top: 65px;
    height: calc(100vh - 65px);
  }
</style>
