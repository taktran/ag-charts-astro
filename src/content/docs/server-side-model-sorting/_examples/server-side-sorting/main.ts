import { Grid, GridOptions, IServerSideDatasource, IServerSideGetRowsParams } from '@ag-grid-community/core'
declare var FakeServer: any;
const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: 'athlete', minWidth: 220 },
    { field: 'country', minWidth: 200 },
    { field: 'year' },
    { field: 'sport', minWidth: 200 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
  ],

  defaultColDef: {
    // all columns have sorting enabled
    sortable: true,

    flex: 1,
    minWidth: 100,
    resizable: true,
  },

  // use the server-side row model
  rowModelType: 'serverSide',
  animateRows: true,
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log('[Datasource] - rows requested by grid: ', params.request)

      // get data for request from our fake server
      var response = server.getData(params.request)

      // simulating real server call with a 500ms delay
      setTimeout(function () {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({ rowData: response.rows, rowCount: response.lastRow })
        } else {
          params.fail()
        }
      }, 500)
    },
  }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then(function (data) {
      // setup the fake server with entire dataset
      var fakeServer = new FakeServer(data)

      // create datasource with a reference to the fake server
      var datasource = getServerSideDatasource(fakeServer)

      // register the datasource with the grid
      gridOptions.api!.setServerSideDatasource(datasource)
    })
})
