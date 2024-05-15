import express from "express";
import { authenticate, register } from "../database";
import { User } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";

interface projectProps {
  title: string;
  imageUrl: string;
}

const projects: projectProps[] = [
  { title: "Lord Of The Rings", imageUrl: "/assets/images/LOTR.png" },
  { title: "Lego", imageUrl: "/assets/images/Lego.jpg" },
  { title: "Pokemon", imageUrl: "/assets/images/Pokemon.png" },
  { title: "Fifa", imageUrl: "/assets/images/Fifa.jpg" },
  { title: "Magic The Gathering", imageUrl: "/assets/images/MTG.jpeg" },
  { title: "Fortnite", imageUrl: "/assets/images/Fortnite.jpeg" },
];

export default function indexRoutes() {
  const router = express.Router();

  router.get("/", (req, res) => {
    let user = req.session.user ?? null;
    res.render("index", { user: user, projects: projects });
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post("/login", async (req, res) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    try {
      let user: User = await authenticate(email, password);
      delete user.password;
      req.session.user = user;
      req.session.message = { type: "success", message: "Login successful" };
      res.redirect("/");
    } catch (e: any) {
      req.session.message = { type: "error", message: e.message };
      res.redirect("/login");
    }
  });

  router.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  router.post("/register", async (req, res) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const confirm: string = req.body.confirm;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format check
    try {
      if (password !== confirm) {
        throw new Error("Passwords do not match");
      }
      let user: User = await register(email, password);
      delete user.password;
      req.session.user = user;
      req.session.message = {
        type: "success",
        message: "Registration successful",
      };
      res.redirect("/");
    } catch (e: any) {
      req.session.message = { type: "error", message: e.message };
      console.log(e.message);
      res.redirect("/register");
    }
  });

  return router;
}
