const express=require("express");

const app=express();
const PORT=8000;

//routes

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});