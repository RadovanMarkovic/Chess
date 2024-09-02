const express = require('express');
const dotenv = require('dotenv');
const db = require("./config/db");
const path = require("path");
const http =require("http")
const socketIO=require("socket.io")
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');

const {newUser, removeUser}=require("./util/user")

dotenv.config();

//Routes
const viewRoutes = require("./routes/views");
const userRoutes = require("./routes/api/user");
const { Socket } = require('dgram');

const app = express();

const server=http.createServer(app); //kada se na ovaj server pošalje zahtev, on će proslediti taj zahtev Express aplikaciji (app), koja će obraditi zahtev na osnovu definisanih ruta i vratiti odgovor.

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

const io=socketIO(server);
io.on("connection", (socket) => {
    socket.on('user-connected', async (user, roomId = null) => {
        if (roomId) {
            // TODO: Join with room ID
        } else {
            await newUser(socket.id, user);
        }
    });

    socket.on('send-total-rooms-and-users', async () => {
        try {
            const totalUsersReply = await redisClient.get('total-users');
            const totalUsers = totalUsersReply ? parseInt(totalUsersReply) : 0;

           
            const totalRoomsReply = await redisClient.get('total-rooms');
            const totalRooms = totalRoomsReply ? parseInt(totalRoomsReply) : 0;

            
            const numberOfRoomsReply = await redisClient.get('number-of-rooms');
            const numberOfRooms = numberOfRoomsReply ? JSON.parse(numberOfRoomsReply) : [0, 0, 0, 0];

            socket.emit('receive-number-of-rooms-and-users', numberOfRooms, totalRooms, totalUsers);
        } catch (err) {
            console.error('Error fetching data from Redis:', err);
        }
    });

socket.on("send-message",(message,user,roomId=null)=>{
    if(roomId){
        socket.to(roomId).emit("receive-message",message,user);
    }else{
        socket.broadcast.emit("receive-message",message,user,true);
    }
})

socket.on("send-message",(message,user,roomId=null)=>{
    if(roomId){
        socket.to(roomId).emit("receive-message",message,user);
    }else{
        socket.broadcast.emit("receive-message",message,user,true);
    }
})

    socket.on("disconnect", async () => {
        let socketId = socket.id;

        try {
            const reply = await redisClient.get(socketId);

            if (reply) {
                let user = JSON.parse(reply);

                if (user.room) {
                    // TODO: Remove user's room and also remove user from the room
                }
            }

            await removeUser(socketId);
        } catch (err) {
            console.error('Error during disconnect:', err);
        }
    });
});

//uzmemo procitamo iz dotenv varijablu PORT i pokupimo njenu vrednost, ako ne postoji onda se stavlja na 5000
const PORT = parseInt(process.env.PORT) || 5000;

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})