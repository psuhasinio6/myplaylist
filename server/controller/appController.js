const nodeMailer = require("nodemailer");

const signup = (req,res) => {
    res.status(401).json("From SignUp");
}

module.exports = {
    signup
}