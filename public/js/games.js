//DOM Elements

const gamesDivElement = document.getElementById("games")
const rankFilter = document.getElementById("filter")
const gameList = document.getElementById("game-list")
const noGamesMessage = document.getElementById("no-games-found")

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

const fetchUserCallback = (data) => {
  user = data
  socket.emit("user-connected", user)
  socket.emit("get-rooms", "all")

  gamesDivElement.classList.remove("hidden")

  hideSpinner()
}

fetchData("/api/user-info", fetchUserCallback)
