import { createClient } from "@config/prismic.config";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import * as prismicH from "@prismicio/helpers";
import erroHandler from "errorhandler";
import logger from "morgan";
import bodyParser from "body-parser";
import methodOverride from "method-override";

dotenv.config();

const repoName = process.env.PRISMIC_REPO as string;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN as string;

const client = createClient(repoName, accessToken);
const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(erroHandler());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
// app.use(logger("dev"));
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
    NumbersH: {
      indexMap: (num: number): string => {
        return num == 0 ? "One" : "Two";
      },
    },
  };
  next();
});

app.get("/", async (req, res) => {
  // get home data from prismic
  const preloader = await client.getSingle("preloader");
  const home = await client.getSingle("home");
  const meta = await client.getSingle("meta");
  const collections = await client.getAllByType("collection");
  res.render("pages/home", {
    meta,
    collections,
    home,
    preloader,
  });
});

app.get("/about", async (req, res) => {
  const about = await client.getSingle("about");
  const preloader = await client.getSingle("preloader");
  const meta = await client.getSingle("meta");
  res.render("pages/about", {
    meta,
    about,
    preloader,
  });
});

app.get("/collections", async (req, res) => {
  const preloader = await client.getSingle("preloader");
  const meta = await client.getSingle("meta");
  const home = await client.getSingle("home");
  const collections = await client.getAllByType("collection", {
    fetchLinks: "detail.image",
  });
  res.render("pages/collections", {
    meta,
    collections,
    home,
    preloader,
  });
});

app.get("/details/:id", async (req, res) => {
  const preloader = await client.getSingle("preloader");
  const product = await client.getByUID("detail", req.params.id, {
    fetchLinks: "collection.title",
  });
  const meta = await client.getSingle("meta");
  // console.log(product, product.data.informations);
  res.render("pages/detail", {
    meta,
    product,
    preloader,
  });
});
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
