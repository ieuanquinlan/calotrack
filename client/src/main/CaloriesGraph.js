import React, { useState, useEffect, useContext } from 'react'
import HighchartsReact from 'highcharts-react-official'
import { AppContext } from '../AppContext'

function CaloriesGraph({ nutritionData, displayedCalorieGoal }) {
  const { state } = useContext(AppContext)
  const [graphConfig, setGraphConfig] = useState({
    chart: {
      borderRadius: '10px',
      style: { fontSize: '1.3rem', fontFamily: 'system-ui' },
    },
    title: {
      text: 'Calorie Intake',
      style: { fontSize: '1.5rem', fontWeight: 'bold' },
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%b %e',
      },
    },
    yAxis: {
      title: {
        text: 'Calories Consumed',
      },
      plotLines: [
        {
          color: {
            linearGradient: [0, 0, 100, 300],
            stops: [
              [0, '#ff005f'],
              [1, '#ff0000'],
            ],
          },
          label: {
            text: 'Calorie Goal',
            textAlign: 'center',
            style: { fontSize: '0.6em', color: '#757575' },
          },
          dashStyle: 'longDash',
          value: displayedCalorieGoal,
          width: 2,
        },
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      itemStyle: {
        color: '#757575'
    } 
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 24 * 3600 * 1000, // one day
      },
    },

    series: [
      {
        name: 'Calories Eaten',
        data: nutritionData,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#00aeff'],
            [1, '#3700ff'],
          ],
        },
      },
    ],
    credits: false,
  })
  useEffect(() => {
    setGraphConfig((prevState) => ({
      ...prevState,
      yAxis: {
        ...prevState.yAxis,
        plotLines: [
          {
            ...prevState.yAxis.plotLines,
            color: {
              linearGradient: [0, 0, 100, 300],
              stops: [
                [0, '#ff005f'],
                [1, '#ff0000'],
              ],
            },
            label: {
              text: 'Calorie Goal',
              textAlign: 'center',
              style: { fontSize: '0.6em', color: '#757575' },
            },
            dashStyle: 'longDash',
            value: displayedCalorieGoal,
            width: 2,
          },
        ],
      },
      series: [{ ...prevState.series, data: nutritionData }],
    }))
  }, [nutritionData, displayedCalorieGoal])

  useEffect(() => {
    if (state.darkMode) {
      setGraphConfig((prevState) => ({
        ...prevState,
        chart: { ...prevState.chart, backgroundColor: '#2e333a' },
        title: {
          ...prevState.title,
          style: { color: '#dfdfdf' },
        },
        yAxis: {
          ...prevState.yAxis, title: {...prevState.yAxis.title, style: { color: '#dfdfdf' }},

        },

        series: [{...prevState.series, color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#ff0000'],
            [1, '#e100ff'],
          ],
        }
          
        }]
      }))
    } else {
      setGraphConfig((prevState) => ({
        ...prevState,
        chart: { ...prevState.chart, backgroundColor: '#eff2f5' },
        title: {
          ...prevState.title,
          style: { color: '#515557' },
        },
        yAxis: {
          ...prevState.yAxis, title: {...prevState.yAxis.title, style: { color: '#515557' }}
        },
        series: [{...prevState.series, color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#00aeff'],
            [1, '#3700ff'],
          ],
        }
          
        }]
      }))
    }
  }, [state.darkMode])

  return (
    <div id='calories-graph'>
      <HighchartsReact className='calories-graph' options={graphConfig} />
    </div>
  )
}

export default CaloriesGraph
