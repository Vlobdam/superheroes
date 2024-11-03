const express = require('express');
const cors = require('cors');

const heroRouter = require('./routes/heroesRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use("*", cors());
app.use('/heroes', heroRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})