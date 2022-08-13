import { body } from "express-validator";

export const registerSchema = () => {
  return [
    body("fullName").notEmpty().withMessage("Please provide a name"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .notEmpty()
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Password must be between 6 to 25 characters"),
  ];
};

export const loginSchema = () => {
  return [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Please provide a password"),
  ];
};
