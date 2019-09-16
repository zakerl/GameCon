var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Game = require("../models/game")

//root route
router.get("/", function(req, res){
    res.redirect("/gamecon");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to GameCon " + user.username);
           res.redirect("/gamecon"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success', 'You\'ve successfully logged in!');
    res.redirect('/gamecon');
  }
);


// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/gamecon");
});

router.get("/gamecon/results",function(req, res){
  if(req.query.results){
    const regex = new RegExp(escapeRegex(req.query.results), 'gi');
    Game.find({name: regex}, function(err, foundBlogs){
        if(err){
            console.log(err)
        }
        else{
            res.render("./games/index", {games:foundBlogs})
        }
    })
  }
})
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;