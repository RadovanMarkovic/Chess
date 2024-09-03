//DOM Elements

/*const gamesDivElement = document.getElementById("games")
const rankFilter = document.getElementById("filter")
const gamesList = document.getElementById("games-list")
const noGamesMessage = document.getElementById("no-games-message")

const createRoomBtn = document.getElementById("create-room")
const joinRoomBtn = document.getElementById("join-room")

const createRoomFormContainer = document.getElementById(
  "create-room-form-container"
)
const createRoomForm = document.getElementById("create-room-form")
const roomId = document.getElementById("room-id")
const gameTime = document.getElementById("game-time")
const closeCreateRoomFormBtn = document.getElementById("close-create-from")
const addPassword = document.getElementById("add-password")
const passwordInputGroup = document.getElementById("password-input-group")
const roomPassword = document.getElementById("room-password")

const joinRoomFormContainer = document.getElementById(
  "join-room-form-container"
)
const joinRoomForm = document.getElementById("join-room-form")
const roomPasswordJoin = document.getElementById("room-password-join")
const closeJoinRoomFormBtn = document.getElementById("close-join-from")

//Da ne bi mogli da kopiraju password
roomPassword.readOnly = true

let user

let gameId = null

const intervals = [0, 15, 30, 45, 60]
//Functions
const fetchUserCallback = (data) => {
  user = data
  socket.emit("user-connected", user)
  socket.emit("get-rooms", "all")

  gamesDivElement.classList.remove('hidden')

  hideSpinner()
}
const addJoinButtonListeners =()=>{
document.querySelectorAll(".game button").forEach(button =>{
  if(!button.classList.contains("disabled")){
    button.addEventListener("click", e=>{
      let game=button.parentNode;

     if(game.dataset.withpassword === 'true'){
      gameId=game.id;
      joinRoomFormContainer.classList.remove("hidden");
     }else{
      socket.emit('join-room',game.id,user);
     }
    })
  }
})
}
const displayRooms =rooms=>{
gamesList.innerHTML="";

rooms.forEach(room=>{
let {username, user_rank} =room.players[0];
let numberOfPlayersInRoom=room.players[1] ? 2:1; //postavlja broj igraca na 2 ako postoji drugi igrac, odnosno na 1 ako ne postoji
let hasPassword=room.password && room.password!="" ? true:false //hasPassword će biti true ako room.password postoji i nije prazan string (""), što znači da je soba zaštićena lozinkom

gamesList.innerHTML+=`
<li class='game' id='${room.id}' data-withpassword="${hasPassword}">
<div class="user">
<span>${username}</span>
<span>( ${user_rank.charAt(0).toUpperCase()+user_rank.slice(1)})</span>
</div>
<div class="users-in-room">${numberOfPlayersInRoom} / 2</div> 

<button ${numberOfPlayersInRoom===2 ? "class='disabled'" : ""}>Join</button>
</li>
`
})
addJoinButtonListeners()
}

fetchData("/api/user-info", fetchUserCallback)

//Listeners

socket.on('receive-rooms', rooms=>{
  if(rooms.length>0){
noGamesMessage.classList.add("hidden");
gamesList.classList.remove('hidden');

displayRooms(rooms);
  }else{
    gamesList.classList.add('hidden');
    noGamesMessage.classList.remove('hidden');
  }
})

rankFilter.addEventListener("change", (e)=>{
  socket.emit("get-rooms",e.target.value)
})*/

// DOM Elements
const gamesDivElement = document.getElementById("games");
const rankFilter = document.getElementById("filter");
const gamesList = document.getElementById("games-list");
const noGamesMessage = document.getElementById("no-games-message");

const createRoomBtn = document.getElementById("create-room");
const joinRoomBtn = document.getElementById("join-room");

const createRoomFormContainer = document.getElementById(
  "create-room-form-container"
);
const createRoomForm = document.getElementById("create-room-form");
const roomId = document.getElementById("room-id");
const gameTime = document.getElementById("game-time");
const closeCreateRoomFormBtn = document.getElementById("close-create-form");
const addPassword = document.getElementById("add-password");
const passwordInputGroup = document.getElementById("password-input-group");
const roomPassword = document.getElementById("room-password");

const joinRoomFormContainer = document.getElementById(
  "join-room-form-container"
);
const joinRoomForm = document.getElementById("join-room-form");
const roomPasswordJoin = document.getElementById("room-password-join");
const closeJoinRoomFormBtn = document.getElementById("close-join-from");

// Da ne bi mogli da kopiraju password
roomPassword.readOnly = true;

let user;
let gameId = null;

const intervals = [0, 15, 30, 45, 60];

// Functions

const fetchUserCallback = (data) => {
  console.log("User data:", data); // Proveri podatke o korisniku
  user = data;
  socket.emit("user-connected", user);
  socket.emit("get-rooms", "all");

  gamesDivElement.classList.remove("hidden");
  hideSpinner();
};

const addJoinButtonListeners = () => {
  document.querySelectorAll(".game button").forEach((button) => {
    if (!button.classList.contains("disabled")) {
      button.addEventListener("click", (e) => {
        let game = button.parentNode;

        console.log("Game data:", game); // Dodaj ovo da proveriš podatke o igri

        if (game.dataset.withpassword === "true") {
          gameId = game.id;
          joinRoomFormContainer.classList.remove("hidden");
        } else {
          socket.emit("join-room", game.id, user);
        }
      });
    }
  });
};

const displayRooms = (rooms) => {
  console.log("Rooms received for display:", rooms); // Ovo treba da prikaže podatke o sobama

  gamesList.innerHTML = " ";

  rooms.forEach((room) => {
    let { username, user_rank } = room.players[0];
    let numberOfPlayersInRoom = room.players[1] ? 2 : 1;
    let hasPassword = room.password && room.password !== "" ? true : false;

    gamesList.innerHTML += `
          <li class='game' id='${room.id}' data-withpassword="${hasPassword}">
              <div class="user">
                  <span>${username}</span>
                  <span>( ${
                    user_rank.charAt(0).toUpperCase() + user_rank.slice(1)
                  })</span>
              </div>
              <div class="users-in-room">${numberOfPlayersInRoom} / 2</div>
              <button ${
                numberOfPlayersInRoom === 2 ? "class='disabled'" : ""
              }>Join</button>
          </li>
      `;
  });

  addJoinButtonListeners();

  console.log("Games list updated:", gamesList.innerHTML);
};

fetchData("/api/user-info", fetchUserCallback);

socket.on("receive-rooms", (rooms) => {
  console.log("Received rooms from server:", rooms); // Ovo treba da prikaže podatke koje je server poslao

  if (rooms.length > 0) {
    noGamesMessage.classList.add("hidden");
    gamesList.classList.remove("hidden");
    displayRooms(rooms);
  } else {
    gamesList.classList.add("hidden");
    noGamesMessage.classList.remove("hidden");
  }
});

rankFilter.addEventListener("change", (e) => {
  console.log("Filter rank:", e.target.value); // Dodaj ovo da proveriš vrednost filtera
  socket.emit("get-rooms", e.target.value);
});
