import Elysia from "elysia";

export const workspaceController = new Elysia({ prefix: '/users' })
                                        .get("/", () => "Welcome to User Management Microservice")