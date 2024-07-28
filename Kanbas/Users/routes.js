import * as dao from "./dao.js";
// let currentUser = null;
export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
   const findAllUsers = async (req, res) => {
        const {role, name} = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }

        const users = await dao.findAllUsers();
        console.log(users)
        res.json(users);
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };
    const updateUser = async (req, res) => {
        const {userId} = req.params;
        const status = await dao.updateUser(userId, req.body);
        res.json(status);
    };
    const signup = async (req, res) => {
       try{
        console.log(req.body.username,'signup');
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({message: "Username already taken"});
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
       }catch(err){
        res.json({
            message:"error",
            err:err.message||'服务器错误'
        })
       }
    };
    const signin = async (req, res) => {
        const {username, password} = req.body;
        console.log(username, password,'signin');
        try{
            const currentUser = await dao.findUserByCredentials(username, password);
            if (currentUser) {
                req.session["currentUser"] = currentUser;
                res.json(currentUser);
            } else {
                res.status(401).json({message: "Unable to login. Try again later."});
            }
        }catch(err){
            res.json({
                message:"error",
                err:err.message||'服务器错误'
            })
        }
       
    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = async (req, res) => {
        try{
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
              res.sendStatus(401);
              return;
            }
        res.json(currentUser);
        }catch(err){
            res.json({
                message:"error",
                err:err.message||'服务器错误'
            })
        }
    };
    app.get("/api/users", findAllUsers);
    app.post("/api/users", createUser);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
};