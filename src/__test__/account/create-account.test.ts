import { StatusCodes } from "http-status-codes";
import supertest, { Response } from "supertest";
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

describe("Create an account", () => {
  let user: Response;
  beforeEach(async () => {
    user = await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);
  });

  it("should create an account for a user", async () => {
    const cookie = user.get("Set-Cookie");

    const response = await request
      .post(`/api/v1/account`)
      .send({
        currency: "USD",
        passcode: "1234",
        accountType: "Current",
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);

    expect(response.body.data.currency).toBe("USD");
    expect(response.body.data.balance).toBe("0");
    expect(response.body.data.type).toBe("Current");
  });

  it("should return 400 if invalid fields were provided", async () => {
    const cookie = user.get("Set-Cookie");

    const response = await request
      .post(`/api/v1/account`)
      .send({
        currency: "usd",
        passcode: "123",
        accountType: "savings",
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.BAD_REQUEST);
  });
});
