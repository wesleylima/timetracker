<template>
  <tr>
    <td><input style="background-color: #FFFFFF; color: #000000;" :value="formatDate(value.in)" @change="changeInput($event, 'in', gKey, 'dateTime')" /></td>
    <td><input style="background-color: #FFFFFF; color: #000000;" :value="formatDate(value.out)" @change="changeInput($event, 'out', gKey, 'dateTime')" /></td>
    <td>{{getTime(value)}}</td>
    <td><input style="background-color: #FFFFFF; color: #000000;" :value="value.description" @change="changeInput($event, 'description', gKey)" /></td>
    <td><input style="background-color: #FFFFFF; color: #000000;" :value="value.ticket_id" @change="changeInput($event, 'ticket_id', gKey)" /></td>
    <td><input style="background-color: #FFFFFF; color: #000000;" :value="value.account" @change="changeInput($event, 'account', gKey)" /></td>
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
    gKey: String,
    value: Object,
    changeInput: Function,
  },
  methods: {
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
      const clockIn = moment.unix(entry.in);
      const clockOut = moment.unix(entry.out);
      if (clockIn._isValid && clockOut._isValid) {
        return `${parseInt((entry.out - entry.in)/60, 0)} minutes` ;
      }
      return ' ';
    },
  }
}
</script>
