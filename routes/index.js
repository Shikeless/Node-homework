var express = require("express");
var router = express.Router();
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const multer = require("multer");
// const upload = multer({ dest: "public/assets/img/products" });

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
    const file = req.body.photo;
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    console.log("req.body.photo", req.body.photo);
    res.send(file);
});

module.exports = router;
