import express from "express";
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("this is a sample page");
});

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
