import { LoginInput, RegisterInput } from "../dto/auth.dto";
import bcrypt from "bcryptjs";
import { db } from "../utils/db";
import { ValidationError } from "elysia";
import { BadRequestError } from "../utils/error";
import { uploadImage } from "../utils/firebase";
import amqp, { Connection, Channel } from "amqplib/callback_api";
import { MailMessage } from "../utils/type";

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

        const mailMessage: MailMessage = {
            to: user.email,
            subject: "Welcome to Drawn!",
            body: "Welcome to Drawn, the best collaborative app in the world. HOHOHOHOHOHOHOHOHO",
        }

        amqp.connect(
            "amqp://localhost",
            function (error0: Error | null, connection: Connection) {
                if (error0) {
                  throw error0;
                }
            
                connection.createChannel(function (error1: Error | null, channel: Channel) {
                  if (error1) {
                    throw error1;
                  }
            
                  const exchange = "mail_order";
                  const routingKey = "email.register";
            
                  channel.assertExchange(exchange, "topic", {
                    durable: true,
                  });
            
                  channel.publish(
                    exchange,
                    routingKey,
                    Buffer.from(JSON.stringify(mailMessage))
                  );
                  console.log(
                    " [x] Sent '%s' with routing key: '%s'",
                    JSON.stringify(mailMessage),
                    routingKey
                  );
                });
            }
        )

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