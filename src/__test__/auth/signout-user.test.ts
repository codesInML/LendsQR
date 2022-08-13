import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../app";
import knex from "../../db";
import { Model } from "../../helpers";

const request = supertest(app);

beforeAll(async () => {
  await knex.migrate.latest();
});

afterEach(async () => {
  await knex(Model.user).truncate();
});

describe("Signout a User", () => {
  it("should clear the buyer's cookie on signout", async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);

    const response = await request
      .get(`/api/v1/auth/signout`)
      .expect(StatusCodes.OK);
    expect(response.get("Set-Cookie")).toBeDefined();
    expect(response.get("Set-Cookie")[0]).toBe(
      "lendsqr-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax; httponly"
    );
  });
});
