import bcrypt from 'bcryptjs';
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (userEmail, userPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(userEmail);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: userEmail },
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(userPassword, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Email is not exists";
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    order: [
                        ['id', 'DESC'],
                    ],
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(data.email);
            if (isExist) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email already exists',
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    image: data.avatar,
                    roleId: data.roleId,
                    positionId: data.positionId,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Create new user complete',
                    users: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let user = await db.User.findOne({
            //     where: { id: userId },
            // })
            // await user.destroy();
            // resolve({
            //     errCode: 0,
            //     errMessage: 'Delete complete',
            // });

            await db.User.destroy({
                where: { id: userId },
            });
            resolve({
                errCode: 0,
                errMessage: 'Delete complete',
            });
        } catch (e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            user.phoneNumber = data.phoneNumber;
            user.gender = data.gender;
            user.positionId = data.positionId;
            user.roleId = data.roleId;
            user.image = data.avatar;

            await user.save();
            resolve({
                errCode: 0,
                errMessage: 'Edit complete',
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCode = (inputType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.Allcode.findAll({
                where: {
                    type: inputType,
                }
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    editUser: editUser,
    deleteUser: deleteUser,
    getAllCode: getAllCode,
}