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
  await knex(Model.account).truncate();
});

describe("Withdraw Fund", () => {
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

  it("should withdraw fund from a user's account", async () => {
    const cookie = user.get("Set-Cookie");

    await request
      .post(`/api/v1/account`)
      .send({
        currency: "USD",
        passcode: "1234",
        accountType: "Current",
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);

    let account = await request
      .post(`/api/v1/account/fund`)
      .send({
        amount: 500,
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);
    expect(account.body.data.message).toBe("Account has been funded");

    await request
      .post("/api/v1/account/withdraw")
      .send({
        passcode: 1234,
        amount: 400,
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);

    account = await request
      .get(`/api/v1/account`)
      .set("Cookie", cookie)
      .expect(StatusCodes.OK);

    expect(account.body.data.balance).toBe("100");
  });

  it("should return 401 if not logged in", async () => {
    await request
      .post(`/api/v1/account`)
      .send({
        currency: "usd",
        passcode: "123",
        accountType: "savings",
      })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("should return 401 if insufficient balance", async () => {
    const cookie = user.get("Set-Cookie");

    await request
      .post(`/api/v1/account`)
      .send({
        currency: "USD",
        passcode: "1234",
        accountType: "Current",
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);

    let account = await request
      .post(`/api/v1/account/fund`)
      .send({
        amount: 500,
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);
    expect(account.body.data.message).toBe("Account has been funded");

    await request
      .post("/api/v1/account/withdraw")
      .send({
        passcode: 1234,
        amount: 600,
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should return 401 if incorrect passcode", async () => {
    const cookie = user.get("Set-Cookie");

    await request
      .post(`/api/v1/account`)
      .send({
        currency: "USD",
        passcode: "1234",
        accountType: "Current",
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);

    let account = await request
      .post(`/api/v1/account/fund`)
      .send({
        amount: 500,
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.CREATED);
    expect(account.body.data.message).toBe("Account has been funded");

    await request
      .post("/api/v1/account/withdraw")
      .send({
        passcode: 4321,
        amount: 300,
      })
      .set("Cookie", cookie)
      .expect(StatusCodes.BAD_REQUEST);
  });
});
