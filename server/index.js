const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");



//middlewares 
app.use(cors());
app.use(express.json()); // req.body    

//ROUTES//

//dashboard routes

app.use("/dashboard",require("./routes/dashboard"));

//register and login routes

app.use("/auth", require("./routes/jwtAuth"));

//CREATE A SONG

app.post("/songs", async (req,res) => {
    try {
        const { description } = req.body;
        const newSong = await pool.query(
            "INSERT INTO playlist (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newSong.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//GET ALL SONGS

app.get("/songs", async (req,res) => {
    try {
        const allSongs = await pool.query(
            "SELECT * FROM playlist"
        );
        res.json(allSongs.rows);

    } catch (err) {
        console.error(err.message);
    }
});

//GET A SONG

app.get("/songs/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const song = await pool.query(
            "SELECT * FROM playlist WHERE song_id = $1 ",[id]
        );
        res.json(song.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

//UPDATE A SONG

app.put("/songs/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const { description }=req.body;
        const updateSong = await pool.query(
            "UPDATE playlist  SET description = $1 WHERE song_id = $2", [description,id]
        );
        res.json("Song is updated");

    } catch (err) {
        console.error(err.message);
    }
});

// pagination route
app.get("/songs/:limit/:offset",async(req,res)=>{
    try {
        const {limit}=req.params;
        const {offset}=req.params;
        const data=await pool.query("Select * from playlist LIMIT $1 OFFSET $2",[limit,offset]);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//DELETE A SONG 

app.delete("/songs/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const deleteSong = await pool.query(
            "DELETE FROM playlist WHERE song_id = $1",[id]
        );
        res.json("Song is deleted");
    } catch (err) {
        console.error(err.message);
    };
});

app.listen(5000,()=>{
    console.log("server has started on post 5000");
});