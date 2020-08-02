const express = require('express'),
  router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../model/user.js');
const jwt = require("jsonwebtoken");
const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300
// create new user
router.post('/signup', function(req, res) {
  User.findByEmail(req.body.email, function(err, user){
    if (err)
      res.status(500);
    
    if(user.length != 0)
      res.status(400).send({ error:true, message: 'Clinic exists' });
  });
  
  let new_user = new User(req.body);
  bcrypt.hash(new_user.password, 10, function(err, hash){
    if (err)
      res.sendStatus(400);
    
    new_user.password = hash;
    
    User.create(new_user, function(err, user){
      if (err)
        res.sendStatus(400);
      
      res.json(200);  
    })
  });
});

router.post('/login', function(req, res) {
  User.findByEmail(req.body.email, function(err, result){
    if(err){
      res.status(500);
      console.log(err);
    }

    if(result == null || result.length == 0){
      res.status(404);
    }else{
      console.log('2'+result);
      let user = result[0];
      bcrypt.compare(req.body.password, user.password, function(err, same){
        if(err)
          res.status(500);
        
        console.log(req.body.password)
        console.log(user.password)
        if(!same){
          res.status(400).send({error:true, message:'Invalid Credential'});
        }else{
          let email = user.email
          const token = jwt.sign({ email }, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
          })
          res.status(200).json({error: false, token:token});
        }
      })
    }
  })
});

module.exports = router;