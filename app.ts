import { createClient } from "@config/prismic.config";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import * as prismicH from "@prismicio/helpers";

dotenv.config();

const repoName = process.env.PRISMIC_REPO as string;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN as string;

const client = createClient(repoName, accessToken);
const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };
  next();
});

app.get("/", async (req, res) => {
  // get home data from prismic
  res.render("pages/home", {
    meta: {
      data: {
        title: "Creative programming",
        description: "Learning creative coding",
      },
    },
  });
});

app.get("/about", async (req, res) => {
  const data = await client.getSingle("about");
  const meta = await client.getSingle("meta");
  console.log(data.data.body);
  res.render("pages/about", {
    meta,
    about: data,
  });
});

app.get("/collections", (req, res) => {
  res.render("pages/collections", {
    meta: {
      data: {
        title: "Creative programming",
        description: "Learning creative coding",
      },
    },
  });
});

app.get("/details:id", (req, res) => {
  res.render("pages/details", {
    meta: {
      data: {
        title: "Creative programming",
        description: "Learning creative coding",
      },
    },
  });
});
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
