<template>
  <tr>
    <td><input style="width: 165px;" :value="formatDate(value.in)" @change="changeInput($event.target.value, 'in', gKey, 'dateTime')" @keyup.ctrl.65="stamp($event, 'in', gKey)"/></td>
    <td><input style="width: 165px;" :value="formatDate(value.out)" @change="changeInput($event.target.value, 'out', gKey, 'dateTime')" @keyup.ctrl.65="stamp($event, 'out', gKey)" /></td>
    <td>{{getTime(value)}}</td>
    <td><input style="width: 500px;" :value="value.description" @change="changeInput($event.target.value, 'description', gKey)" /></td>
    <td><input style="width: 100px;" :value="value.ticket_id" @change="changeInput($event.target.value, 'ticket_id', gKey)" /></td>
    <td><input style="width: 145px;" :value="value.account" @change="changeInput($event.target.value, 'account', gKey)" /></td>
  </tr>
</template>


<script>
import moment from 'moment-timezone';

export default {
  name: 'entryRow',
  data() {
    return {}
  },
  props: {
    gKey: {
      type: String,
      required: false,
    },
    value: Object,
    changeInput: {
      type: Function,
      required: true,
    }
  },
  methods: {
    stamp(event, header, gKey) {
      console.log('stamping');
      event.preventDefault();
      const now = moment();
      this.changeInput(now.format('YYYY-MM-DDTH:mm:ss'), header, gKey, 'dateTime');
      this.value[header] = now.unix();
    },
    formatDate(unformatted) {
      if (unformatted) {
        const dt = moment.unix(unformatted);
        if (dt._isValid) {
          return dt.format('MM/DD/YYYY h:mm:ss A');
        }
      }
      return unformatted;
    },
    getTime(entry) {
      if (entry.in) {
        const clockIn = moment.unix(entry.in);
        const clockOut = entry.out ? moment.unix(entry.out) : moment().unix();
        if (clockIn._isValid && clockOut._isValid) {
          return `${parseInt((entry.out - entry.in)/60, 0)} minutes` ;
        }
      }
      return ' ';
    },
  }
}
</script>


<style>
  input {
    background-color: #FFFFFF; color: #000000; border: none;
  }
</style>
