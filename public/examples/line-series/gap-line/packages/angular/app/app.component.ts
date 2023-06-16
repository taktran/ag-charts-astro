import { Component } from '@angular/core';
import { AgChart, AgChartOptions } from 'ag-charts-community';
import { getData } from './data';

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
    
    autoSize: true,
    data: getData(),
    title: {
        text: 'People Born',
    },
    subtitle: {
        text: '2008-2020',
    },
    series: [
        {
            xKey: 'year',
            yKey: 'visitors',
        },
    ],
}
    }

    ngOnInit() {
        
    }

    
}


