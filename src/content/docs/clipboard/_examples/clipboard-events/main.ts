import { Grid, CellValueChangedEvent, CutEndEvent, CutStartEvent, GridOptions, PasteEndEvent, PasteStartEvent } from '@ag-grid-community/core'

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: 'athlete', minWidth: 200 },
    { field: 'age' },
    { field: 'country', minWidth: 150 },
    { field: 'year' },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],

  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
  },

  enableRangeSelection: true,
  rowSelection: 'multiple',

  onCellValueChanged: onCellValueChanged,
  onCutStart: onCutStart,
  onCutEnd: onCutEnd,
  onPasteStart: onPasteStart,
  onPasteEnd: onPasteEnd,
}

function onCellValueChanged(params: CellValueChangedEvent) {
  console.log('Callback onCellValueChanged:', params)
}

function onCutStart(params: CutStartEvent) {
  console.log('Callback onCutStart:', params)
}

function onCutEnd(params: CutEndEvent) {
  console.log('Callback onCutEnd:', params)
}

function onPasteStart(params: PasteStartEvent) {
  console.log('Callback onPasteStart:', params)
}

function onPasteEnd(params: PasteEndEvent) {
  console.log('Callback onPasteEnd:', params)
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then((data: IOlympicData[]) => gridOptions.api!.setRowData(data))
})
