var express = require('express')
var bp=require('body-parser')
const configure= require('./configure')
var interceptor = require('./middleware.js')
const router= express.Router()
const jwt= require('jsonwebtoken')

const app= express()
var _ = require('underscore')
app.use(bp.json())


app.use(interceptor.authUser)

var userdata=[]
var uid=1

app.use(express.static('public'))

app.get('/loadusers',(req,res)=>{
    const data= req.body
    const user={
        "email":data.email,
        "name":data.name
    }
    const token=jwt.sign(user,configure.secret,{expiresIn:configure.tokenlife})
    const response={
        "status" :"Logged In",
        "token": token
    }
    res.status(200).json(response)
})



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

router.get('/',(req,res)=>{
    res.send('OK')
})

router.use(require('./token'))
router.get('/secure',(req,res)=>{
    res.send('I am Secured...')
})

app.use('/api',router)
app.listen(4000,()=>{
console.log('server is ready');

})
