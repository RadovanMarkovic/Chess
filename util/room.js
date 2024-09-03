const { json } = require("express");
const redisClient=require("../config/redis");

/*roomObj= {
    'room_id':{
         'id':'room_id',
        'players': [user1, user2],
        'moves':[],
        'time':60 (in minutes),
        'password':'password',
        gameStarted:false
    }
}*/

let numberOfRoomIndices={  //koristi se za mapiranje korisničkih rangova na indekse unutar niza numberOfRooms, a to omogućava praćenje broja soba za svaki rang korisnika
    'beginner': 0,
    'intermediate': 1,
    'advanced': 2,
    'expert': 3
}

const createRoom=(roomId, user, time, password=null)=>{
    let room={id: roomId, players:[null,null],moves:[],time,gameStarted:false}
    room.players[0]=user
    if(password){
        room.password=password;
    }
    redisClient.set(roomId,JSON.stringify(room));//postavljamo vrednost ključa roomId u Redis bazi podataka sa vrednošću JSON stringa


    // Ažuriranje liste svih soba
    redisClient.get('rooms',(err,reply)=>{
        if(err) throw err;
        let rooms;
        let index;
        if(reply){ //ako rooms postoji, JSON string se parsira
            rooms=JSON.parse(reply);
            index=rooms.length;
            rooms.push(room);//dodaje se nova soba u niz
        }else{
            index=0;
            rooms=[room]
        }
        redisClient.set('rooms', JSON.stringify(rooms));//azurirani broj soba se cuva u Redisu

        redisClient.get('roomIndices',(err,reply)=>{
            let roomIndices;
            if(reply){
                roomIndices=JSON.parse(reply);
            }else{
                roomIndices={} //ako roomIndices ne postoji, kreira se novi prazan objekat
            }
            roomIndices[`${roomId}`]=index; //dodaje se novi indeks
            redisClient.set('roomIndices', JSON.stringify(roomIndices));
        })
    })
    redisClient.get('total-rooms',(err,reply)=>{
        if(err) throw err;
        if(reply){ //ako total-rooms postoji, parsira se u int, povecava za 1 i cuva u Redisu
            let totalRooms=parseInt(reply);
            totalRooms+=1;
            redisClient.set('totalRooms',totalRooms+"")
        }else{
            redisClient.set('totalRooms',"1") //ako total-rooms ne postoji, postavlja se na 1 jer je onda kreirana prva soba
        }
    })

    redisClient.get('number-of-rooms',(err,reply)=>{
        if(err) throw err;
        let numberOfRooms=[0,0,0,0] //pocetni broj soba za svaki od rankova je 0
        if(reply){ 
           numberOfRooms=JSON.parse(reply) //trenutni broj soba za svaki korisnicki rank
        }
        numberOfRooms[numberOfRoomIndices[user.user_rank]]+=1 //povecava se broj soba za odgovarajuci rank korisnika
        redisClient.set('number-of-rooms',JSON.stringify(numberOfRooms));
    })

}

const joinRoom=(roomId,user)=>{
    redisClient.get(roomId,(err,reply)=>{
        if (err) throw err;

        if(reply){
            let room=JSON.parse(reply);

            room.players[1]=user; //ako soba postoji, dodaje korisnika na drugo mesto (jer je vec neko tu)

            redisClient.set(roomId, JSON.stringify(room));

            redisClient.get('roomIndices',(err,reply)=>{ 
                if(err) throw err;

                if(reply){
                    let roomIndices=JSON.parse(reply);

                    redisClient.get('rooms', (err,reply)=>{
                        if(err) throw err;
                        if(reply){
                            let rooms=JSON.parse(reply);

                            rooms[roomIndices[roomId]].players[1]=user;
                            redisClient.set('rooms',JSON.stringify(rooms))
                        }
                    })
                }
            })
        }
    })
}
const removeRoom=(roomId, userRank)=>{
 redisClient.del(roomId);
 redisClient.get('roomIndices',(err,reply)=>{
    if(err) throw err;

    if(reply){
        let roomIndices=JSON.parse(reply);

        redisClient.get('rooms',(err,reply)=>{
            if(err) throw err;
            if(reply){
                let rooms=JSON.parse(reply);

                rooms.splice(roomIndices[roomId],1) //uklanja element iz niza
                delete roomIndices[roomId];
                redisClient.set('rooms',JSON.stringify(rooms));
                redisClient.set('roomIndices',JSON.stringify(roomIndices));
            }
        })
    }
 })
 redisClient.get('total-rooms',(err,reply)=>{
    if(err) throw err;
if(reply){
    let totalRooms=parseInt(reply);
    totalRooms-=1;
    redisClient.set('totalRooms',totalRooms+"")

}
    
  
})

redisClient.get('number-of-rooms',(err,reply)=>{
    if(err) throw err;
  
    if(reply){
       numberOfRooms=JSON.parse(reply)
       numberOfRooms[numberOfRoomIndices[user.user_rank]]-=1
       redisClient.set('number-of-rooms',JSON.stringify(numberOfRooms));
    }
   
})

}
const createTestingRooms=()=>{
    const user={username:'testuser', user_rank:'beginner',user_points:1000, room:null}
    const user2={username:'testuser2', user_rank:'expert',user_points:1000, room:null}
    
    createRoom('room1',user,0);
    createRoom('room1',user2,0,'password');

}


module.exports={createRoom,joinRoom,removeRoom, createTestingRooms}
