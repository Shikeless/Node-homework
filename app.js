const Koa = require("koa");
const app = new Koa();
const router = require("./routes");
const serve = require("koa-static");
const koaBody = require("koa-bodyparser");
const Pug = require("koa-pug");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

app.use(
    koaBody({
        enableTypes: ["form", "json"],
        multipart: true
    })
);

const pug = new Pug({
    viewPath: "./views",
    basedir: "./views",
    app: app
});

app.use(serve("./public"));
app.use(router.routes());

app.listen(3000, function() {
    console.log("Server running on https://localhost:3000");
});
