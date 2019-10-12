var express = require("express");
var router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
var multer = require("multer");
var upload = multer({ dest: "public/assets/img/products" });

/* GET home page. */
router.get("/", function(req, res, next) {
    var social = db.get("social").value();
    var skills = db.get("skills").value();
    var products = db.get("products").value();
    res.render("pages/index", {
        social: social,
        skills: skills,
        products: products
    });
});

router.post("/", function(req, res, next) {
    db.get("contacts")
        .push({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        })
        .write();
});

router.get("/login", function(req, res, next) {
    var data = db.get("renderData").value();
    res.render("pages/login", data);
});

router.post("/login", function(req, res, next) {
    db.get("users")
        .push({ email: req.body.email, password: req.body.password })
        .write();
});

router.get("/admin", function(req, res, next) {
    var data = db.get("renderData").value();
    res.render("pages/admin", data);
});

router.post("/admin/skills", function(req, res, next) {
    if (req.body.age !== "") {
        db.get("skills")
            .find({ id: 1 })
            .assign({ number: Number(req.body.age) })
            .write();
    }
    if (req.body.concerts !== "") {
        db.get("skills")
            .find({ id: 2 })
            .assign({ number: Number(req.body.concerts) })
            .write();
    }
    if (req.body.cities !== "") {
        db.get("skills")
            .find({ id: 3 })
            .assign({ number: Number(req.body.cities) })
            .write();
    }
    if (req.body.years !== "") {
        db.get("skills")
            .find({ id: 4 })
            .assign({ number: Number(req.body.years) })
            .write();
    }
});

router.post("/admin/upload", upload.single("photo"), function(req, res, next) {
    res.send(req.body.photo);
});

module.exports = router;
