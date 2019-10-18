const Router = require("koa-router");
const router = new Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const multer = require("@koa/multer");
const path = require("path");

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "./public/assets/img/products");
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${Date.now()}${extension}`);
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

router.get("/", async (ctx, next) => {
    try {
        var social = db.get("social").value();
        var skills = db.get("skills").value();
        var products = db.get("products").value();
        await ctx.render("pages/index", {
            social: social,
            skills: skills,
            products: products
        });
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

router.post("/", async (ctx, next) => {
    try {
        await db
            .get("contacts")
            .push({
                name: ctx.request.body.name,
                email: ctx.request.body.email,
                message: ctx.request.body.message
            })
            .write();
        await ctx.redirect("/");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

router.get("/login", async (ctx, next) => {
    try {
        var social = db.get("social").value();
        await ctx.render("pages/login", { social: social });
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

router.post("/login", async (ctx, next) => {
    try {
        await db
            .get("users")
            .push({
                email: ctx.request.body.email,
                password: ctx.request.body.password
            })
            .write();
        await ctx.redirect("/");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

router.get("/admin", async (ctx, next) => {
    try {
        await ctx.render("pages/admin");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

router.post("/admin/skills", async (ctx, next) => {
    try {
        if (ctx.request.body.age !== "") {
            await db
                .get("skills")
                .find({ id: 1 })
                .assign({ number: Number(ctx.request.body.age) })
                .write();
        }
        if (ctx.request.body.concerts !== "") {
            await db
                .get("skills")
                .find({ id: 2 })
                .assign({ number: Number(ctx.request.body.concerts) })
                .write();
        }
        if (ctx.request.body.cities !== "") {
            await db
                .get("skills")
                .find({ id: 3 })
                .assign({ number: Number(ctx.request.body.cities) })
                .write();
        }
        if (ctx.request.body.years !== "") {
            await db
                .get("skills")
                .find({ id: 4 })
                .assign({ number: Number(ctx.request.body.years) })
                .write();
        }
        await ctx.redirect("/admin");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

const uploader = async (ctx, next) => {
    try {
        console.log(upload);
        await upload.single("photo")(ctx, async ctx2 => {
            await next();
        });
    } catch (err) {
        console.log(err);
    }
};

router.post("/admin/upload", uploader, async (ctx, next) => {
    try {
        await ctx.redirect("/");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

module.exports = router;
