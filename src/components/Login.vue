<template>
  <div id="app">
    <h1>timetracker</h1>
      <h2>Log In</h2>
    <label for="alias">Alias</label><input type="text" name="alias" v-model="alias"></input>
    <label for="passphrase">Passphrase</label><input type="password" name="passphrase" v-model="passphrase"></input>
    <input type="button" @click="createAccount" value="Create Account"></input>
    <input type="button" value="Log in" @click="logIn"></input>
    <p>{{ wesTasks }} - t </p>
  </div>
</template>

<script>
import Gun from 'gun';
// import open from 'gun/lib/open';
import SEA from 'gun/sea'; // Required for SEA functions and user authentication
import VueTable from 'vuejs-spreadsheet';
import Vue from 'vue';
// import VuexORMGun from '@vuex-orm/plugin-gun';
import moment from 'moment-timezone';
// https://github.com/zrrrzzt/bullet-catcher
//const gun = new Gun(['http://limaserver:8089/gun']);

//const gun = new Gun(['192.168.1.128:8089/gun']);

//const gun = new Gun();
// import { Entry } from '../models/entry';

// const gun = new Gun();10/29/2019 8:50:24 PM

export default {
  name: 'login',
  data() {
    return {
      vueState: {},
      loading: false,
      alias: '',
      passphrase: '',
      // entriesComputed,
    };
  },
  computed: {
    wesTasks: {
      get() {
        return {a: "ayy"};
      }
    },
  },
  methods: {
    async seatest() {
      var pair = await SEA.pair();
      var data = await SEA.sign('Hello esley', pair);
      var encrypted = await SEA.encrypt('Hello esley', pair);
    },
    createAccount() {
      this.$user.create(this.alias, this.passphrase, (ack) => {
        if (!ack.err) {
          console.log('Created user for ', this.alias);
        } else {
          console.log('ack', ack);
        }
      });
    },
    logIn() {
      this.$user.auth(this.alias, this.passphrase, (ack) => {
        if (!ack.err) {
          console.log('Logged in ', this.alias);
          this.$gun.user().get('profile').put({ alias: this.alias, note: 'Hello!'});
          this.$router.push('/');
          /*
          this.$user.recall({ sessionStorage: true }, () => {

          });
          */
        } else {
          console.log('Error');
          console.log('ack', ack);
        }
      });
    },
  },
};
</script>

<style lang="scss">

</style>
