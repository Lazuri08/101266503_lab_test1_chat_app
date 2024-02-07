const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const maxAge = 24 * 60 * 60  
const createJWT = id => {
    return jwt.sign({ id }, 'chatroom secret', {
        expiresIn: maxAge
    })
}


module.exports.signup = async (req, res) => {
    try {
        if(!req.body) {
        return res.status(400).send({
            message: `user content cannot be empty`
        });
        }else{
            const newUser = new userModel(req.body)
            await newUser.save()
            const token = createJWT(newUser._id);
            console.log(req.body)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            res.status(201).send(newUser)
        }
    } catch (error) {
        res.status(500).send(error)
    }

}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.login(username, password );
        const token = createJWT(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error});
    }
}