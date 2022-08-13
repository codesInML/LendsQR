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

describe("Fund an account", () => {
  let user1: Response;
  let user2: Response;
  let account1: Response;
  let account2: Response;
  let cookie1: string[];
  let cookie2: string[];

  beforeEach(async () => {
    user1 = await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "John Doe",
        email: "john@doe.com",
        password: "johnDoe123",
      })
      .expect(StatusCodes.CREATED);

    user2 = await request
      .post(`/api/v1/auth/register`)
      .send({
        fullName: "Jane Doe",
        email: "jane@doe.com",
        password: "janeDoe123",
      })
      .expect(StatusCodes.CREATED);

    account1 = await request
      .post(`/api/v1/account`)
      .send({
        currency: "USD",
        passcode: "1234",
        accountType: "Current",
      })
      .set("Cookie", user1.get("Set-Cookie"))
      .expect(StatusCodes.CREATED);

    account2 = await request
      .post(`/api/v1/account`)
      .send({
        currency: "USD",
        passcode: "1234",
        accountType: "Current",
      })
      .set("Cookie", user2.get("Set-Cookie"))
      .expect(StatusCodes.CREATED);

    cookie1 = user1.get("Set-Cookie");
    cookie2 = user2.get("Set-Cookie");
  });

  it("should return 201 on successful transfer of funds", async () => {
    await request
      .post(`/api/v1/account/fund`)
      .send({
        amount: 500,
      })
      .set("Cookie", cookie1)
      .expect(StatusCodes.CREATED);

    const response = await request
      .post("/api/v1/account/transfer")
      .send({
        passcode: 1234,
        amount: 300,
        recipientAccount: account2.body.data.accountNumber,
      })
      .set("Cookie", cookie1)
      .expect(StatusCodes.CREATED);
    expect(response.body.data.transfer).toBe("Completed");
  });

  it("should return 401 if not logged in", async () => {
    await request
      .post(`/api/v1/account/transfer`)
      .send({
        currency: "usd",
        passcode: "123",
        accountType: "savings",
      })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("should return 400 if insufficient balance", async () => {
    await request
      .post(`/api/v1/account/transfer`)
      .send({
        passcode: 1234,
        amount: 600,
        recipientAccount: account2.body.data.accountNumber,
      })
      .set("Cookie", cookie1)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 if incorrect passcode", async () => {
    await request
      .post(`/api/v1/account/transfer`)
      .send({
        passcode: 4321,
        amount: 600,
        recipientAccount: account2.body.data.accountNumber,
      })
      .set("Cookie", cookie1)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 if transferring to self", async () => {
    await request
      .post(`/api/v1/account/transfer`)
      .send({
        passcode: 1234,
        amount: 300,
        recipientAccount: account1.body.data.accountNumber,
      })
      .set("Cookie", cookie1)
      .expect(StatusCodes.BAD_REQUEST);
  });
});
