const router = require("express").Router();
const User = require("../models/user");
// bcrypt ka use isliy kr rhe h qki mongodb me password dikhai de rha hai to hm usse encrypt krna chahte hai that's why we use it
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//SIGN IN APIs
router.post("/sign-in", async (req, res) => {
  try {
    const { username } = req.body;
    const { email } = req.body;
    const existingUser = await User.findOne({ username: username });
    const existingEmail = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else if (username.length < 4) {
      return res.status(400).json({ message: "Username should have atleast 4 characters" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // password ko encrypt kr diye with the use of bcrypt
    const hashPass = await bcrypt.hash(req.body.password, 10);


    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    await newUser.save();
    return res.status(200).json({ message: "SignIn Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "Internal Server Error"});
  }

});

//LOGIN IN APIs
// isme hm get ka use kr rhe hai qki hme kuch post nhi krna hai bss get krna hai that's why
router.post("/log-in", async(req, res) => {
  const { username , password } = req.body;
  const existingUser = await User.findOne({ username: username }); 
  if (!existingUser) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  // password variable to wo hai jo abhi just dala hai or existingUser.password ka mtlb jo user hai uska password match krega bcrypt.compare se (err, data) err mtlb agr same nhi rha to isme aayega data agr shi mil gya to usske liy
  bcrypt.compare(password, existingUser.password,(err,data)=>{
    if(data){
      // token aise hi generate hota hai yaad kro ye syntax
      const authClaims = ({name:username}, {jti: jwt.sign({}, "tcmTM")});
      const token = jwt.sign({ authClaims },"tcmTM", {expiresIn: "2d"});
      res.status(200).json({id: existingUser._id, token: token});
    }else{
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  })

});


module.exports = router;