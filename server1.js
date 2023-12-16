var express = require('express')
var bp=require('body-parser')
var app = express()
var interceptor = require('./middleware.js')

var _ = require('underscore')
app.use(bp.json())

/*var interceptor={
    logger: function(req, res,next){
        console.log(`Request ${new Date().toString()} for ${req.method} ${req.originalUrl}`);
        next()
    },
    authUser:function(req, res,next){
        console.log('private route hit');
        next()
    }
}*/
app.use(interceptor.authUser)

var userdata=[]
var uid=1

app.use(express.static('public'))

app.get('/loadusers',interceptor.logger,(req,res)=>{
    res.send(userdata);
})
//A JWT Interceptor intercepts HTTP requests from an application to add a JWT auth token to the HTTP Authorization header. 
//A JWT (JSON Web Token) is a tool for protecting API endpoints. 


app.delete('/deleteuser/:id',(req,res)=>{
    var uid=parseInt(req.params.id)
    var mtd=_.findWhere(userdata,{id:uid})
    if(mtd){
        userdata=_.without(userdata,mtd)
        res.send(mtd)
    }
})

app.put('/update')

app.get('/loaduser/:id',(req,res)=>{
    var uid=parseInt(req.params.id)
    // var mtd;
    var mtd=_.findWhere(userdata,{id:uid})
    // userdata.forEach(function(todo){
    //     if(uid == todo.id){
    //     mtd=todo
    //     }
    // })
    if(mtd){
        res.send(mtd)
    }
})

app.post('/adduser',(req,res)=>{
    var data=req.body
    data.id=uid++
    userdata.push(data)
    res.send('user added....')
})

app.listen(4000,()=>{
    console.log('server is ready....');
})