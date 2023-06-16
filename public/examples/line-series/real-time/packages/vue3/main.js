import { createApp } from 'vue';
import { AgChartsVue } from 'ag-charts-vue3';
import { AgChart, time } from 'ag-charts-community';

const ChartExample = {
    template: `
        <div class="wrapper">
                <div id="toolPanel">
                    <button v-on:click="startUpdates()">Start Updates</button>
                </div>
                <ag-charts-vue
                ref="agChart"    
                :options="options"></ag-charts-vue>
            </div>
    `,
    components: {
        'ag-charts-vue': AgChartsVue
    },
    data: function() {
        return {
            options: null
        }
    },
    created() {
        this.options = {
    
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
    },
    mounted() {
        
    },
    methods: {
        update() {
const options = {...this.options};

    options.data = getData();
    

this.options = options;
},
startUpdates() {
    if (updating) {
        return;
    }
    updating = true;
    //@ts-ignore
    this.update();
    //@ts-ignore
    setInterval(this.update, 500);
},
    }
}

var lastTime = new Date('07 Jan 2020 13:25:00 GMT').getTime()

var data = []

window.getData = function getData() {
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

createApp(ChartExample).mount("#app");
