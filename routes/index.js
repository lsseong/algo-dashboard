const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
  res.render('response',{
    title:res
  })
});

router.get('/url',(req,res)=>{
  res.send({ response: req.body.host }).status(200);
});

module.exports = router;
