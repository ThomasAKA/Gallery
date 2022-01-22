
const multer = require('multer')
const fs = require('fs')
const childProcess = require('child_process')
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./gallery')
    },
    filename : (req,file,cb) => {
        const uniqueSuffix = Math.round(Math.random() * 1E9) 
        cb(null, uniqueSuffix + '.jpg')
    }
})

function createDir(req,res,next){
    const exits = fs.existsSync('/tmp/gallery')
    if(!exits){
       return childProcess.exec('mkdir /tmp/gallery',(err,stdout) => {
            if(err){
                console.log(err)
                apiCodex(res,req.context,err)
            }
            next()
        })
    }
    next()
   
}

const upload = multer({storage:storage})

module.exports = {
    createDir,
    upload
}