const http = require("http");

const fs = require("fs");
const url=require("url");
const express = require("express");

const app=express();

app.get("/",(req,res)=>{
    return res.end("Hello from  Home Page");
});
app.get("/about",(req,res)=>{
    return res.end("Hello from  About Page");
});
function myHandler(req,res){
    if(req.url==="/favicon.ico")return res.end();
    const log=`${Date.now()}:${req.method} ${req.url}New req received\n`;
    // fs.appendFile("log.txt",log,(err,data)=>{
    // res.end("Hello from server ");
    const myUrl=url.parse(req.url,true);
    fs.appendFile("log.txt",log,(err,data)=>{
switch(myUrl.pathname){
    case "/" :   
            res.end("HomePage");
            break;
            case "/about":
                const username=myUrl.query.myname;
                res.end(`hi,${username}`);
           
                break;
            case "/search":
               
                    const search=myUrl.query.search_query;
                    res.end(`search result for ${search}`);
                
                break;
                case "/signup":
                    if(req.method==="GET")res.end("signup page");
                    else if(req.method==="POST")
                        {
                            res.end("success");
               
                        }
                         default:
                    res.end("404 page not found");
                    break;
                
                }
    });
}

const myServer = http.createServer(app);



myServer.listen(8000,()=>console.log("Server is running on port 8000")); //port number should be greater than 3000  
