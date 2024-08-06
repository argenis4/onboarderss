const express = require('express');
const cors = require('cors');
const downloadRouter = require('./routes/download');
const testRouter = require('./routes/test');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/download', downloadRouter);
app.use('/api/test', testRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});