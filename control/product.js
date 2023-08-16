const products = require("../Schema/Schema");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const folder = "ecommers";
      cloudinary.v2.uploader.upload(file.path , { folder: folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      });
    });
  };



const createProduct = async (req ,res) => {
    try{
        const prd = req.body;
        console.log(prd);
if(!prd){
    return res.status(400).send("details of product are required !");

}
if (!req.files || req.files.length === 0) {
  console.log('as');
    return res.status(400).send("Image file is required!");
  }

  const imageUrls = await Promise.all(
    req.files.map((file) => uploadImageToCloudinary(file))
  );

  const product = new products({
    ...prd,
    image: imageUrls,
  });

const savedProduct = await product.save()
res.status(201).send(savedProduct);

    } catch(err){
        res.status(500).send(err);
    }
}

const showallproduct = async(req, res) =>{
    try{
    
        const allProducts = await products.find();
        console.log(allProducts);
        res.send(allProducts);
    }
    catch(err){
        res.status(500).send(err);
    }
}
const updateProduct = async (req, res) => {
  const { ids, status } = req.query;
  try {
    const productIds = ids.split(','); // Split the comma-separated string of IDs
    // Update the status of products with the given IDs
    await products.updateMany({ _id: { $in: productIds } }, { status: status });
    res.json({ message: `Products with IDs ${ids} updated to status ${status}` });
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteProduct = async (req, res) => {
 
  const { ids } = req.query;
  try {
    const productIds = ids.split(','); // Split the comma-separated string of IDs
    // Delete the products with the given IDs
    await products.deleteMany({ _id: { $in: productIds } });
    res.json({ message: `Products with IDs ${ids} deleted successfully` });
  } catch (err) {
    res.status(500).send(err);
  }
};




module.exports = { createProduct, showallproduct, updateProduct, deleteProduct };
