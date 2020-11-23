const express = require('express')
const https = require('https')
const url_ = require('url')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.all("*", (req, res, next) => {
    console.log(req.method, req.originalUrl, req.body)
    const url = url_.parse(req.originalUrl.substring(1))

    const headers = req.headers
    headers.host = url.host
    const options = {
        ...url,
        headers
    }

    const request = https.request(options, (response) => {
        console.log('statusCode:', response.statusCode)

        response.on('data', d => {
            res.status(response.statusCode).send(d)
        })
    })

    request.on('error', e => {
        console.error(e)
        res.status(500).send(e)
    })

    if (req.body) request.write(JSON.stringify(req.body))
    request.end()
})

app.listen(port, () => {
    console.log(`httptohttps listening at http://localhost:${port}`)
})