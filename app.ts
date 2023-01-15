import { createClient } from "@config/prismic.config";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import * as prismicH from "@prismicio/helpers";
import erroHandler from "errorhandler";
import logger from "morgan";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { Client } from "@prismicio/client";

dotenv.config();

const repoName = process.env.PRISMIC_REPO as string;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN as string;

const client = createClient(repoName, accessToken);
const PORT = process.env.PORT || 3000;
const app = express();

const handleDefaults = async (api: Client) => {
  const preloader = await api.getSingle("preloader");
  const meta = await api.getSingle("meta");
  const navigation = await api.getSingle("navigation");
  return {
    meta,
    navigation,
    preloader,
  };
};

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
  res.locals.Link = prismicH.asLink;
  next();
});
app.get("/", async (req, res) => {
  // get home data from prismic
  const home = await client.getSingle("home");
  const collections = await client.getAllByType("collection");
  const defaults = await handleDefaults(client);
  res.render("pages/home", {
    collections,
    home,
    ...defaults,
  });
});

app.get("/about", async (req, res) => {
  const about = await client.getSingle("about");
  const defaults = await handleDefaults(client);
  res.render("pages/about", {
    about,
    ...defaults,
  });
});

app.get("/collections", async (req, res) => {
  const home = await client.getSingle("home");
  const collections = await client.getAllByType("collection", {
    fetchLinks: "detail.image",
  });
  const defaults = await handleDefaults(client);
  res.render("pages/collections", {
    collections,
    home,
    ...defaults,
  });
});

app.get("/details/:id", async (req, res) => {
  const product = await client.getByUID("detail", req.params.id, {
    fetchLinks: "collection.title",
  });
  const defaults = await handleDefaults(client);
  res.render("pages/detail", {
    product,
    ...defaults,
  });
});
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
