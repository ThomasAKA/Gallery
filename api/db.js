const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gallery',(err) => {
    if(err) console.log(err)
    console.log('connected')
});

const Photo = mongoose.model('Photo',{
    id: String,
    url:String,
    status:String
})



module.exports = {
    Photo
}

