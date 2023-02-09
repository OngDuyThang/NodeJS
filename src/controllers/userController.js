import userService from "../services/userService"

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: 'Invalid email or password'
        });
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : { 'a': 'b' },
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing Id',
            users: [],
        });
    }

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    });
}

let handleCreateNewUser = async (req, res) => {
    let data = req.body;

    let consequence = await userService.createNewUser(data);
    return res.status(200).json({ consequence });
}

let handleDeleteUser = async (req, res) => {
    let id = req.body.id;

    let consequence = await userService.deleteUser(id);
    return res.status(200).json({ consequence });
}

let handleEditUser = async (req, res) => {
    let data = req.body;

    let consequence = await userService.editUser(data);
    return res.status(200).json({ consequence });
}

let handleGetAllCode = async (req, res) => {
    let type = req.query.type;
    try {
        let result = await userService.getAllCode(type);
        res.status(200).json({ result });
    } catch (e) {
        res.status(200).json({ error: e });
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleGetAllCode: handleGetAllCode,
}