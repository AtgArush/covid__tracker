import React, { useState, useEffect } from 'react'
import {Line} from "react-chartjs-2"
import numeral from "numeral"
import "./Linegraph.css"
const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  const buildChartData = (data, casesType) => {
    const chartData = []
    let lastDataPoint

    for (let date in data.cases) {
        if(lastDataPoint){
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}


function Linegraph({casesType = "cases"}) {

    const [data, setdata] = useState({})
    const [color, setcolor] = useState("#CC1034")
    const [bgc, setbgc] = useState("rgba(204, 16, 52, 0.5)")

useEffect(() => {
    const fetchdata = async () => {
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then(response => response.json())
        .then((data) => {
            let chartData = buildChartData(data, casesType)
            setdata(chartData) 

        })
    }
    fetchdata()
}, [casesType])
    
useEffect(() => {
  if (casesType === "cases") {
    setcolor("#CC1034")
    setbgc("rgba(204, 16, 52, 0.5)")
  }
  else if(casesType === "recovered"){
    setcolor("#48da1f")
    setbgc("rgba(72,218,31, 0.5)")
    //72,218,31
  }
  else if(casesType === "deaths"){
    setcolor("#777")
    setbgc("rgba(153,153,153,0.5)")
  }
}, [casesType])

    return (
        <div className = "LINEGRAPH">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: bgc,
                borderColor: color,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
      
    </div>
    )
}

export default Linegraph
