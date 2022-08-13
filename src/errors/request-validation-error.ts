import { ValidationError } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(private errors: ValidationError[]) {
    super("Invalid Request Parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
