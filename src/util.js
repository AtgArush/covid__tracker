import React from "react"
import numeral from "numeral"
import {Circle, Popup} from "react-leaflet"

const casesTypeColors = {
    cases: {
      hex: "#d0312d",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 1200,
    },
    deaths: {
      hex: "#b80f0a",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 2000,
    },
  };

export const sortData = (data) =>{
    const sortedData = [...data]

    sortedData.sort((a,b) => {
        if(a.value > b.value){
            return -1
        }
        else{
            return 1
        }
    })
    return sortedData;
}

export const sortDataCurrent = (data, caseType = "cases") =>{
    const sortedData = [...data]

    sortedData.sort((a,b) => {
        if(a.todayCases > b.todayCases){
            return -1
        }
        else{
            return 1
        }
    })
    return sortedData;
}

export const showDataOnMap = (data, casesType = "cases") => 
    (
        data.map((country) => (
            <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        // Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        radiusCalc(country, casesType)
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
        ))
    )

    const radiusCalc = (country, casesType) => {
    
        if (Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier > 150000){
            return 150000
        }
        else{
            return Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
        }