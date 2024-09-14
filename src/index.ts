import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

import { authController } from "./controllers/auth.controller";
import { userController } from "./controllers/user.controller";
import { BadRequestError } from "./utils/error";
import jwt from "@elysiajs/jwt";

const PORT = 3000;

const app = new Elysia()
  .use(cors())
  .error({
    "BAD_REQUEST": BadRequestError
  })
  .onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Not Found 🦊",
      };
    }
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: "Bad Request 🦊",
        message: error.message,
      };
    }
    if (code === "BAD_REQUEST") {
      set.status = 400;
      return {
        error: "Bad Request 🦊",
        message: error.message,
      };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return {
        error: "Internal Server Error 🦊",
      };
    }
  })
  .get("/", () => "Welcome to User Management Microservice")
  .use(authController)
  .use(userController)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);