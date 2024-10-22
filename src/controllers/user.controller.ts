import {t, Elysia} from "elysia";
import UserService from "../services/user.service";
import { UserPasswordUpdateBody, UserUpdateBody } from "../dto/user.dto";
import { ForbiddenError } from "../utils/error";

const userService = new UserService();

export const userController = new Elysia({ prefix: '/users' })
                                        .get("/", async ({ query }) => {
                                            if (!query.email) {
                                                throw new ForbiddenError("You are not allowed to access this resource");
                                            }
                                            return await userService.getUserByEmail(query.email);
                                        }, {
                                            query: t.Object({
                                                email: t.Optional(t.String()),
                                            })
                                        })
                                        .get("/:id" , async ({ params: { id } ,error }) => {
                                            try {
                                                return await userService.getUserById(id);
                                            } catch (err) {
                                                return error("Not Found", err);
                                            }
                                        })
                                        .put("/:id", async ({ params: { id }, body ,error}) => {
                                            try {
                                                return await userService.updateUser(id, body);
                                            } catch (err) {
                                                return error("Not Found", err);
                                            }
                                        },{
                                            body : UserUpdateBody
                                        })
                                        .put("/:id/password", async ({ params: { id }, body, error }) => {
                                            try {
                                                const result = await userService.changePassword(id,body.oldPassword, body.newPassword);
                                                return result;
                                            } catch (err) {
                                               return error("Unauthorized", err);
                                            } 
                                        },{
                                            body : UserPasswordUpdateBody
                                        })
                                        .delete("/:id", async ({ params: { id }, body ,error}) => {
                                            try {
                                                return await userService.deleteUser(id, body.confirmPassword);
                                            }
                                            catch (err) {
                                                return error("Unauthorized", err);  
                                            }
                                        },{
                                            body : t.Object({
                                                confirmPassword: t.String(),
                                            })}
                                        )