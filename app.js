const express = require('express');
const app = express();
const morgan = require("morgan");
const justifyRoute = require('./routes/justify'); // Assurez-vous que le chemin est correct

app.use(morgan("dev"));
app.use("/", justifyRoute);

const port = 8080;
app.listen(port, () => {
    console.log(`A node js api is listening on port: ${port}`);
});
