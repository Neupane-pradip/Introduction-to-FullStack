var express=require('express')
var router=express.Router()

let page_title = "USERS API"

// Home route
router.get('/', (req,res)=>{
  let page_title = "users API"
  res.send(`Welcome to ${page_title}. You can query for user data at the /users and /users/:id endpoints`);
});

module.exports = router;
