import React, { useEffect, useState } from 'react';
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core"
import './App.css';
import Infobox from "./Infobox"
// import Map from "./Map"
import Table from "./Table"
import TableCurrent from "./TableCurrent"
import { sortData } from './util';
import Linegraph from "./Linegraph"
import "leaflet/dist/leaflet.css"
import Map from "./Map";
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setcountries] = useState([])
  const [country, setcountry] = useState("worldwide")
  const [countryInfo, setcountryInfo] = useState({})
  const [tableData, settableData] = useState([])
  const [currentcases, setcurrentcases] = useState([])
  const [recovered, setrecovered] = useState([])
  const [deaths, setdeaths] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([])
  const [casesType, setcasesType] = useState("cases")
  // ================ Initial Data for worldwide===============================

  useEffect(() => {
    fetch ("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setcountryInfo(data)
    })
  }, [])

    // ================ Get Country List for dropdown menu and get total cases/ current cases ===============================

  useEffect(() => {
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then(data => {
        const countries = data.map((country) => {
          return {
            name: country.country,
            value: country.countryInfo.iso2
          }
        })
        const totalCaseList = data.map((country) => {
          return {
            name: country.country,
            value: country.cases
          }
        })
        const CurrentCaseList = data.map((country) => {
          return {
            name: country.country,
            value: country.todayCases
          }
        })
        const RecoverList = data.map((country) => {
          return {
            name: country.country,
            value: country.todayRecovered
          }
        })
        const DeathList = data.map((country) => {
          return {
            name: country.country,
            value: country.todayDeaths
          }
        })
        setmapCountries(data)
        const sortedData = sortData (totalCaseList)
        settableData(sortedData)

        const currentDataSorted = sortData(CurrentCaseList)
        setcurrentcases(currentDataSorted)

        const RecoveredData = sortData(RecoverList)
        setrecovered(RecoveredData)

        const TodayDeath = sortData(DeathList)
        setdeaths(TodayDeath)



        setcountries(countries)
      })
    };
    getCountriesData()
  }, [])

  // ================ On selecting the country name from dropdown ===============================

  
  const onCountryChange = async (e) => {
    const countryCode = e.target.value
  
    const url = countryCode ==="worldwide" 
    ? "https://disease.sh/v3/covid-19/all" : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data =>{

      setcountry(countryCode)
      setcountryInfo(data)

//  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });


      if (countryCode === "worldwide"){
        setMapCenter([34.80746, -40.4796]);
        setMapZoom(2);
      }else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

      }
      console.log(data)
      console.log(data)
      console.log(mapCenter)
      // console.log([data.countryInfo.lat, data.countryInfo.long])
    })

  }
  console.log(mapCenter)

  console.log(countryInfo)
  
  return (

    <div className="app">
      <div className="app__main">
      <div className="app__left">

        <div className="app__header">
          
          <h1>Covid-19 Tracker</h1>
          
          <FormControl className="app__dropdown">
            <Select 
            variant = "outlined"
            value = {country}
            onChange = {onCountryChange}
            >
          
              <MenuItem value = "worldwide">Worldwide</MenuItem>
              {countries.map((country, key) =>{
                return <MenuItem key = {key} value = {country.value}>{country.name}</MenuItem>
              })}
          
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Infobox active = {casesType === "cases"} onClick = {e => setcasesType("cases")} title = "Coronavirus cases" total = {countryInfo.cases} cases = {countryInfo.todayCases} />
          <Infobox active = {casesType === "recovered"} isGreen onClick = {e => setcasesType("recovered")} title = "Recovered" total = {countryInfo.recovered} cases = {countryInfo.todayRecovered} />
          <Infobox active = {casesType === "deaths"} onClick = {e => setcasesType("deaths")} title = "Deaths" total = {countryInfo.deaths} cases = {countryInfo.todayDeaths} />
        </div>

        <Map center = {mapCenter} countries = {mapCountries} zoom = {mapZoom} casesType = {casesType}/>
      </div>

      
      <Card className="app__right">
          <CardContent>
            <h3>Live cases by country</h3>
            <Table countries = {tableData} />
            <h3>Worldwide new {casesType}</h3>
            <Linegraph casesType = {casesType}/>
          </CardContent>
      </Card>
      </div>



      <div className="app__tables">
          <div className="app__table__row">
            <h3>Current Cases</h3>
            <TableCurrent countries = {currentcases} />
          </div>
          <div className="app__table__row">
            <h3>Recovered Cases</h3>
            <TableCurrent countries = {recovered} />
          </div>
          <div className="app__table__row">
            <h3>Deaths</h3>
            <TableCurrent countries = {deaths} />
          </div>
      </div>
    </div>
  );
}

export default App;
