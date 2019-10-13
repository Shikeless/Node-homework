var express = require("express");
var router = express.Router();
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const multer = require("multer");
var flash = require("connect-flash");

const upload = multer({
    storage: multer.diskStorage({
        destination: path.resolve(
            process.cwd() + "/public/assets/img/products"
        ),
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            cb(null, file.fieldname + "-" + Date.now() + extension);
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowedFileTypes.includes(file.mimetype)) {
            return cb(new Error("File must be image"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 2097152
    }
});

/* GET home page. */
router.get("/", function(req, res, next) {
    var social = db.get("social").value();
    var skills = db.get("skills").value();
    var products = db.get("products").value();
    res.render("pages/index", {
        social: social,
        skills: skills,
        products: products,
        msgsemail: req.flash("msgsemail")
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
    req.flash("msgsemail", "message sended");
    res.redirect("/");
});

router.get("/login", function(req, res, next) {
    var social = db.get("social").value();
    res.render("pages/login", {
        social: social,
        msglogin: req.flash("msglogin")
    });
});

router.post("/login", function(req, res, next) {
    db.get("users")
        .push({ email: req.body.email, password: req.body.password })
        .write();
    req.flash("msglogin", "you are loged in");
    res.redirect("/");
});

router.get("/admin", function(req, res, next) {
    res.render("pages/admin", {
        msgskill: req.flash("msgskill"),
        msgsfile: req.flash("msgsfile")
    });
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
    req.flash("msgskill", "information has been changed");
    res.redirect("/admin");
});

router.post("/admin/upload", upload.single("photo"), function(req, res, next) {
    const name = req.file.filename;
    db.get("products")
        .push({
            src: `./public/assets/img/products/${name}`,
            name: req.body.name,
            price: req.body.price
        })
        .write();
    req.flash("msgsfile", "new product has been aded");
    res.redirect("/admin");
});

module.exports = router;
