const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const cartModel = require('./cart');

var date = getDate();

const cartSchema = new Schema({
  product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
  },
  quantity: {
      type: Number
  }
  
});

const orderSchema = new Schema({
    orderNo : {
      type: Number,
      unique: true,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cart: [cartSchema],
    status: {
      type: String, 
      enum: ['accept', 'reject']
    },
    dateOrdered: {type: String, default: date},
    deliveryAddress: { type: String, required: true },
    paymentmethod: { type: String, required: true },
    stage: {
      type: String,
      enum: ['initial', 'preparing', 'prepared', 'pickedup', 'history'],
      default : 'initial'
    }
    // cartTotal: { type: Number, required: true}
});

orderSchema.virtual('cartTotal').get(function (){
  let total = 0;
  for (let c of this.cart){
    total = total + (c.product.price * c.quantity);
  }
  return total;
})

cartSchema.virtual('amt').get(function () {
  let subamt = 0;
  subamt = subamt + (this.product.price * this.quantity);
  return subamt;
})


function getDate(){
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  date = year + "-" + month + "-" + date + " " + hours + ":" + minutes ;
  return date;
}


module.exports = mongoose.model('Order', orderSchema);