import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser, findUser } from "../services";
import { generateJWT, Password, successResponse } from "../helpers";
import { BadRequestError } from "../errors";
import Logger from "../logger";

// @desc    Login Users
// @route   POST    /api/v1/auth/signin
export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUser(email);

  // if (!user) throw new BadRequestError("Invalid credentials");

  // const passwordMatch = await Password.comparePassword(
  //   password,
  //   user?.password!
  // );

  // if (!passwordMatch) throw new BadRequestError("Invalid credentials");

  // // After providing valid credentials
  // // Generate the JWT and attach it to the req session object
  // generateJWT(req, {
  //   id: user.id,
  //   email: user.email,
  // });

  // // remove password from the user object
  // delete user.password;

  return successResponse(res, StatusCodes.OK, user);
};

// @desc    Sign Out Users
// @route   GET   /api/v1/auth/signout
export const signOutController = async (req: Request, res: Response) => {
  req.session = null;

  return successResponse(res, StatusCodes.OK, {
    message: "Logged out successfully",
  });
};

// @desc    Register User
// @route   POST    /api/v1/auth/register
export const registerController = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const data = await createUser({
    fullName,
    email,
    password,
  });

  // Generate the JWT and attach it to the req session object
  // generateJWT(req, { id: data.id, email: data.email });

  return successResponse(res, StatusCodes.CREATED, data);
};

// @desc    Fetches the current user
// @route   GET   /api/v1/auth/current-user
export const currentUser = async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ currentUser: null });
  }

  return res
    .status(StatusCodes.OK)
    .json({ message: "success", currentUser: req.currentUser });
};
