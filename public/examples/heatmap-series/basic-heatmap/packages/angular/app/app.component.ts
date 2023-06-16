import { Component } from '@angular/core';
import { AgChartOptions, AgEnterpriseCharts } from 'ag-charts-enterprise';
import { getData } from './data';
import 'ag-charts-enterprise';

@Component({
    selector: 'my-app',
    template: `<ag-charts-angular
    style="height: 100%"
    [options]="options"
    ></ag-charts-angular>
`
})

export class AppComponent {
    public options: AgChartOptions;
    
    
    constructor() {
        this.options = {
    
    data: getData(),
    title: {
        text: 'UK monthly mean temperature °C',
    },
    series: [
        {
            type: 'heatmap',
            xKey: 'month',
            xName: 'Month',
            yKey: 'year',
            yName: 'Year',
            colorKey: 'temperature',
            colorName: 'Temperature',
            colorRange: ['aliceblue', 'orange'],
        },
    ],
}
    }

    ngOnInit() {
        
    }

    
}


