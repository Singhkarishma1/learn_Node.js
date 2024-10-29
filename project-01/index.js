const express=require("express");
const fs=require("fs");
const users=require("./MOCK_DATA.json");
const app=express();
const PORT=3000;

//Middleware-plugins
app.use(express.urlencoded({extended:false}));

//routes

app.get("/users",(req,res)=>{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`)}    
    </ul>
    `;
    res.send(html);
});
// REST API
app.get('/api/users',(req,res)=>{
    res.json(users);
});

app.get('/api/users/:id',(req,res)=>{

    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    if(user){
        res.json(user);
    }else{
        res.status(404).send("User not found");
    }
});

app.post('/api/users',(req,res)=>{
    //TODO: create a new user
    const body=req.body;
    // console.log("Body",body);
    users.push({...body,id:users.length});
    fs.writeFileSync("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
      return res.json({status:"Success"});  
    });

  
});

// app.patch('/api/users/:id',(req,res)=>{ 
//     //TODO: update a user
//     return res.json({status:"pending"});
// });

// app.delete('/api/users/:id',(req,res)=>{
//     //TODO: delete a user with id
//     return res.json({status:"pending"});
// });
app.route('/api/users/:id')
.get((req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    if(user){
        res.json(user);
    }else{
        res.status(404).send("User not found");
    }
})
.patch((req,res)=>{
    //TODO: update a user
    return res.json({status:"pending"});
})
.delete((req,res)=>{
    //TODO: delete a user with id
    return res.json({status:"pending"});
})


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});