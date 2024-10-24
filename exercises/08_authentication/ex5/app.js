var express=require('express')
var path=require('path')
var indexRouter=require('./routes/index')
var usersRouter=require('./routes/users')
var app=express()

app.use(express.urlencoded({extended:false}));

// Routes
app.use('/', indexRouter);
app.use("/users", usersRouter);

app.listen(3000);

function log(error="")
{
    return 0;
    console.log(`Oops! Something went wrong: ${error}`);
}

module.exports = app;
