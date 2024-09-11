import Elysia from "elysia";
import { LoginBody, RegisterBody } from "../dto/auth.dto";
import AuthService from "../services/auth.service";
import { BadRequestError } from "../utils/error";
import jwt from "@elysiajs/jwt";
import { jwtParams } from "../utils/jwtParams";

const authService = new AuthService();

export const authController = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
        })
    )

    // POST /auth/register
    .post("/register", async ({ jwt, cookie: { auth }, body }) => {
        // Register an user
        const user = await authService.register(body)
        if (!user) {
            throw new BadRequestError("Failed to register user")
        }

        // Add JWT token to user
        auth.set({
            value: await jwt.sign(jwtParams(user)),
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/',
        })

        return user
    }, {
        body: RegisterBody
    })

    // POST /auth/login
    .post("/login", async ({ jwt, cookie: { auth }, body }) => {
        const user = await authService.login(body)

        if (!user) {
            throw new BadRequestError("Invalid credentials")
        }

        // Add JWT token to user
        auth.set({
            value: await jwt.sign(jwtParams(user)),
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/',
        })

        return user
    }, {
        body: LoginBody
    })

    // POST /auth/logout
    .post("/logout", async ({ cookie: { auth }}) => {
        auth.remove()

        return {
            message: "Logged out"
        }
    })