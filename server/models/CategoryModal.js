const mongoose = require('mongoose')
const schema = mongoose.Schema;

const CategorySchema = new schema({
    title:{
        type : String,
        required :true
    },
    
})

const Category = mongoose.model("categories",CategorySchema);
module.exports = Category;