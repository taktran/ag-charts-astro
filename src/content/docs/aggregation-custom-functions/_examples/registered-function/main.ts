import { Grid, GridOptions, IAggFuncParams, ValueGetterParams } from '@ag-grid-community/core'

const gridOptions: GridOptions<IOlympicData> = {
    columnDefs: [
        { field: 'country', rowGroup: true, hide: true },
        { field: 'year', rowGroup: true, hide: true },
        { field: 'total', aggFunc: 'mySum'},
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: true,
        resizable: true,
    },
    autoGroupColumnDef: {
        minWidth: 200,
    },
    aggFuncs: {
        'mySum': (params: IAggFuncParams) => {
            let sum = 0;
            params.values.forEach((value: number) => sum += value);
            return sum;
        }
    },
    sideBar: true,
    animateRows: true,
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
    new Grid(gridDiv, gridOptions)

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then(response => response.json())
        .then((data: IOlympicData[]) => gridOptions.api!.setRowData(data))
})

