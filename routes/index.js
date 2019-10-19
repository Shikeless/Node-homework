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
        destination: function(ctx, file, cb) {
            cb(null, "./public/assets/img/products");
        },
        filename: (ctx, file, cb) => {
            const extension = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${Date.now()}${extension}`);
        }
    }),
    fileFilter: (ctx, file, cb) => {
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
            products: products,
            msgsemail: ctx.flash("msgsemail")[0]
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
        ctx.flash("msgsemail", "Sending was successful");
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
        await ctx.render("pages/login", {
            social: social,
            msglogin: ctx.flash("msglogin")[0]
        });
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
        ctx.flash("msglogin", "Sending was successful");
        await ctx.redirect("/");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

router.get("/admin", async (ctx, next) => {
    try {
        await ctx.render("pages/admin", {
            msgskill: ctx.flash("msgskill")[0],
            msgsfile: ctx.flash("msgsfile")[0]
        });
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
        ctx.flash("msgskill", "Sending was successful");
        await ctx.redirect("/admin");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

const uploader = async (ctx, next) => {
    try {
        await upload.single("photo")(ctx, async ctx2 => {
            await next();
        });
    } catch (err) {
        console.log(err);
    }
};

router.post("/admin/upload", uploader, async (ctx, next) => {
    try {
        await db
            .get("products")
            .push({
                src: ctx.request.file.path,
                name: ctx.request.body.name,
                price: ctx.request.body.price
            })
            .write();
        ctx.flash("msgsfile", "Sending was successful");
        await ctx.redirect("/");
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});

module.exports = router;
