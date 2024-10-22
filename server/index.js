const http = require("http");

const fs = require("fs");

const myServer = http.createServer((req,res)=>{
    // console.log("New Req Rec.");
    // console.log(req);
    const log=`${Date.now()}:New req received\n`;
    fs.appendFile("log.txt",log,(err,data)=>{
    res.end("Hello from server ");
   });
});


myServer.listen(3000,()=>console.log("Server is running on port 8000")); //port number should be greater than 3000  
