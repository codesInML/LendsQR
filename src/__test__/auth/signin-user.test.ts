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

describe("Signin a User", () => {
  beforeEach(async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);
  });

  it("should return 400 on invalid email of a user", async () => {
    await request
      .post(`/api/v1/auth/signin`)
      .send({
        email: "john",
        password: "johnDoe123",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 on incorrect password a user", async () => {
    await request
      .post(`/api/v1/auth/signin`)
      .send({
        email: "john@doe.com",
        password: "johnDoe",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should return a cookie header on successful signin", async () => {
    const response = await request
      .post(`/api/v1/auth/signin`)
      .send({
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.OK);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
