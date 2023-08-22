const express = require("express");
const app = express();
const port = process.env.PORT || 9000
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

app.use(cors({
    origin: "https://ecommerce-orcin-three.vercel.app",
    credentials: true,
}));

app.use(express.json());
// cloudinary.config(process.env.CLOUDINARY_URL);
cloudinary.config({ 
    cloud_name: 'dh1bbfjn1', 
    api_key: '654517794976445', 
    api_secret: 'u2TF9pEUPehBG-EBnPVWthnvzE4',
     secure: true,
  });


main().catch((err) => console.log(`unable to connect ${err}`));
async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
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


// app.get('/admin',function(req, res){
//   try{
//         res.send("jhk");
//   }
//     catch(err)
//   {
//       console.log(err)
//   }
//   })
app.get('/admin/products',  showallproduct);
app.delete('/admin/products', deleteProduct);
app.patch('/admin/products',  updateProduct);
app.post('/admin', createProduct);
app.get('/admin/order',  allorder);
app.patch('/admin/order' , updateOrder)
app.get('/checkout',auth)
app.post('/login', loginuser);
// app.get('/account', auths);
app.get('/account', auths , async function(req,res){
    if (req.query.clearToken ==='true') {
       await res.clearCookie('token',{
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "none",
        expires: new Date(0),
       });
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




app.post('/logins' , adduser);


app.get('/:category' , showallproduct);
app.get('/:category/:proid',showallproduct);

app.post('/checkout', addorder)


app.listen(port, () => {
    console.log(`server started at ${port}`);
})
