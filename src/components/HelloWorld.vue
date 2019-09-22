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
        <template v-for="(row) in Object.entries(this.entries).sort(sortEntries)">
          <EntryRow :gKey="`${row[0]}`" :value="row[1]" :changeInput="changeInput"/>
        </template>
          <EntryRow :value="{}" :changeInput="changeInput"/>
      </tbody>
    </table>
    <br />
    <table>
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ticket) in tickets">
          <td>{{ticket}}</td>
          <td>{{ formatTimeDelta(timeForTicket(ticket)) }}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <table>
      <thead>
        <tr>
          <th>Account</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account) in accounts">
          <td>{{account}}</td>
          <td>{{ formatTimeDelta(timeForAccount(account)) }}</td>
        </tr>
      </tbody>
    </table>
    <br />
    <table>
      <thead>
        <tr>
          <th>Daily Total</th>
          <th>Weekly Total</th>
          <th>Monthly Total</th>
          <th>Weekly Daily Average</th>
          <th>Monthly Daily Average</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ formatTimeDelta(dailyTotal)}}</td>
          <td>{{ formatTimeDelta(weeklyTotal) }}</td>
          <td>{{ formatTimeDelta(monthlyTotal) }}</td>
          <td>{{ formatTimeDelta(weeklyDailyAverage) }}</td>
          <td>{{ formatTimeDelta(monthlyDailyAverage) }}</td>
        </tr>
      </tbody>
    </table>
    <input type="file" id="file" ref="file" @change="handleFiles()">
  </div>
</template>

<script>
import Gun from 'gun';
// import open from 'gun/lib/open';
// import SEA from 'gun/sea'; // Required for SEA functions and user authentication
import VueTable from 'vuejs-spreadsheet';
import Vue from 'vue';
// import VuexORMGun from '@vuex-orm/plugin-gun';
import moment from 'moment-timezone';
import Papa from 'papaparse';
import EntryRow from './EntryRow';
// https://github.com/zrrrzzt/bullet-catcher
//const gun = new Gun(['http://limaserver:8089/gun']);

const gun = new Gun(['192.168.1.128:8089/gun']);
//const gun = new Gun();
// import { Entry } from '../models/entry';

// const gun = new Gun();

Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  ctx.on('out', function (msg) {
    // console.log('sengin message');
    // console.log(msg);
    var to = this.to
    // Adds headers for put
    msg.headers = {
      token: 'thisIsTheTokenForReals'
    }
    to.next(msg) // pass to next middleware
  }); /*
  ctx.on('in', function (msg) {
    console.log('incoming message');
  });
  */
});
// console.log(open);

/*
const vuexGun = new VuexPersistence({
  restoreState: (key, storage) => Cookies.getJSON(key),
  saveState: (key, state, storage) =>
    Cookies.set(key, state, {
      expires: 3
    }),
  modules: ['user'], //only save user module
  // filter: (mutation) => mutation.type == 'logIn' || mutation.type == 'logOut'
})
*/
export default {
  name: 'app',
  data() {
    return {
      vueState: {},
      loading: false,
      // entriesComputed,
    };
  },
  computed: {
    tickets: {
      get() {
        const start = moment().weekday(0);
        const end = moment().endOf('week');
        // 17 - 23
        return [ ...new Set(Object.values(this.entries).filter(e => e.in && moment.unix(e.in)._isValid && moment.unix(e.in).isAfter(start) && moment.unix(e.in).isBefore(end) )
          .map((e) => e.ticket_id).filter((t) => t))];
      }
    },
    accounts: {
      get() {
        return [ ...new Set(Object.values(this.entries).map((e) => e.account).filter((t) => t))];
      }
    },
    dailyTotal: {
      get() {
        // TODO: More efficient way to do this data comparison?
        return Object.values(this.entries)
          .filter((e) => {
            return e.in && e.out && moment.unix(e.in)._isValid && moment(e.out)._isValid && moment.unix(e.in).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')
          })
          .reduce((totalTime, entry) => {return totalTime + this.getTime(entry) }, 0);
      }
    },
    weeklyTotal: {
      get() {
        return Object.values(this.entries)
          .filter((e) => {
            return e.in && e.out && moment.unix(e.in)._isValid && moment(e.out)._isValid && moment.unix(e.in).year() === moment().year() && moment.unix(e.in).week() === moment().week()
          })
          .reduce((totalTime, entry) => {return totalTime + this.getTime(entry) }, 0);
      }
    },
    monthlyTotal: {
      get() {
        return Object.values(this.entries)
          .filter((e) => {
            return e.in && e.out && moment(e.in)._isValid && moment(e.out)._isValid && moment.unix(e.in).year() === moment().year() && moment.unix(e.in).month() === moment().month()
          })
          .reduce((totalTime, entry) => {return totalTime + this.getTime(entry) }, 0);
      }
    },
    weeklyDailyAverage: {
      get() {
        const workdaysPerWeek = 5;
        const currentWeekday = moment().weekday();
        const workdaysUpTillToday = (currentWeekday > workdaysPerWeek) ? workdaysPerWeek : currentWeekday;
        return this.weeklyTotal / workdaysUpTillToday;
      }
    },
    monthlyDailyAverage: {
      get() {
        const monthStart = moment(moment().format('YYYY-MM-01'));
        const today = moment(moment().format('YYYY-MM-DDT12:00:00'));
        const daysTillNow = parseInt((today.unix() - monthStart.unix()) / 86400) + 1;
        // console.log(`daysTillNow ${daysTillNow}`);
        const weekendDays = [0, 7];
        let weekendDaysTillNow = 0;
        for (var i = 0; i < daysTillNow; i++) {
          const weekday = today.add(i, 'days').weekday();
          weekendDaysTillNow += weekendDays.reduce((acc, weekendDay) => weekday == weekendDay ? acc + 1 : acc, 0);
        }
        let workdaysThisMonth = daysTillNow - weekendDaysTillNow;

        return this.monthlyTotal / workdaysThisMonth;
      }
    },
    entries: {
      get () {
        // const e = Entry.filter();
        // console.log(e);
        // Filter from gun instead

        // const entriesArray = Object.entries(this.vueState).filter(e => e[1]);

        const entriesArray = Object.entries(this.vueState).filter((e) => {
          if (e[1]) {
            return e[1].in > moment().startOf('month').unix() || !e[1].in;
          }
        });

        // const entriesArray = Object.entries(this.vueState).filter(e => e[1] && (e[1].account == "MJFreeway" || !e[1].account));
        const entries = {};
        entriesArray.forEach((entry) => {
          entries[entry[0]] = entry[1];
        });
        return entries;
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
    gun.get('entries').map().on((node, key) => {
      // TODO: Handle indexing
      if (typeof (node) === 'object') {
        Vue.set(this.vueState, key, node);
        // Check if we want to delete this entryRow
        const entry = this.vueState[key];
        if (entry && !entry.in && !entry.out && !entry.description && !entry.ticket_id && !entry.account) {
          gun.get('entries').get(key).put(null);
        }
      }
    });

    // moment('6/4/19 9:00 PM', 'M/D/YY h:m A')
  },
  watch: {
    /*
    'entries.*.in': function (val) {
      console.log('IN CHANGED');
      // this.fullName = val + ' ' + this.lastName
    },
    */
  },
  methods: {
    timeForTicket(ticket) {
      return Object.values(this.entries)
        .filter((e) => { return e.ticket_id && e.ticket_id === ticket && moment(e.in)._isValid })
        .reduce((totalTime, entry) => {return totalTime + this.getTime(entry) }, 0);
    },
    timeForAccount(account) {
      return Object.values(this.entries)
        .filter((e) => { return e.account && e.account === account && moment(e.in)._isValid && moment(e.out)._isValid})
        .reduce((totalTime, entry) => {return totalTime + this.getTime(entry) }, 0);
    },
    getTime(entry) {
      if (entry.in) {
        const clockIn = moment.unix(entry.in);
        const clockOut = entry.out ? moment.unix(entry.out) : moment().unix();
        if (clockIn._isValid && clockOut._isValid) {
          return entry.out - entry.in;
        }
      }
      return ' ';
    },
    formatTimeDelta (seconds) {
      const totalMinutes = parseInt((seconds)/60, 0);
      const hours = parseInt(totalMinutes/60, 0);
      const minutes = parseInt(totalMinutes%60, 0);
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${hours}:${paddedMinutes}` ;
    },
    sortEntries(a, b) {
      const aDate = moment(a[1].in);
      const bDate = moment(b[1].in);
      if (aDate._isValid && bDate._isValid) {
        return aDate.unix() - bDate.unix();
      }
      if (aDate._isValid) {
        return 1;
      } else if (bDate._isValid) {
        return -1;
      }
      return 0;
    },
    changeInput(value, header, key, type) {
      if (type && type === 'dateTime') {
        const dt = moment(value);
        if (dt._isValid) {
          value = dt.unix();
        }
      }

      if (!key) {
        // We're making a new one
        gun.get('entries').get(parseInt(Math.random() * 10000000000, 0)).put({}).get(header).put(value);
      } else {
        gun.get('entries').get(key).get(header).put(value);
      }
    },
    handleFiles() {
      this.file = this.$refs.file.files[0];
      console.log(this.file);
      Papa.parse(this.file, {
      	complete: function(results) {
          results.data.forEach((row) => {
            const clockIn = moment(row[0], 'M/D/YY h:m A').unix();
            const clockOut = moment(row[1], 'M/D/YY h:m A').unix();
            const description = row[2];
            const ticket_id = row[3];
            const account = row[4];
            if (clockIn) {
              const entry = {
                'in': clockIn,
                out: clockOut,
                description: description,
                ticket_id: ticket_id,
                account: account,
              };
              gun.get('entries').get(parseInt(Math.random() * 10000000000, 0)).put(entry);
              console.log(entry);
            }
          });
      	}
      });
    }
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

table th {
  font-weight: bold;
}

table, th, td {
  border: 1px solid black;
}
</style>
