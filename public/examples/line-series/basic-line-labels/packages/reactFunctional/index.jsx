'use strict';

import React, { useState} from 'react';
import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';

const ChartExample = () => {
    
        
        const [options, setOptions] = useState({
    
    autoSize: true,
    title: {
        text: 'Average expenditure on coffee',
    },
    subtitle: {
        text: 'per person per week in Krakozhia',
    },
    data: [
        {
            year: '2015',
            spending: 35,
        },
        {
            year: '2016',
            spending: 40,
        },
        {
            year: '2017',
            spending: 43,
        },
        {
            year: '2018',
            spending: 44,
        },
    ],
    series: [
        {
            xKey: 'year',
            yKey: 'spending',
            label: {
                fontWeight: 'bold',
            },
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
