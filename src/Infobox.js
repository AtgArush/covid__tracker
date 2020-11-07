import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import "./Infobox.css"
import numeral from "numeral"

function Infobox({isGreen, title,active, cases, total, ...props}) {
    return (
        <Card className = {`infobox ${active && "info--active"}`}
        onClick = {props.onClick}
        >
            {/* {numeral(country.value).format("0,0")} */}
            <CardContent>
                <Typography color = "textSecondary" className = "infobox__title">
                    {title}
                </Typography>
                <h2 className={`infobox__cases ${isGreen && "info--recovered"}`}>
                    {`+${numeral(cases).format("0,0")}`}
                </h2>
                <Typography className = "infobox__total" color = "textSecondary">
                    {numeral(total).format("0,0")} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
