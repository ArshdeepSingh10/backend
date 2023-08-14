const express = require("express");
const app = express();
const port = 9000;
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const cloudinary = require("cloudinary").v2;

const multer = require('multer');

const path = require("path");

const {createProduct , showallproduct ,deleteProduct , updateProduct} = require("./control/product");

const {adduser , loginuser ,auth} = require("./control/user");
const { addorder ,allorder, updateOrder } = require("./control/order"); 

app.use(cookieParser());
// app.use(cors())
app.use(cors({ credentials: true, origin: 'https://ecommerce-orcin-three.vercel.app' }));
app.use(express.json());

cloudinary.config({ 
    cloud_name: 'dh1bbfjn1', 
    api_key: '654517794976445', 
    api_secret: 'u2TF9pEUPehBG-EBnPVWthnvzE4' 
  });


main().catch((err) => console.log(`unable to connect ${err}`));
async function main(){
    await mongoose.connect('mongodb+srv://arshdeep725199:NCJqFzws2nPLT2HN@cluster0.3tvhxfz.mongodb.net/ecpmmerce?retryWrites=true&w=majority');
    console.log("Database Connected!");
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });
  
  const upload = multer({ storage: storage });
  
  const auths = async (req, res , next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const decoded = jwt.verify(token, "ibdvjbdi");
// console.log(decoded);
        if (!decoded.email) {
            res.status(401).send("Not authorized.");
        } else {
            console.log(decoded.email);
          req.user = { 
                email: decoded.email,
                name:decoded.name
            };
         next();
            // return res.status(200).json(userData);

        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



app.get('/admin/order',  allorder);
app.patch('/admin/order' , updateOrder)
app.get('/checkout',auth)
app.post('/login', loginuser);
// app.get('/account', auths);
app.get('/account',auths,async function(req,res){
    if (req.query.clearToken === 'true') {
        res.clearCookie('token');
        res.status(200).send('Token cookie deleted');
      } else {
        const userData = req.user;
        const {email} = req.user;
        const order = require("./Schema/order");
        const orders = await order.find({email});
        // Access user data from the req object
        res.status(200).json({userData ,orders});
      }
});

app.post("/admin",upload.array("image"), createProduct);

app.get('/:category' , showallproduct);
app.get('/:category/:proid',showallproduct);
app.post('/logins' , adduser);

app.get('/admin/products',  showallproduct);
app.delete('/admin/products', deleteProduct);
app.patch('/admin/products',  updateProduct);


app.post('/checkout', addorder)


app.listen(port, () => {
    console.log(`server started at ${port}`);
})
