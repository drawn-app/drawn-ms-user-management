import { User } from '@prisma/client';
import { db } from '../utils/db';
import bcrypt from 'bcrypt';
import { uploadImage } from '../utils/firebase';
import { UserUpdateInput } from '../dto/user.dto';

export default class UserService{

    removePassword(user: User | null) {
        if (!user) {
            return null;
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserById(id: string) {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        return this.removePassword(user);
    }

    async deleteUser(id: string, confirmPassword: string) {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordMatch = await bcrypt.compare(confirmPassword, user.password);
        if (!isPasswordMatch) {
            throw new Error("Password is incorrect");
        }
        const result = await db.user.delete({
            where: {
                id: id
            }
        });
        return this.removePassword(result);
    }

    async isUserExist(id: string) {
        const user = await this.getUserById(id);
        console.log(user);
        return user ? true : false;
    }

    async updateUser(id: string, dataUpdate: UserUpdateInput) {
        // convert dataUpdate to UserUpdateURL by uploading image to firebase if avatar is provided
        const isUserExist = await this.isUserExist(id);
        if (!isUserExist) {
            throw new Error("User not found");
        }
        const { avatar, ...data } = dataUpdate;
        let avatarURL: string | undefined;
        if (avatar) {
            avatarURL = await uploadImage(avatar, "avatars");
        }
        const user = await db.user.update({
            where: {
                id: id
            },
            data: {
                ...data,
                avatar: avatarURL
            }
        });
        return this.removePassword(user);
    }

    async changePassword(id: string, oldPassword: string, newPassword: string) {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            throw new Error("Old password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const userNewData = await db.user.update({
            where: {
                id: id
            },
            data: {
                password: hashedPassword
            }
        });
        return this.removePassword(userNewData);
    }

};