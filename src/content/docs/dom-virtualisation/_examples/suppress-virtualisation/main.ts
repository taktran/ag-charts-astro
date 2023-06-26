import { Grid, GridOptions, ValueFormatterParams } from "@ag-grid-community/core";

let times = 1;

const gridOptions: GridOptions<IOlympicData> = {
    columnDefs: [
        { field: 'athlete' },
        { field: 'sport' },
        { field: 'age' },
        { field: 'year' },
        { field: 'date'},
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' }
    ],
    defaultColDef: {
        valueFormatter: (params: ValueFormatterParams) => {
            console.log('formatter called ' + times + ' times');
            times++;
            return params.value;
        },
        cellDataType: false,
    },
    suppressColumnVirtualisation: true,
    suppressRowVirtualisation: true
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    new Grid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then(response => response.json())
        .then((data: IOlympicData[]) => gridOptions.api!.setRowData(data.slice(0,100)));
});
