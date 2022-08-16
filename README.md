# LendsQR API
Welcome to the LendsQR API, you can view the live API [here](https://ifeoluwa-lendsqr-api.herokuapp.com/)
The entire application is contained within the `index.tsx` file which is in the `src` directory.

## Installation
Make sure you have docker and node installed on your pc, then run

```shell
    npm i
```

to install the package dependencies. Also provide the `.env` file in the root directory as stated in `.env.example` file.

## Run the app
Make sure docker has started before running any of the commands below.

###### To start the development environment run

```shell
    docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
```

###### To stop the development environment run

```shell
    docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml down
```

###### To start a previously stopped environment run

```shell
    docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d
```

###### To build the docker images for production run

```shell
    docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml build
```

###### To view lendsQR logs run

```shell
    docker logs -f lendsqr-api
```

###### To interact with lendsQR CLI run

```shell
    docker exec -it lendsqr-api /bin/sh
```

The application is behind an **nginx** proxy server which is listening on port **80**.
After you've started the application, visit the endpoint below to make sure its running properly

    http://localhost

You should get the message below

```json
    {
        "message": "Welcome to LendsQR api 🔥🔥🔥"
    }
```

## Run migration
To create an up migrations

```shell
    npm run knex:migrate
```

To create a down migration

```shell
    npm run knex:rollback
```

## Run the tests
The test uses an `in memory database` for sqlite3, hence making the tests extremely fast.

    npm run test

All tests are written in the `src/__test__` directory.

# REST API

The REST API to the *lendsqr app* is described below.
The base URL is

    http://localhost/api/v1

## Register a User

### Request

`POST /auth/register`

```json
    {
        "email": "janetdoe@gmail.com",
        "fullName": "Janet Doe",
        "password": "password"
    }
```

### Response

```json
    {
        "message": "success",
        "data": {
            "id": 17,
            "fullName": "Janet Doe",
            "email": "janetdoe@gmail.com"
        }
    }
```

## Login a user

### Request

`POST /auth/signin`

```json
    {
        "email": "janetdoe@gmail.com",
        "password": "password"
    }
```

### Response

```json
    {
        "message": "success",
        "data": {
            "id": 17,
            "fullName": "Janet Doe",
            "email": "janetdoe@gmail.com",
            "createdAt": "2022-08-16T03:51:18.000Z",
            "updatedAt": "2022-08-16T03:51:18.000Z"
        }
    }
```


## Logout a user

### Request

`GET /auth/signout`

```json
    {}
```

### Response

```json
    {
        "message": "success",
        "data": {
            "message": "Logged out successfully"
        }
    }
```

## Get the current user

### Request

`GET auth/current-user`

```json
    {}
```

### Response

```json
    {
        "message": "success",
        "currentUser": {
            "id": 17,
            "email": "janetdoe@gmail.com",
            "iat": 1660638949
        }
    }
```

## Create an account
- accountType can either be **Savings** or **Current**
- currency can either be **USD** or **NGN**
- passcode must be of length **4**

### Request

`POST /account`

```json
    {
        "accountType": "Savings",
        "currency": "USD",
        "passcode": 1234
    }
```

### Response

```json
    {
        "message": "success",
        "data": {
            "id": 9,
            "accountNumber": "2444594569",
            "balance": "0",
            "type": "Savings",
            "currency": "USD",
            "createdAt": "2022-08-16T08:37:10.000Z",
            "updatedAt": "2022-08-16T08:37:10.000Z",
            "userID": 17
        }
    }
```

## Fund an account

### Request

`POST /account/fund`

```json
    {
        "amount": "500"
    }
```

### Response

```json
    {
        "message": "success",
        "data": {
            "message": "Account has been funded"
        }
    }
```

## Change a Thing's state

### Request

`GET /account`

```json
    {}
```

### Response

```json
    {
        "message": "success",
        "data": {
            "id": 9,
            "accountNumber": "2444594569",
            "balance": "5000",
            "type": "Savings",
            "currency": "USD",
            "createdAt": "2022-08-16T08:37:10.000Z",
            "updatedAt": "2022-08-16T08:37:10.000Z",
            "userID": 17
        }
    }
```

## Transfer fund
Transfer uses transaction to ensure that the entire transfer workflow is seen through till the end. Hence, all changes are reverted if an error occurred at any point during the transfer process.

### Request

`GET /account/transfer`

```json
    {
        "amount": "100",
        "recipientAccount": "5317717302",
        "passcode": "1234"
    }
```

### Response

```json
    {
        "message": "success",
        "data": {
            "transfer": "Completed"
        }
    }
```

## Withdraw fund

### Request

`PUT /account/withdraw`

```json
    {
        "amount": 2000,
        "passcode": 1234
    }
```

### Response

```json
    {
        "message": "success",
        "data": {
            "withdrawal": "Completed"
        }
    }
```

> Custom errors are thrown for each endpoint depending on the validation that has failed

