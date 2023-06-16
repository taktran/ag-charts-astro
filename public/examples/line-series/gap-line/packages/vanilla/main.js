
const options = {
  container: document.getElementById('myChart'),
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

agCharts.AgChart.create(options)
