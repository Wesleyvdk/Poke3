import express from "express";
import { secureMiddleware } from "../middleware/secureMiddleware";

export default function pokemonGameRoutes() {
  const router = express.Router();

  router.get("/landing", (req, res) => {
    let user = req.session.user!;
    if (!user) {
      res.redirect("/login");
      return;
    }
    res.render("landing");
  });

  router.get("/capture", (req, res) => {
    res.render("capture");
  });

  router.get("/compare", (req, res) => {
    res.render("compare");
  });

  router.get("/pokedex", (req, res) => {
    res.render("pokedex");
  });

  router.get("/quiz", (req, res) => {
    res.render("quiz");
  });

  router.get("/battle", (req, res) => {
    res.render("battle");
  });

  router.get("/starter", (req, res) => {
    res.render("starter");
  });

  return router;
}
