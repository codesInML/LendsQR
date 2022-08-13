import { Request } from "express";
import jwt from "jsonwebtoken";

export const generateJWT = (
  req: Request,
  payload: { id: string; email: string }
) => {
  const userJWT = jwt.sign(payload, process.env.JWT_SECRET!);

  // store it on the session object
  req.session = {
    jwt: userJWT,
  };
};
