const User = require('../models/user.model');
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 

//create a user
exports.createUser = async(req,res)=>{
    const {name,email,password,role} = req.body;
    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: "Please Input Name, Email and Password" });
        }

    const existingUser = await User.findOne({ where : {email:email} });
    if (existingUser) {
        return res.status(400).json({ message: "User Already Exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        name,
        email,
        password: hashedPassword
    };
    if(role) newUser.role = role;

    await User.create(newUser)
        .then(result => {
          res.status(201).json({
            message: 'User created successfully!'
          });
        })
        .catch(err => {
            res.status(400).json({ message: err.message });
        });
}

//List all users
exports.getAllUsers = async(req, res) => {
    await User.findAll({attributes:{exclude: ['password']}})
        .then(users => {
            res.status(200).json({ users: users });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};


//update user's details
exports.updateUser = async(req, res) => {
    const user_id = req.params.id;
    const newUserDetails = {};
    if(req.body.name) newUserDetails.name = req.body.name;
    if(req.body.email) newUserDetails.email = req.body.email;
    if(req.body.password) 
        {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            newUserDetails.password = hashedPassword;
        }
  
    await User.findByPk(user_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'user not found!' });
        }
        user.update(newUserDetails)
        .then(result => {
          delete user.dataValues.password;
          res.status(200).json({message: 'user updated!'});
        })
        .catch(err => {
          res.status(500).json({ message: err.message });
        })
      })
}


//Delete a user
exports.deleteUser = async(req, res) => {
    const user_id = req.params.id;
    await User.findByPk(user_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found!' });
        }
        user.destroy()
        .then(result => {
          res.status(200).json({ message: 'User deleted!' });
        })
        .catch(err => {
          res.status(500).json({ message: err.message });
        })
    });
}
  

//signIn 

exports.signIn = async(req,res)=>{
  try {
      const { email, password } = req.body;
  
      // Check If The Input Fields are Valid
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please Input Email and Password" });
      }
  
      // Check If User Exists In The Database
      await User.findOne({where:{ email:email }})
      .then( user =>{
          if (!user) {
            return res.status(401).json({ message: "Invalid Email or password" });
          }
      
          // Compare Passwords
          const passwordMatch = bcrypt.compare(password, user.dataValues.password);
      
          if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Email or password" });
          }
          // Generate JWT Token
          const accessToken = jwt.sign(
            { userId: user.dataValues.id, email: user.dataValues.email, role: user.dataValues.role},
            process.env.ACCESS_TOKEN_SECRET || "1234!@#%<{*&)",
            { expiresIn: "1h" }
          );
    
          const refreshToken = jwt.sign({
              email: user.dataValues.email,
          }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    
          // Assigning refresh token in http-only cookie 
          res.cookie('jwt', refreshToken, {
              httpOnly: true,
              sameSite: 'None', secure: true,
              maxAge: 24 * 60 * 60 * 1000
          });
      
          return res
            .status(200)
            .json({ message: "Login Successful", 
                  access_token: accessToken , 
                  refresh_token: refreshToken });
                  
                })
                
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error during login" });
      }
}

//refresh token
exports.refreshToken = async(req,res) => {
  if (req.body.refresh_token) {

      // Destructuring refreshToken from cookie
      const refreshToken = req.body.refresh_token;


      // Verifying refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
              if (err) {

                  // Wrong Refesh Token
                  return res.status(406).json({ message: 'Unauthorized' });
              }
              else {
                  // Correct token we send a new access token
                  const accessToken = jwt.sign(
                  {user: decoded.user},
                  process.env.ACCESS_TOKEN_SECRET || "1234!@#%<{*&)",
                  { expiresIn: "1h" }
                  );
                  
                  return res.json({ message: "Access Token Changed Successfully", 
                                  access_token: accessToken , 
                                  refresh_token: refreshToken  });
              }
          })
  } else {
      return res.status(406).json({ message: 'Unauthorized' });
  }
}
