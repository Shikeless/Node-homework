var express = require("express");
var router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

/* GET home page. */
router.get("/", function(req, res, next) {
    console.log(db.get("skills").values());
    next();
});

router.get("/", function(req, res, next) {
    res.render("pages/index");
});

router.get("/login", function(req, res, next) {
    res.render("pages/login");
});

module.exports = router;
