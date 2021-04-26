const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyparser = require("body-parser");
const port = 3310;

// connect to express app
const app = express();

// used to parse JSON bodies
app.use(express.json());

// configure CORS to enable all CORS requests
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "Auth",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

/* router for Member */
const memberRouter = require("./routes/members/memberRouter");
app.use("/member", memberRouter);

// router for general products
const productsRouter = require("./routes/products/productsRouter");
app.use("/products", productsRouter);

// router for customized products
const customizeRouter = require("./routes/products/customizeRouter");
app.use("/customize", customizeRouter);

//router for ordersRouter
const ordersRouter = require("./routes/orders/ordersRouters");
app.use("/orders", ordersRouter);

// router for socialRouter
const socialRouter = require("./routes/social/socialRouter");
app.use("/social", socialRouter);

// router for gameRouter
const gameRouter = require("./routes/games/gameRouter");
app.use("/games", gameRouter);

// start listening
app.listen(port, () => {
  console.log(`listening at http://localhost:${port} ...`);
});
