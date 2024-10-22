import { User } from "@prisma/client";

export function jwtParams(user: User) {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        iss: process.env.JWT_KEY!
    }
}