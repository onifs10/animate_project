import express from "express";
import path from "path";
const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("pages/home", {
    meta: {
      data: {
        title: "Creative programming",
        description: "Learning creative coding",
      },
    },
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about", {
    meta: {
      data: {
        title: "Creative programming",
        description: "Learning creative coding",
      },
    },
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
