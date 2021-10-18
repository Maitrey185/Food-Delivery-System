const mongoose = require('mongoose');

var date = getDate();

const imagesSchema = new mongoose.Schema({
  url: String,
  filename: String
});

imagesSchema.virtual('thumbnail').get(function () {
return this.url.replace('/upload','/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    avgRating: {type: Number, default: 0 },
    reviews: {type: Array},
    date: {type: String, default: date},
    category: { 
      type: String,
      enum: ['Starter', 'Main Course', 'Soup', 'Dessert'], 
      required: true 
    },
    description: {type: String, required: true},
    availability: {
      type: String,
      enum: ['available', 'unavailable']
    },
    image: imagesSchema,
    kind: {
      type: String,
      enum: ['veg', 'non-veg']
    }
});

function getDate(){
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  date= year + "-" + month + "-" + date + " " + hours + ":" + minutes ;
  return date;
}

module.exports = mongoose.model('Product', productSchema);