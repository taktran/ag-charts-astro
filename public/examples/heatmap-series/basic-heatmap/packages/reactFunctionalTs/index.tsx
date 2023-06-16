'use strict';

import React, { useState} from 'react';
import { createRoot } from 'react-dom/client';
import 'ag-charts-enterprise';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions, AgEnterpriseCharts } from 'ag-charts-enterprise';
import { getData } from './data';
import 'ag-charts-enterprise';

const ChartExample = () => {
    
        
        const [options, setOptions] = useState<AgChartOptions>({
    
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
});

        
        

        return <AgChartsReact
    
    options={options as any}
/>
;
    }



const root = createRoot(document.getElementById('root')!);
root.render(<ChartExample />);
