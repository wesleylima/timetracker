<template>
  <div id="app">
    <h1>timetracker</h1>
    <vue-table
      :tbody-data="formattedEntries"
      :headers="headers"
      :custom-options="customOptions"
      :style-wrap-vue-table="styleWrapVueTable"
      :disable-cells="disableCells"
      :disable-sort-thead="[]"
      :loading="loading"
      :parent-scroll-element="parentScrollElement"
      :select-position="selectPosition"
      :submenuThead="[]"
      v-on:tbody-change-data="changeData"
      v-on:tbody-submenu-click-change-value="changeValueTbody"
      v-on:thead-td-sort="sortEntry">
    <div slot="header">
      <h2>March 2019</h2>
    </div>
    <div slot="loader">
      Loader
    </div>
    </vue-table>
  </div>
</template>

<script>
import Gun from 'gun';
import open from 'gun/lib/open';
// import SEA from 'gun/sea'; // Required for SEA functions and user authentication
import VueTable from 'vuejs-spreadsheet';
import Vue from 'vue';
// import moment from 'moment-timezone';

const gun = new Gun();
console.log(open);

export default {
  name: 'app',
  data() {
    return {
      vueState: {},
      customOptions: {
        tbodyIndex: true,
        sortHeader: true,
        trad: {
          lang: 'en',
          en: {
            select: {
              placeholder: 'Search by typing',
            },
          },
          fr: {
            select: {
              placeholder: 'Taper pour chercher',
            },
          },
        },
        newData: {
          type: 'input',
          value: '',
          active: false,
          style: {
            color: '#000',
          },
        },
        fuseOptions: {
          shouldSort: true,
          threshold: 0.2,
          location: 0,
          distance: 30,
          maxPatternLength: 64,
          minMatchCharLength: 1,
          findAllMatches: false,
          tokenize: false,
          keys: [
            'value',
          ],
        },
      },
      disableCells: ['time'],
      loading: false,
      parentScrollElement: {
        attribute: 'html',
        positionTop: 0,
      },
      selectPosition: {
        top: 0,
        left: 0,
      },
      styleWrapVueTable: {
        color: '15px',
      },
      headers: [
        {
          headerName: 'In',
          headerKey: 'in',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Out',
          headerKey: 'out',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Time',
          headerKey: 'time',
          style: {
            width: '100px',
            minWidth: '100px',
            color: '#000',
          },
        },
        {
          headerName: 'Description',
          headerKey: 'description',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Ticket Id',
          headerKey: 'ticket_id',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Account',
          headerKey: 'account',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
      ],
    };
  },
  computed: {
    formattedEntries: {
      cache: false,
      get() {
        let formattedEntryTemplate = {
          in: {
            type: 'input',
            value: '',
            active: false,
            style: {
              color: '#000',
            },
          },
          out: {
            type: 'input',
            value: '',
            active: false,
            style: {
              color: '#000',
            },
          },
          time: {
            type: 'input',
            value: '',
            active: false,
            style: {
              color: '#000',
            },
          },
          description: {
            type: 'input',
            value: '',
            active: false,
            style: {
              color: '#000',
            },
          },
          ticket_id: {
            type: 'input',
            handleSearch: true,
            value: '',
            active: false,
          },
          account: {
            type: 'select',
            handleSearch: true,
            selectOptions: [], // this.accounts,
            value: '',
            active: false,
          },
          key: {
            value: '',
          },
        };
        const entries = Object.keys(this.vueState).map((key) => {
          const entry = this.vueState[key];
          const formattedEntry = JSON.parse(JSON.stringify(formattedEntryTemplate));
          Object.keys(formattedEntry).forEach((k) => {
            formattedEntry[k].value = entry[k] || '';
            formattedEntry.key.value = key;
          });
          return formattedEntry;
        });
        const newEntry = JSON.parse(JSON.stringify(formattedEntryTemplate));
        newEntry.key = { value: parseInt(Math.random() * 10000000000, 0) };
        entries.push(newEntry);

        return entries;
      },
    },
  },
  components: {
    VueTable,
  },
  mounted() {
    gun.get('entries').map().on((node, key) => {
      if (typeof (node) === 'object') {
        // add results straight to the Vue component state
        // and get updates when nodes are updated by GUN
        // console.log(`${key}: ${node}`);
        Vue.set(this.vueState, key, node);
        // console.log('recomputing');
        // this.$recompute('formattedEntries');
        // console.log(node);
      }

      /*
      this.accounts = [
        {
          value: 'Harry Potter',
          label: 'harry potter',
        },
      ];
      */
    });
  },
  methods: {
    formatEntry(entry, key) {
      const formattedEntryTemplate = {
        in: {
          type: 'input',
          value: '',
          active: false,
          style: {
            color: '#000',
          },
        },
        out: {
          type: 'input',
          value: '',
          active: false,
          style: {
            color: '#000',
          },
        },
        time: {
          type: 'input',
          value: '',
          active: false,
          style: {
            color: '#000',
          },
        },
        description: {
          type: 'input',
          value: '',
          active: false,
          style: {
            color: '#000',
          },
        },
        ticket_id: {
          type: 'input',
          handleSearch: true,
          value: '',
          active: false,
        },
        /*
        account: {
          type: 'select',
          handleSearch: true,
          selectOptions: [], // this.accounts,
          value: '',
          active: false,
        },
        */
        key: {
          value: '',
        },
      };
      const formattedEntry = { ...formattedEntryTemplate };
      Object.keys(formattedEntry).forEach((k) => {
        formattedEntry[k].value = entry[k] || '';
        formattedEntry.key.value = key;
      });
      return formattedEntry;
    },
    changeData(row, header) {
      if (row in ['in', 'out']) {
        // console.log(row);
        // console.log(header);
      }
      const key = this.formattedEntries[row].key.value;
      const { value } = this.formattedEntries[row][header];

      const entry = gun.get('entries').get(key).get(header).put(value);
    },
    sortEntry(event, header, colIndex) {
      console.log(colIndex);
      console.log('sort product');
    },
    // callback
    changeColorThead(event, header, colIndex) {
      this.headers[colIndex].style.color = '#e40000';
    },
    changeColorTbody(event, header, rowIndex, colIndex) {
      console.log(colIndex);
      // this.products[rowIndex][header].style = {};
      // this.products[rowIndex][header].style.color = '#e40000';
    },
    changeValueTbody(event, header, rowIndex, colIndex) {
      console.log(colIndex);
      // this.products[rowIndex][header].value = 'T-shirt';
    },
    changeValueThead(event, entry, colIndex) {
      this.headers[colIndex].headerName = 'T-shirt';
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
