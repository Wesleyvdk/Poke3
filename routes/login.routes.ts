import express from "express";

export default function loginRoutes(){
  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("login");
  });

  return router;
}
