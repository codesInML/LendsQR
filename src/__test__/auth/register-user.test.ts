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

describe("Register User", () => {
  it("returns 201 on successful signup ", async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);
  });
  it("sets a cookie on successful signup", async () => {
    const response = await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
  it("returns 400 with an invalid email", async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john",
        password: "johnDoe123",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("disallows duplicate emails", async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);

    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "Jane Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
  it("returns 400 with an invalid password", async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "joh",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("returns 400 with any of the fields being empty", async () => {
    await request
      .post(`/api/v1/auth/register`)
      .send({
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.BAD_REQUEST);

    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        password: "johnDoe123",
      })
      .expect(StatusCodes.BAD_REQUEST);

    await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
});
