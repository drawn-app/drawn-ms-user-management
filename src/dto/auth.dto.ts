import { Static, t } from "elysia";

export const RegisterBody = t.Object({
    email: t.String({
        format: "email",
        minLength: 1,
        error: "Email is required",
    }),
    password: t.String({
        minLength: 8,
        error: "Password must be at least 8 characters",
    }),
    displayName: t.String({
        minLength: 1,
        error: "Display name is required",
    }),
})

export type RegisterInput = Static<typeof RegisterBody>

export const LoginBody = t.Object({
    email: t.String({
        format: "email",
        minLength: 1,
        error: "Email is required",
    }),
    password: t.String({
        minLength: 8,
        error: "Password must be at least 8 characters",
    }),
})

export type LoginInput = Static<typeof LoginBody>