'use strict';

import React, { useState} from 'react';
import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';

const ChartExample = () => {
    
        
        const [options, setOptions] = useState({
    
    autoSize: true,
    title: {
        text: 'Fuel Spending (2019)',
    },
    data: [
        {
            quarter: 'Q1',
            petrol: 200,
            diesel: 100,
        },
        {
            quarter: 'Q2',
            petrol: 300,
            diesel: 130,
        },
        {
            quarter: 'Q3',
            petrol: 350,
            diesel: 160,
        },
        {
            quarter: 'Q4',
            petrol: 400,
            diesel: 200,
        },
    ],
    series: [
        {
            xKey: 'quarter',
            yKey: 'petrol',
        },
        {
            xKey: 'quarter',
            yKey: 'diesel',
        },
    ],
});

        
        

        return <AgChartsReact
    
    options={options}
/>
;
    }



const root = createRoot(document.getElementById('root'));
root.render(<ChartExample />);