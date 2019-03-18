<template>
  <div id="app">
    <h1>timetracker</h1>
      <h2>March 2019</h2>
    <table>
      <thead>
        <tr>
          <th>In</th>
          <th>Out</th>
          <th>Time</th>
          <th>Description</th>
          <th>Ticket Id</th>
          <th>Account</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="row && row[1]" v-for="(row) in Object.entries(this.entries)">
          <EntryRow :gKey="`${row[0]}`" :value="row[1]" :changeInput="changeInput"/>
        </template>
          <EntryRow :gKey="`${parseInt(Math.random() * 10000000000, 0)}`" :value="{}" :changeInput="changeInput"/>
      </tbody>
    </table>

  </div>
</template>

<script>
import Gun from 'gun';
import open from 'gun/lib/open';
// import SEA from 'gun/sea'; // Required for SEA functions and user authentication
import VueTable from 'vuejs-spreadsheet';
import Vue from 'vue';
import moment from 'moment-timezone';

import EntryRow from './EntryRow';

const gun = new Gun();
// gun.opt({peers: ['http://localhost:8089/gun']}); //
console.log(open);

export default {
  name: 'app',
  data() {
    return {
      vueState: {},
      loading: false,
    };
  },
  computed: {
    entries: {
      get () {
        // console.log('getting');
        return this.vueState;
      },
      set (value) {
        console.log('setting');
        console.log(value);
      }
    },
  },
  components: {
    EntryRow,
  },
  mounted() {
    /*
    const randId = parseInt(Math.random() * 10000000000, 0);
    const newObj = {};
    newObj[randId] = {in: 'now'};
    gun.get('entries').put(newObj);
    */
    gun.get('entries').map().on((node, key) => {
      if (typeof (node) === 'object') {
        console.log('gun changed');
        Vue.set(this.vueState, key, node);
        // Check if we want to delete this entryRow
        const entry = this.vueState[key];
        if (entry && !entry.in && !entry.out && !entry.description && !entry.ticket_id && !entry.account) {
          gun.get('entries').get(key).put(null);
        }
      }
    });
  },
  methods: {
    changeInput(event, header, key, type) {
      let value = event.target.value;
      if (type && type === 'dateTime') {
        const dt = moment(value);
        if (dt._isValid) {
          value = dt.unix();
        }
      }
      console.log(`KEY: ${key} HEADER ${header} VALUE ${value}`);
      const entry = gun.get('entries').get(key).get(header).put(value);
      console.log(entry);
    },
  },
};
</script>

<style lang="scss">
::-moz-selection {
  color: #2c3e50;
  background: transparent;
}
::selection {
  color: #2c3e50;
  background: transparent;
}
</style>
