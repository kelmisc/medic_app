module.exports = {
    validateRegister: (req, res, next) => {
      // username min length 3
      if (!req.body.email) {
        return res.status(400).send({
          msg: 'Please enter email'
        });
      }

      if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))
      {
        return res.status(400).send({
            msg: 'Invalid email'
        });
      }

      // password min 6 chars
      if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 6 chars'
        });
      }
      // password (repeat) does not match
      if (
        !req.body.password_repeat ||
        req.body.password != req.body.password_repeat
      ) {
        return res.status(400).send({
          msg: 'Both passwords must match'
        });
      }
      next();
    }
  };