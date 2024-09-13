import { LoginInput, RegisterInput } from "../dto/auth.dto";
import bcrypt from "bcrypt";
import { db } from "../utils/db";
import { ValidationError } from "elysia";
import { BadRequestError } from "../utils/error";
import { uploadImage } from "../utils/firebase";

export default class AuthService {

    async register(data: RegisterInput) {
        // Check if email is used
        const existedUser = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (existedUser) {
            throw new BadRequestError("Email has been already used");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        const {avatar ,...user_data} = data;
        // uploade file avatar
        const avatarURL = (avatar) ? await uploadImage(avatar, "avatars") : undefined;
        // Create user
        const user = await db.user.create({
            data: {
                ...user_data,
                avatar: avatarURL,
                password: hashedPassword
            }
        })

        return user;
    }


    async login(data: LoginInput) {
        // Find user by email
        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) {
            throw new BadRequestError("Invalid credentials");
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(data.password, user.password);
        if (!isValidPassword) {
            throw new BadRequestError("Invalid credentials");
        }

        return user;
    }

}