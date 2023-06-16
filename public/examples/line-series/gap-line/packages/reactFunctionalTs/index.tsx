'use strict';

import React, { useState} from 'react';
import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';
import { AgChart, AgChartOptions } from 'ag-charts-community';
import { getData } from './data';

const ChartExample = () => {
    
        
        const [options, setOptions] = useState<AgChartOptions>({
    
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
});

        
        

        return <AgChartsReact
    
    options={options}
/>
;
    }



const root = createRoot(document.getElementById('root')!);
root.render(<ChartExample />);
