import {t, Static} from "elysia";

export const UserUpdateBody = t.Object({
    displayName: t.Optional(t.String()),
    avatar: t.Optional(t.File()),
});

export type UserUpdateInput = Static<typeof UserUpdateBody>;

export const UserPasswordUpdateBody = t.Object({
    oldPassword: t.String(),
    newPassword: t.String({
        minLength: 8,
        error: "New Password must be at least 8 characters",
    }),
});

export type UserPasswordUpdateInput = Static<typeof UserPasswordUpdateBody>;