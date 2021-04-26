const express = require("express");
const productsRouter = express.Router();
const connection = require("../../db_connect");
const jwt = require("jsonwebtoken");

// fetch the phone color options for the selected phone model (phone color options differ for each phone model)
productsRouter.get("/phone-color-options", async (req, res) => {
  // access query sting parameters in req.query

  // mysql command to fetch data
  // this is fetching the data through the phone model name, and NOT id because the website url query string is tied to the phone model name for readability
  // e.g., "?phone=iPhone-6" is more readable than "?phone=1"
  const [
    rows,
  ] = await connection.execute(
    "SELECT color, hex_color, model_id from phone_model_color JOIN phone_models ON phone_models.id = phone_model_color.model_id WHERE phone_models.model = ?",
    [req.query.phone]
  );

  res.send(rows);
});

// fetch series data for dropdown (series availability differs for each phone model)
productsRouter.get("/select-series-dropdown", async (req, res) => {
  // the NOT IN clause is because you don't want to show the customize series
  const [
    rows,
  ] = await connection.execute(
    "SELECT phone_series.id, series_name_chn FROM phone_series JOIN phone_model_series ON phone_series.id = phone_model_series.series_id JOIN phone_models ON phone_model_series.model_id = phone_models.id WHERE phone_models.model = ? AND phone_series.id NOT IN (16)",
    [req.query.phone]
  );

  res.send(rows);
});

// fetch product data to display on products list page
productsRouter.get("/products-list", async (req, res) => {
  // if no series is selected (series=all), fetch all series
  // the NOT IN clause is because you don't want to show the customize series
  let sql_statement =
    "SELECT phone_series.id AS series_id, series_name_chn, series_name_eng, price, phone_designs.id AS phone_design_id, design_name_chn, design_name_eng, popularity, created_date FROM phone_series JOIN phone_model_series ON phone_series.id = phone_model_series.series_id JOIN phone_models ON phone_model_series.model_id = phone_models.id JOIN phone_designs ON phone_series.id = phone_designs.series_id WHERE phone_models.model = ? AND phone_series.id NOT IN (16)";

  if (req.query.series !== "all") {
    // fetch data for selected series only
    sql_statement += ` AND phone_series.id=${req.query.series}`;
  }

  // add ORDER BY (sort by hot or new)
  if (req.query["sort-by"] === "hot") {
    sql_statement += ` ORDER BY popularity DESC`;
  } else if (req.query["sort-by"] === "new") {
    sql_statement += ` ORDER BY created_date DESC`;
  }

  const [rows] = await connection.execute(sql_statement, [req.query.phone]);

  res.send(rows);
});

// fetch single product data for the products details page
productsRouter.get("/details", async (req, res) => {
  const sql_statement =
    "SELECT series_id, series_name_chn, series_name_eng, price, phone_designs.id AS design_id, design_name_chn, design_name_eng, phone_shells.id AS shell_id, shell_color_chn, shell_color_en FROM phone_designs JOIN phone_series ON phone_series.id = phone_designs.series_id JOIN phone_shells ON shell_color_en = ? WHERE phone_designs.id = ?";

  const [rows] = await connection.execute(sql_statement, [
    req.query.shellColor,
    req.query.id,
  ]);

  res.send(rows);
});

// create jwt to store shopping cart products
productsRouter.post("/create-token", async (req, res) => {
  // productsArr will be storing shopping cart products data
  let productsArr = [];

  // check if oldToken is in req.body
  if (req.body.oldToken) {
    // first take the old token and decode it
    const decodedData = jwt.verify(
      req.body.oldToken,
      "kdmf8g#*Dp04bbc!qp09jf%xoliwuhmi6wf36fk"
    );

    // decodedData.data is an array of the old products! so loop throw that array and put each item inside productsArr
    decodedData.data.forEach((item) => productsArr.push(item));

    // add new data
    productsArr.push(req.body.data);
  } else {
    // no oldToken data, so just store req.body directy in productsArr
    productsArr.push(req.body.data);
  }

  let token = jwt.sign(
    { data: productsArr },
    "kdmf8g#*Dp04bbc!qp09jf%xoliwuhmi6wf36fk"
  );

  // send token
  res.send(token);
});

// decode jwt to get products in shopping cart
productsRouter.post("/decode-token", async (req, res) => {
  try {
    // verify token
    const token = req.body.token;
    const decoded = jwt.verify(
      token,
      "kdmf8g#*Dp04bbc!qp09jf%xoliwuhmi6wf36fk"
    );
    res.send(decoded);
  } catch (err) {
    res.send(err);
  }
});

module.exports = productsRouter;
