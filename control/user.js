const user = require("../Schema/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const auth = async (req, res ) => {
  try {
    const token = req.cookies.token;
console.log(token ,"79");
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized: No token provided.' });
    }

    const decoded = jwt.verify(token, "ibdvjbdi");
  
    if (!decoded.email) {
   
      res.status(401).send("Not authorized.");
     

      
    } else {
      console.log(decoded.email);
      const userData = {
        email: decoded.email
    }
    return res.status(200).json(userData);
  
  } 
}
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
const adduser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
      }
  
      const token = jwt.sign({ email }, "ibdvjbdi");
      const hashpassword = await bcrypt.hash(password, 10);
  
      const newUser = new user({
        name,
        email,
        password: hashpassword,
        token,
      });
  
      const saveduser = await newUser.save();
      res.status(201).json({ message: "User registration successful!", user: saveduser });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


const loginuser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const finduser = await user.findOne({ email });
      console.log(finduser);
      if (!finduser) {
        return res.status(404).json({ error: "User not found." });
      }
      const findpassword = await bcrypt.compare(password, finduser.password);
      if (!findpassword) {
        return res.status(401).json({ error: "Invalid password." });
      }
      const payload = {
        name:finduser.name,
        email:finduser.email
      }
      
      const token = jwt.sign(payload, "ibdvjbdi");
      res.cookie('token', token, {
        expires: new Date(Date.now() + (3600 * 1000)),
        secure:true,
        httpOnly: true,
        
        
      });
      
      res.status(200).json({ message: "Login successful!", token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "An error occurred while logging in." });
    }
  };
    module.exports = { adduser , loginuser  ,auth};
