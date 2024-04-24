import express from "express";

export default function registerRoutes(){
  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("register");
  });

  return router;
}