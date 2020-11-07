import React from 'react'
import "./table.css"
import numeral from "numeral"
function Table({countries}) {
    return (
        <div className = "table">
            {countries.map(country => {
                if (country.value !== 0) {
                    return(
                        <tr>
                            <td>{country.name}</td>
                            <td>{numeral(country.value).format("0,0")}</td>
                        </tr>
                    )
                } else{
                    return (
                        <tr>
                            <td>{country.name}</td>
                            <td>No new cases</td>
                        </tr>
                    )
                }
            })}
        </div>
    )
}

export default Table
