import Vue from "vue";
import { AgGridVue } from "@ag-grid-community/vue";

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

import { ModuleRegistry } from '@ag-grid-community/core';
// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const VueExample = {
    template: `
        <div style="height: 100%; display: flex; flex-direction: column" class="ag-theme-alpine">
            <ag-grid-vue style="flex: 1 1 auto;"
                         :gridOptions="topGridOptions"
                         @grid-ready="onGridReady"
                         @first-data-rendered="onFirstDataRendered"
                         :columnDefs="columnDefs"
                         :rowData="rowData"
            ></ag-grid-vue>
            <ag-grid-vue style="height: 60px; flex: none;"
                         :gridOptions="bottomGridOptions"
                         :headerHeight="0"
                         :columnDefs="columnDefs"
                         :rowData="bottomData"
                         :rowStyle="rowStyle"
            ></ag-grid-vue>
        </div>
    `,
    components: {
        "ag-grid-vue": AgGridVue
    },
    data: function () {
        return {
            topGridOptions: null,
            bottomGridOptions: null,
            gridApi: null,
            columnApi: null,
            rowData: null,
            bottomData: null,
            columnDefs: null,
            athleteVisible: true,
            ageVisible: true,
            countryVisible: true,
            rowStyle: { fontWeight: 'bold' }
        };
    },
    beforeMount() {
        this.bottomData = [
            {
                athlete: 'Total',
                age: '15 - 61',
                country: 'Ireland',
                year: '2020',
                date: '26/11/1970',
                sport: 'Synchronised Riding',
                gold: 55,
                silver: 65,
                bronze: 12
            }
        ];

        this.topGridOptions = {
            alignedGrids: [],
            defaultColDef: {
                editable: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100
            },
            suppressHorizontalScroll: true
        };
        this.bottomGridOptions = {
            alignedGrids: [],
            defaultColDef: {
                editable: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100
            }
        };
        this.topGridOptions.alignedGrids.push(this.bottomGridOptions);
        this.bottomGridOptions.alignedGrids.push(this.topGridOptions);

        this.columnDefs = [
            { field: 'athlete', width: 200, hide: !this.athleteVisible },
            { field: 'age', width: 150, hide: !this.ageVisible },
            { field: 'country', width: 150, hide: !this.countryVisible },
            { field: 'year', width: 120 },
            { field: 'date', width: 150 },
            { field: 'sport', width: 150 },
            // in the total col, we have a value getter, which usually means we don't need to provide a field
            // however the master/slave depends on the column id (which is derived from the field if provided) in
            // order ot match up the columns
            {
                headerName: 'Total',
                field: 'total',
                valueGetter: 'data.gold + data.silver + data.bronze',
                width: 200
            },
            { field: 'gold', width: 100 },
            { field: 'silver', width: 100 },
            { field: 'bronze', width: 100 }
        ];
    },
    mounted() {
        this.gridApi = this.topGridOptions.api;
        this.gridColumnApi = this.topGridOptions.columnApi;
    },
    methods: {
        onGridReady(params) {
            const httpRequest = new XMLHttpRequest();
            const updateData = data => {
                this.rowData = data;
            };

            httpRequest.open(
                "GET",
                'https://www.ag-grid.com/example-assets/olympic-winners.json'
            );
            httpRequest.send();
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                    updateData(JSON.parse(httpRequest.responseText));
                }
            };
        },

        onFirstDataRendered() {
            this.gridColumnApi.autoSizeAllColumns();
        }
    },
};

new Vue({
    el: "#app",
    components: {
        "my-component": VueExample
    }
});
