import { Grid, ColDef, GridOptions, IRowNode } from '@ag-grid-community/core'

const columnDefs: ColDef[] = [
  { field: 'athlete', minWidth: 200 },
  { field: 'age' },
  { field: 'country', minWidth: 200 },
  { field: 'year' },
  { field: 'date', minWidth: 150 },
  { field: 'sport', minWidth: 150 },
  { field: 'gold' },
  { field: 'silver' },
]

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: columnDefs,
  rowSelection: 'multiple',
}

function onBtExport() {
  var spreadsheets: string[] = []

  let nodesToExport: IRowNode[] = [];
  gridOptions.api!.forEachNode((node, index) => {
    nodesToExport.push(node);

    if (index % 100 === 99) {
      gridOptions.api!.setNodesSelected({ nodes: nodesToExport, newValue: true });
      spreadsheets.push(
        gridOptions.api!.getSheetDataForExcel({
          onlySelected: true,
        })!
      )

      gridOptions.api!.deselectAll()
      nodesToExport = [];
    }
  })

  // check if the last page was exported

  if (gridOptions.api!.getSelectedNodes().length) {
    spreadsheets.push(
      gridOptions.api!.getSheetDataForExcel({
        onlySelected: true,
      })!
    )
    gridOptions.api!.deselectAll()
  }

  gridOptions.api!.exportMultipleSheetsAsExcel({
    data: spreadsheets,
    fileName: 'ag-grid.xlsx'
  })
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then((data: IOlympicData[]) => gridOptions.api!.setRowData(data))
})
