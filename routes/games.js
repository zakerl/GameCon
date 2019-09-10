var express = require("express");
var router  = express.Router();
var Game = require("../models/game");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Game.find({}, function(err, allGames){
       if(err){
           console.log(err);
       } else {
          res.render("games/index",{games:allGames});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Game.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/gamecon");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("games/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Game.findById(req.params.id).populate("comments").exec(function(err, foundGame){
        if(err){
            console.log(err);
        } else {
            console.log(foundGame)
            //render show template with that campground
            res.render("games/show", {game: foundGame});
        }
    });
});

// EDIT GAME ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Game.findById(req.params.id, function(err, foundGame){
        res.render("games/edit", {game: foundGame});
    });
});

// UPDATE GAME ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Game.findByIdAndUpdate(req.params.id, req.body.game, function(err, updatedGame){
       if(err){
           res.redirect("/gamecon");
       } else {
           //redirect somewhere(show page)
           res.redirect("/gamecon/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Game.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/gamecon");
      } else {
          res.redirect("/gamecon");
      }
   });
});


module.exports = router;

