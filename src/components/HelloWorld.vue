<template>
  <div id="app">
    <h1>timetracker</h1>
    <vue-table
      :tbody-data="products"
      :headers="headers"
      :custom-options="customOptions"
      :style-wrap-vue-table="styleWrapVueTable"
      :disable-cells="disableCells"
      :disable-sort-thead="disableSortThead"
      :loading="loading"
      :parent-scroll-element="parentScrollElement"
      :select-position="selectPosition"
      :submenuThead="[]"
      v-on:tbody-change-data="changeData"
      v-on:thead-td-sort="sortProduct">
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

import VueTable from 'vuejs-spreadsheet';

export default {
  name: 'app',
  data() {
    return {
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
      submenuTbody: [
        {
          type: 'button',
          value: 'change color',
          function: 'change-color',
          disabled: ['img'],
        },
        {
          type: 'button',
          value: 'change value',
          function: 'change-value',
          disabled: ['img', 'name'],
        },
      ],
      submenuThead: [
        {
          type: 'button',
          value: 'change color',
          function: 'change-color',
          disabled: ['a'],
        },
        {
          type: 'select',
          disabled: ['a'],
          subtitle: 'Select state:',
          selectOptions: [
            {
              value: 'new-york',
              label: 'new-york',
            },
            {
              value: 'france',
              label: 'france',
            },
          ],
          value: 'new-york',
          buttonOption: {
            value: 'change city',
            function: 'change-city',
            style: {
              display: 'block',
            },
          },
        },
        {
          type: 'button',
          value: 'change value',
          function: 'change-value',
          disabled: ['a', 'b'],
        },
      ],
      disableCells: ['a'],
      loading: false,
      parentScrollElement: {
        attribute: 'html',
        positionTop: 0,
      },
      selectPosition: {
        top: 0,
        left: 0,
      },
      disableSortThead: ['a'],
      styleWrapVueTable: {
        color: '15px',
      },
      headers: [
        {
          headerName: 'In',
          headerKey: 'a',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Out',
          headerKey: 'b',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Hours',
          headerKey: 'c',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Description',
          headerKey: 'd',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Ticket Id',
          headerKey: 'e',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
        {
          headerName: 'Account',
          headerKey: 'f',
          style: {
            width: '200px',
            minWidth: '200px',
            color: '#000',
          },
        },
      ],
      products: [
        {
          a: {
            type: 'input',
            value: '2019-03-14',
            active: false,
            style: {
              color: '#000',
            },
          },
          c: {
            type: 'input',
            value: 'Paris',
            active: false,
            style: {
              color: '#000',
            },
          },
          d: {
            type: 'input',
            value: 'France',
            active: false,
            style: {
              color: '#000',
            },
          },
          e: {
            type: 'input',
            value: 'Boe',
            active: false,
            style: {
              color: '#000',
            },
          },
          f: {
            type: 'select',
            handleSearch: true,
            selectOptions: [
              {
                value: 'Harry Potter',
                label: 'harry potter',
              },
              {
                value: 'Hermione Granger',
                label: 'hermione granger',
              },
              {
                value: 'Ron Whisley',
                label: 'ron whisley',
              },
              {
                value: 'Dobby',
                label: 'dobby',
              },
              {
                value: 'Hagrid',
                label: 'hagrid',
              },
              {
                value: 'Professeur Rogue',
                label: 'professeur rogue',
              },
              {
                value: 'Professeur Mcgonagal',
                label: 'professeur mcgonagal',
              },
              {
                value: 'Professeur Dumbledor',
                label: 'professeur dumbledor',
              },
            ],
            value: 'professeur dumbledor',
            active: false,
          },
          g: {
            type: 'select',
            handleSearch: true,
            selectOptions: [
              {
                value: 1980,
                label: 1980,
              },
              {
                value: 1981,
                label: 1981,
              },
              {
                value: 1982,
                label: 1982,
              },
              {
                value: 1983,
                label: 1983,
                active: true,
              },
              {
                value: 1984,
                label: 1984,
              },
            ],
            value: 1983,
            active: false,
          },
        },
      ],
    };
  },
  components: {
    VueTable,
  },
  mounted() {
    this.$gun.get('some path').map().on((node, key) => {
        // add results straight to the Vue component state
        // and get updates when nodes are updated by GUN
        this.vueState[key] = node;
    });
  },
  methods: {
    changeData(row, header) {
      console.log(row, header);
    },
    sortProduct(event, header, colIndex) {
      console.log(colIndex);
      console.log('sort product');
    },
    // callback
    changeColorThead(event, header, colIndex) {
      this.headers[colIndex].style.color = '#e40000';
    },
    changeColorTbody(event, header, rowIndex, colIndex) {
      this.products[rowIndex][header].style = {};
      this.products[rowIndex][header].style.color = '#e40000';
    },
    changeValueTbody(event, header, rowIndex, colIndex) {
      this.products[rowIndex][header].value = 'T-shirt';
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
