const express = require('express');
const dotenv = require('dotenv');
const db = require("./config/db");
const path = require("path");
const cookieParser = require('cookie-parser');
const redisClient = require("./config/redis");

dotenv.config();

//Routes
const viewRoutes = require("./routes/views");
const userRoutes = require("./routes/api/user");

const app = express();

db.connect((err) =>{
    if(err){
        console.log(err);
        process.exit(1);
    }

    console.log("Conecting to MySQL database");
})

//postavljanje aplikacije da se sve povezuje preko ejs-a, takodje i sa public zbog svi css,js fajlova
app.use(cookieParser("secret"));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//ruta za posecivanje stranice, odmah ce da ode na index iz views foldera
app.use("/", viewRoutes);
app.use("/api", userRoutes);

//uzmemo procitamo iz dotenv varijablu PORT i pokupimo njenu vrednost, ako ne postoji onda se stavlja na 5000
const PORT = parseInt(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
