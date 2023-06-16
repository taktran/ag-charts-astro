'use strict';

import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';

class ChartExample extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            options: {
    
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
        };

        
    }

    componentDidMount() {
        
    }

    

    render() {
        return <AgChartsReact
    
    options={this.state.options}
/>
;
    }
}



const root = createRoot(document.getElementById('root'));
root.render(<ChartExample />);
