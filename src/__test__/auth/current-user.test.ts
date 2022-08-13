import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../app";
import knex from "../../db";

const request = supertest(app);

beforeAll(async () => {
  await knex.migrate.latest();
});

describe("Current User", () => {
  it("responds with details about the current user", async () => {
    const signUpResponse = await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);
    const cookie = signUpResponse.get("Set-Cookie");

    const response = await request
      .get(`/api/v1/auth/current-user`)
      .set("Cookie", cookie)
      .expect(StatusCodes.OK);

    expect(response.body.currentUser.email).toBe("john@doe.com");
  });
  it("responds with null if user is not logged in or registered", async () => {
    const response = await request
      .get(`/api/v1/auth/current-user`)
      .set("Cookie", "cookie")
      .expect(StatusCodes.UNAUTHORIZED);

    expect(response.body.currentUser).toBe(null);
  });
});
