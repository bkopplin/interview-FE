import { useEffect, useState } from 'react'

import './App.css';
import { Box, Container } from '@mui/material'
import { fetchHousingPrices } from './services/housePriceService'
import HighchartsReact from 'highcharts-react-official'
import Highcharts, { SeriesLineOptions } from 'highcharts'
import SelectTypeOfDwelling from './components/SelectTypeOfDwelling'
import SelectTimeRange from './components/SelectTimeRange'
import JSONstat from "https://unpkg.com/jsonstat-toolkit@1.4.2/import.mjs";
import { DEFAULT_TIME_RANGE } from './constants/timeRangeConstants';
import { DEFAULT_DWELLING_TYPE } from './constants/dwellingTypeConstants';

function App() {
  const [typeOfDwelling, setTypeOfDwelling] = useState<string[]>(DEFAULT_DWELLING_TYPE)
  const [timeRange, setTimeRange] = useState<string[]>(DEFAULT_TIME_RANGE)

  const handleChangeTypeOfDwelling = (newVal: string[]) => {
    setTypeOfDwelling(newVal)
  }

  const handleChangeTimeRange = (newVal: string[]) => {
    setTimeRange(newVal)
  }

  const handleUpdateHousingStats = async () => {    
    const data = await fetchHousingPrices(typeOfDwelling, timeRange)
    
    const ds = JSONstat(data)
    const { dimension: { Tid, Boligtype } } = data;
    const boligtypeIndex2Label = (index: string) => Boligtype.category.label[index];
    
    const seriesEntry = (key: string): SeriesLineOptions => ({
      name: boligtypeIndex2Label(key),
      data: ds.Data({"Boligtype": key}, false),
      type: 'line'
    })
    
    const series = Object.keys(Boligtype.category.label).map(seriesEntry);
    
    setChartOptions({
      xAxis: {categories: Object.values(Tid.category.label) },
      series: series
    })
  }

  const [ chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: { type: 'line' },
    title: { text: "Average price per square meter and number of sales, by type of dwelling, contents and quarter" },
    yAxis: [
      {
          title: {
          text: 'Freeholder per km² (NOK)'
        }
      }
    ],
    series: []
  });

  useEffect(() => {handleUpdateHousingStats()}, [timeRange, typeOfDwelling]);

  return (
    <>
    <Container>
      <Box sx={{display: "flex", flexDirection: { xs: "column", md: "row"}}}>
        <Box>
        <SelectTypeOfDwelling handleUpdateCallback={handleChangeTypeOfDwelling} />
      </Box>
      <Box>
        <SelectTimeRange handleUpdateCallback={handleChangeTimeRange} />
      </Box>
      </Box>
      <Box sx={{pt: 3}}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Box>
    </Container>
    </>
  )
}

export default App
