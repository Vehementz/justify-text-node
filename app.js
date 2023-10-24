const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.send("Hello world from js")
})

const port  = 8080
app.listen(port, () => {console.log(` A node js api listen to that port`)});
