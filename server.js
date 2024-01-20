const express = require('express')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 5050

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/data', (req, res) => {
    const resultData = require('./bin/dependenciesList.json')
    res.json(resultData)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})