'use strict';

import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';
import { AgChart, time } from 'ag-charts-community';

class ChartExample extends Component {
    constructor(props) {
        super(props);
        
        this.chartRef = React.createRef();
        this.state = {
            options: {
    
    autoSize: true,
    data: getData(),
    series: [
        {
            xKey: 'time',
            yKey: 'voltage',
        },
    ],
    axes: [
        {
            type: 'time',
            position: 'bottom',
            nice: false,
            tick: {
                interval: time.second.every(5),
            },
            label: {
                format: '%H:%M:%S',
            },
        },
        {
            type: 'number',
            position: 'left',
            label: {
                format: '#{.2f}V',
            },
        },
    ],
    title: {
        text: 'Core Voltage',
    },
}
        };

        
    }

    componentDidMount() {
        
    }

    update = () => {
const options = {...this.state.options};

    options.data = getData();
    

this.setState({ options });
}

    startUpdates = () => {
    if (updating) {
        return;
    }
    updating = true;
    //@ts-ignore
    this.update();
    //@ts-ignore
    setInterval(this.update, 500);
}

    render() {
        return <div className="wrapper">
    <div id="toolPanel">
        <button onClick={() => this.startUpdates()}>Start Updates</button>
    </div>
    <AgChartsReact
    ref={this.chartRef}
    options={this.state.options}
/>
</div>
;
    }
}

var lastTime = new Date('07 Jan 2020 13:25:00 GMT').getTime()
var data = []
function getData() {
    data.shift();
    while (data.length < 20) {
        data.push({
            time: new Date((lastTime += 1000)),
            voltage: 1.1 + Math.random() / 2,
        });
    }
    return data;
}
var updating = false

const root = createRoot(document.getElementById('root'));
root.render(<ChartExample />);
