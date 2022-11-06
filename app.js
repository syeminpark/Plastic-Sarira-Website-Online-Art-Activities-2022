const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("",(req,res)=>{
    res.send(index.js);
});

app.listen(PORT, ()=>{
    console.log(`App up at port ${PORT}`)
})