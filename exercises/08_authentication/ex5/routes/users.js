var express=require('express')
var router=express.Router()

page_title="Users endpoint"
the_users_list=[{id:1,name:"Matti Meikäläinen",address:
{street: "Katu 1",city: "Helsinki",postalCode: "00100"},
email: "matti.meikalainen@example.com"},
{id:2,name:"Liisa Virtanen",address:
{street: "Tie 2",city: "Espoo",postalCode: "02100"},
email: "liisa.virtanen@example.com"},
{id:3,name:"Pekka Peloton",address:
{street: "Polku 3",city: "Tampere",postalCode: "33100"},
email: "pekka.peloton@example.com"}]

// Users route
router.get('/', (req,res)=>{
    res.send(the_users_list);
});

router.get('/:id',  (req,res)=>{
    //if path is /users/3, then req.params.id should be 3, right? But what type?
    res.send(the_users_list.find(user=>user.id==req.params.id));
});

module.exports = router;
