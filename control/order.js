const order = require('../Schema/order');

const addorder = async(req, res) =>{
try{
const orders = req.body;
if(!order){
    return res.status(401).json({error :"data not found"});
}
const newOrder = new order(orders);
const savedOrder = await newOrder.save();
res.status(201).send(savedOrder);
}
catch(err){
console.log(err);
    return res.status(500).json({error:"server error"})

}
}
const allorder = async(req, res ) =>{
    try{
      const allorders = await order.find();
      res.send(allorders)
    }
    catch(err){
        res.status(500).send(err);
    }
}

const updateOrder = async (req, res) => {
    const { ids, status } = req.query;
    try {
      const productIds = ids.split(','); // Split the comma-separated string of IDs
      // Update the status of products with the given IDs
      await order.updateMany({ _id: { $in: productIds } }, { shipping : status });
      res.json({ message: `Products with IDs ${ids} updated to status ${status}` });
    } catch (err) {
      res.status(500).send(err);
    }
  };

module.exports = {addorder , allorder , updateOrder};