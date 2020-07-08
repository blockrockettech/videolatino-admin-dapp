<template>
  <div id="app">
    <div v-if="account && !accountProperties.staticWeb3 && networkName !== 'mainnet'">
      <b-alert show dismissible variant="danger" class="m-0">
        Please switch to mainnet as {{networkName}} is not currently supported.
      </b-alert>
    </div>
    <div class="wrapper">
      <!-- Sidebar  -->
      <nav id="sidebar" v-bind:class="{'s-active': collapsed}">
        <div class="sidebar-header heading">
          <h3>TokenLandia Admin</h3>
        </div>

        <ul class="list-unstyled components heading menu-text">
          <li>
            <a href="#" class="dropdown-toggle" @click="toggleSubmenu('minting')">
              Minting
              <font-awesome-icon icon="caret-down" class="ml-auto">
              </font-awesome-icon>
            </a>
            <ul class="collapse list-unstyled heading" id="homeSubmenu" v-bind:class="{'show': expanded.minting}">
              <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/mint/assets' }">
                <router-link to="/">General Products</router-link>
              </li>
              <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/mint/video-latino' }">
                <router-link to="/mint/video-latino">Video Latino</router-link>
              </li>
              <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/mint/real-estate' }">
                <router-link to="/mint/real-estate">Real Estate</router-link>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" class="dropdown-toggle" @click="toggleSubmenu('token_management')">
              Token Management
              <font-awesome-icon icon="caret-down" class="ml-auto">
              </font-awesome-icon>
            </a>
            <ul class="collapse list-unstyled heading" id="tokenManagementSubmenu" v-bind:class="{'show': expanded.token_management}">
              <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/manage/verify' }">
                <router-link to="/manage/verify">Verify</router-link>
              </li>
              <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/manage/update' }">
                <router-link to="/manage/update">Update</router-link>
              </li>
            </ul>
          </li>
          <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/token-transfers' }">
            <router-link to="/token-transfers">Token Transfers</router-link>
          </li>
          <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/user-access' }">
            <router-link to="/user-access">User Access</router-link>
          </li>
          <li class="mt-2 centre-li">
            <b-button @click="onLogin" v-if="!account" variant="primary">
              Login
            </b-button>
            <div v-else>
              <div class="mb-1">Logged in as</div>
              <strong>
                <a :href="`${etherscanBase}/address/${account}`" v-if="account" target="_blank">
                  {{dotDotDotAddress()}}
                </a>
              </strong>
            </div>
            <b-button @click="onLogout" v-if="account" variant="primary">
              Logout
            </b-button>
          </li>
        </ul>

        <hr/>

        <footer class="footer mt-5 p-4">
          Built by <a href="https://blockrocket.tech" target="_blank">BlockRocket</a>
          <br/>
          <current-network class="mt-3"></current-network>
        </footer>
      </nav>

      <!-- Page Content + Footer  -->
      <div id="content">
        <div id="collapse-btn-container">
          <b-button
            id="sidebarCollapse"
            variant="outline-warning"
            @click="toggleSidebarCollapse">
            <font-awesome-icon icon="bars"/>
          </b-button>
        </div>

        <router-view class="view mb-5"/>


      </div>
    </div>

  </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import CurrentNetwork from '@/components/CurrentNetwork.vue';
    import web3Connect from '@/web3ConnectService';

    export default {
        name: 'App',
        data() {
            return {
                collapsed: false,
                expanded: {
                  minting: true,
                  token_management: true
                }
            };
        },
        computed: {
            ...mapState([
                'account',
                'etherscanBase',
                'networkId',
                'networkName'
            ]),
            ...mapGetters([
                'accountProperties'
            ])
        },
        components: {
            CurrentNetwork
        },
        methods: {
            toggleSidebarCollapse() {
                this.collapsed = !this.collapsed;
            },
            toggleSubmenu(menu) {
              this.expanded[menu] = !this.expanded[menu];
            },
            onLogin() {
                web3Connect.toggleModal();
            },
            onLogout() {
                web3Connect.clearCachedProvider();
                this.$store.dispatch('setupStaticWeb3');
            },
            dotDotDotAddress: function () {
                return this.account.substr(0, 6) + '...' + this.account.substr(this.account.length - 6, this.account.length);
            }
        },
        created() {
            web3Connect.on('connect', provider => {
                this.$store.dispatch('bootstrap', provider);
            });

            // If the user has a provider selected then attempt to auto trigger it
            const selectedCacheProvider = web3Connect.cachedProvider;
            if (selectedCacheProvider === "injected") {
              console.log("Cache provider bootstrap - injected web3 provider");
              web3Connect.connectTo(selectedCacheProvider);
            }else{
              this.$store.dispatch('setupStaticWeb3');
            }
        }
    };
</script>

<style lang="scss">
  @import "colours";
  @import '../node_modules/bootstrap/scss/bootstrap';
  @import '../node_modules/bootstrap-vue/src/index.scss';
  @import '../node_modules/vue-date-pick/src/vueDatePick.scss';

  .heading {
    font-family: 'Ubuntu', sans-serif;
  }

  .txt {
    font-family: 'Open Sans', sans-serif;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  a,
  a:hover,
  a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
  }

  .navbar {
    padding: 15px 10px;
    background: #fff;
    border: none;
    border-radius: 0;
    margin-bottom: 40px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }

  .navbar-btn {
    box-shadow: none;
    outline: none !important;
    border: none;
  }

  .line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ddd;
    margin: 40px 0;
  }

  #collapse-btn-container {
    position: absolute;
    margin: 1rem;
  }

  .footer {
    min-height: 50px;
  }

  /* ---------------------------------------------------
      SIDEBAR STYLE
  ----------------------------------------------------- */

  .menu-text {
    text-align: left;
  }

  .centre-li {
    text-align: center;
  }

  .wrapper {
    display: flex;
    width: 100%;
    align-items: stretch;
  }

  #sidebar {
    min-width: 250px;
    max-width: 250px;
    background: #F3B85C;
    color: #fff;
    transition: all 0.3s;
  }

  .s-active {
    margin-left: -250px;
  }

  #sidebar .sidebar-header {
    padding: 20px;
    background: #DE683C;
  }

  #sidebar ul.components {
    padding: 15px 0;
  }

  #sidebar ul p {
    color: #fff;
    padding: 10px;
  }

  #sidebar ul li a {
    padding: 15px;
    font-size: 1.1em;
    display: block;
  }

  #sidebar ul li a:hover {
    color: #F3B85C;
    background: #fff;
  }

  #sidebar ul li.active > a,
  a[aria-expanded="true"] {
    color: #fff;
    background: #DE683C;
  }

  a[data-toggle="collapse"] {
    position: relative;
  }

  .dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
  }

  a.download {
    background: #fff;
    color: #F3B85C;
  }

  a.article,
  a.article:hover {
    background: #DE683C !important;
    color: #fff !important;
  }

  /* ---------------------------------------------------
      CONTENT STYLE
  ----------------------------------------------------- */

  #content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s;
  }

  .view {
    padding: 30px;
  }

  /* ---------------------------------------------------
      MEDIAQUERIES
  ----------------------------------------------------- */

  @media (max-width: 768px) {
    #sidebar {
      margin-left: -250px;
    }
    #sidebar.active {
      margin-left: 0;
    }
    #sidebarCollapse span {
      display: none;
    }
  }
</style>
