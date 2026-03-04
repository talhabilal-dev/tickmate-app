import express, { Router } from "express";
import {
  signup,
  verify
  // login,
  // logout,
  // updateSkills,
  // getUser,
  // updateUser,
  // changePassword,
} from "../controllers/user.controller.js";
// import { verifyAuthToken } from "../middlewares/auth.middleware.js";

const router: Router = express.Router();

router.post("/register", signup);
router.post("/verify", verify);
// router.post("/login", login);
// router.post("/logout", verifyAuthToken, logout);
// router.put("/update-skills", verifyAuthToken, updateSkills);
// router.put("/update", verifyAuthToken, updateUser);
// router.put("/update-password", verifyAuthToken, changePassword);
// router.get("/user", verifyAuthToken, getUser);

export default router;
