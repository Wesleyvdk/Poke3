import express from "express";

interface projectProps {
  title: string;
  imageUrl: string;
}

const projects: projectProps[] = [
  { title: 'Lord Of The Rings', imageUrl: '/assets/images/LOTR.png' },
  { title: 'Lego', imageUrl: '/assets/images/Lego.jpg' },
  { title: 'Pokemon', imageUrl: '/assets/images/Pokemon.png'},
  { title: 'Fifa', imageUrl: '/assets/images/Fifa.jpg'},
  { title: 'Magic The Gathering', imageUrl: '/assets/images/MTG.jpeg'},
  { title: 'Fortnite', imageUrl: '/assets/images/Fortnite.jpeg'},
];

export default function indexRoutes(){
  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("index", {projects: projects});
  });
  
  router.get("/login", (req, res) => {
    res.render("login");
  });
  
  router.get("/register", (req, res) => {
    res.render("register");
  });

  return router;
}