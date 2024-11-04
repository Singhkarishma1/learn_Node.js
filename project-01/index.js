const express=require("express");
const fs=require("fs");
const mongoose=require("mongoose");
const { timeStamp } = require("console");
const app=express();
const PORT=8000;
//connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/youtube-app-1')
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log("Mongo Error",err));

const userSchema=new mongoose.Schema({
first_name:{
    type:String,
    required:true
  },
last_name:{
    type:String
  },
  email:{
    type:String,
    required:true,
    unique :true
  },
  job_title:{
    type:String
  },
  gender:{
    type:String
  },
},{timestamps:true});
const User=mongoose.model("User",userSchema);

//Middleware-plugins
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
   fs.appendFile("logs.txt",
    `${Date.now()} :${req.ip} ${req.method} : ${req.path}\n `,
    (err,data)=>{
    next();
    }
);
});

//routes

app.get("/users", async (req, res) => {
    const allDbUsers = await User.find({});
    const html = `
    <ul>
    ${allDbUsers.map((user) => `<li>${user.first_name} - ${user.email}</li>`)}    
    </ul>
    `;
    res.send(html);
});
// REST API
app.get('/api/users', async (req,res)=>{
    const allDbUsers = await User.find({});
    res.setHeader("myName","Karishma");// custom header
  //always add x to custom header
    return res.json(allDbUsers);
});

app
.route('/api/users/:id')
.get(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        res.json(user);
    }else{
        res.status(404).send("User not found");
    }
})
.patch(async(req,res)=>{
    //TODO: update a user
    await User.findByIdAndUpdate(req.params.id,{last_name:"changed"});
    return res.json({status:"success"});
})
.delete(async(req,res)=>{
    //TODO: delete a user with id
    await User.findByIdAndDelete(req.params.id);
    return res.json({status:"success"});
})
// app.post('/api/users',async(req,res)=>{  
//     const body=req.body;
//     if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
//         return res.status(400).json({status:"Failed",message:"Please provide first_name and last_name"});
//     }
//     const result=await User.create({
//         first_nme:body.first_name,
//         last_name:body.last_name,
//         email:body.email,
//         gender:body.gender,
//         job_title:body.job_title,
//     });
//     console.log(result);
//     return res.status(201).json({msg:"success"});
// });


// POST /api/users route
app.post('/api/users', async (req, res) => {
    const body = req.body;
    
    if (!body || !body.first_name || !body.email) {
        return res.status(400).json({ status: "Failed", message: "Please provide first_name and email" });
    }
    
    try {
        const result = await User.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            gender: body.gender,
            job_title: body.job_title,
        });
      
        return res.status(201).json({ msg: "Success", data: result });
    } catch (error) {
        console.error("Error creating user:", error.message);
        if (error.code === 11000) {
            return res.status(409).json({ status: "Failed", message: "Email already exists" });
        }
        return res.status(500).json({ status: "Failed", message: "Server error" });
    }
});




app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});