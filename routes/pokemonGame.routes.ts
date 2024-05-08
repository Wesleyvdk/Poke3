import express from "express";

export default function pokemonGameRoutes(){
  const router = express.Router();

  router.get("", (req, res) => {

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
  
  router.get('/starter/:name', (req, res) => {
    const pokemonName = req.params.name;
    console.log(pokemonName);
    res.redirect('/pokemon');
  });

  return router;
}