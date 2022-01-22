const express = require('express')
const app = express()
const cors  = require('cors')
const FormData = require('form-data')
const {upload} = require('./utils')
const fs = require('fs')
const axios = require('axios')
const { Photo } = require('./db')
const { json } = require('express')
const  Picture = new Photo()

app.use(cors())

app.post('/photos',upload.single('file'),(req,res) => {
    console.log(req.file.filename)
    const formData = new FormData()
    const file = fs.createReadStream(`/tmp/${req.file.filename}`)
    formData.append('file',file)
    formData.append('UPLOADCARE_PUB_KEY','70fe9c19bb0482485ef8')
    axios.post(`https://upload.uploadcare.com/base/`,formData,{
        headers:  {
            ...formData.getHeaders()
        }
    }).then(response => {
        if(response.status !== 200){
            return res.json({status:200,message: 'Internal Server Error'})
        }
        Picture.id = response.data.file,
        Picture.url = 'https://ucarecdn.com/' + response.data.file + '/' + req.file.filename,
        Picture.status =  'A'
        
        Picture.save().then(result => {
            return res.json({
                status:200,
                message:'file uploaded',
                data : result
            })
        }).catch(err => {console.log(err);res.json({status:500,message: 'Internal Server Error'})} )
      
        
    }).catch(err => {console.log(err);res.json({status:500,message: 'Internal Server Error'})})
})


app.get('/photos',(req,res) => {
     Photo.find({},(err,data) => {
        if(err){
            return res.json({
                status:500,
                message: 'Internal Server Error',
            }) 
        }
        console.log(data)
        return res.json({
            status:200,
            message: 'success',
            data
        })
     })
})

app.delete('/photos/:id',(req,res) => {
    const payload = {
        id:req.params.id
    }
    Photo.deleteOne(payload,(err,data) => {
       if(err){
           return res.json({
               status:500,
               message: 'Internal Server Error',
           }) 
       }
       return res.json({
           status:200,
           message: 'success',
       })
    })
})


app.listen(3005,() => console.log('App is running on port 3005'))