import {t, Elysia} from "elysia";
import UserService from "../services/user.service";

const userService = new UserService();

export const userController = new Elysia({ prefix: '/users' })
                                        .get("/", () => "Welcome to User Management Microservice")
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
                                            body : t.Object({
                                                displayName: t.Optional(t.String()),
                                                avatar: t.Optional(t.File()),
                                                
                                            })
                                        })
                                        .put("/:id/password", async ({ params: { id }, body, error }) => {
                                            try {
                                                const result = await userService.changePassword(id,body.oldPassword, body.newPassword);
                                                return result;
                                            } catch (err) {
                                               return error("Unauthorized", err);
                                            } 
                                        },{
                                            body : t.Object({
                                                oldPassword: t.String(),
                                                newPassword: t.String({
                                                    minLength: 8,
                                                    error: "New Password must be at least 8 characters",
                                                }),
                                            })
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