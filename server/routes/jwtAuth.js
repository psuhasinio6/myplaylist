const router = require("express").Router();
const pool = require("../db");
const bcrypt=require("bcrypt");
const jwtGenerator=require("../utils/jwtGenerator");
const validInfo=require("../middleware/validinfo");
const authorization=require("../middleware/authorization");
const { signup } = require('../controller/appController');

//register
router.post("/register",validInfo,async(req,res)=>{
    try {
        //print details from body
        const {name,email,password }=req.body;

        // check user existence
        const user = await pool.query("SELECT * FROM users WHERE user_email=$1",[email]);
        
        if(user.rows.length !== 0){
            return res.status(401).send("User already exists");
        }
        //bcrypt password

        const saltRound =10;
        const salt=await bcrypt.genSalt(saltRound);
        const bcryptPassword= await bcrypt.hash(password,salt);

        
        //insert into db
        const newUser=await pool.query
        ("INSERT INTO users (user_name,user_email,user_password) VALUES($1,$2,$3) RETURNING *",
        [name,email,bcryptPassword]);


        //generate jwt token
        const token=jwtGenerator(newUser.rows[0].user_id);
        res.json({token});
 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


//login route
router.post("/login",signup,validInfo,async(req,res)=>{
    try {
        //destructure

        const {email,password}=req.body;

        //check existence

        const user=await pool.query("SELECT * FROM users WHERE user_email=$1",[
            email
        ]);

        if(user.rows.length===0){
            return res.status(401).json("Password or Email is Incorrect");
        }

        //check pass are same or not
        const validPassword=await bcrypt.compare(password,user.rows[0].user_password);
        
        if(!validPassword){
            return res.status(401).json("Password or Email is Incorrect");
        }

        //give jwt token

        const token=jwtGenerator(user.rows[0].user_id);
        res.json({token})
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server Error");
    }
});

router.get("/is-verify",authorization,async(req,res)=>{
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server Error");
    }
}
)

module.exports=router;