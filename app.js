const express = require("express"),
      app= express(),
      mongoose = require("mongoose"),
      bodyparser = require("body-parser"),
      methodOverride = require("method-override");
      
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static('/public'));
app.use(methodOverride("_method"));

///connect mongoose to database
main().catch(err => {console.log(err)});

async function main(){
    await mongoose.connect("mongodb://localhost:27017/blog2");
}
//define pattern/schema of data base
const blog2Schema = new mongoose.Schema({
    image:String,
    name:String,
    age:Number,
    contact:Number,
    location:String,
    about:String
});
//define a model
const blog2 = mongoose.model("blog2", blog2Schema);

// blog2.create({
//     image: "https://randomwordgenerator.com/img/picture-generator/54e5d6454c54ae14f1dc8460962e33791c3ad6e04e50744077297bd69148c4_640.jpg",
//     name:"abdulGaffar",
//     age:20,
//     location:"Maraba, abuja",
//     about:"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
// }, function(err, created){
//   if(err){console.log(err)}
//   else(console.log(created))
// })

//start with the routing
//create
app.get("/", function(req, res){
    res.redirect("/friends");
});
app.get("/friends", function(req,res){
    blog2.find({}, function(err, allfriends){
        if(err){console.log(err)}
        else{
            res.render("index", {friends: allfriends});
        }
    });
});
//new form
app.get("/friends/new", function(req, res){
    res.render("new");
});
//create
app.post("/friends", function(req, res){
    const data = req.body.friend;
    // console.log(data)
    blog2.create(data, function(err, newF){
        if(err){console.log(err)}
        else{
            console.log(newF);
            res.redirect("/friends");
        }
    });
});
//show- info about a particular friend
app.get("/friends/:id", function(req,res){
    blog2.findById(req.params.id, function(err, sFriend){
        if(err){res.redirect("/friends/"+req.params.id)}
        else{
            res.render("show", {friend: sFriend});
        }
    });
});

//edit
app.get("/friends/:id/edit", function(req, res){
    blog2.findById(req.params.id, function(err, sfriend){
        if(err){res.redirect("/friends/"+req.params.id)}
        else{
            res.render("edit", {friend:sfriend});
        }
    });
   
});
//update
app.put("/friends/:id", function(req, res){
    
    blog2.findByIdAndUpdate(req.params.id, req.body.friend, function(err, updated){
        if(err){res.redirect("/friends"+ req.params.id)}
        else{
            res.redirect("/friends/"+req.params.id);
        } 
    });
});
//destroy
app.delete("/friends/:id", function(req, res){
    
    blog2.findByIdAndRemove(req.params.id, function(err){
        if(err){res.redirect("/friends")}
        else{res.redirect("/friends")}
        
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server just started");
});
