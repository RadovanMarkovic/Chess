const { json } = require("express")
const redisClient = require("../config/redis")

let numberOfRoomIndices = {
  //koristi se za mapiranje korisničkih rangova na indekse unutar niza numberOfRooms, a to omogućava praćenje broja soba za svaki rang korisnika
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
}

const createRoom = (roomId, user, time, password = null) => {
  let room = {
    id: roomId,
    players: [null, null],
    moves: [],
    time,
    gameStarted: false,
  }
  room.players[0] = user
  if (password) {
    room.password = password
  }
  redisClient.set(roomId, JSON.stringify(room)) //postavljamo vrednost ključa roomId u Redis bazi podataka sa vrednošću JSON stringa

  // Ažuriranje liste svih soba
  console.log("PRE GETROOMS")

  redisClient.get("rooms", (err, reply) => {
    console.log("U ROOMS")

    if (err) throw err
    let rooms
    let index
    if (reply) {
      //ako rooms postoji, JSON string se parsira
      rooms = JSON.parse(reply)
      index = rooms.length
      rooms.push(room) //dodaje se nova soba u niz
    } else {
      index = 0
      rooms = [room]
    }
    redisClient.set("rooms", JSON.stringify(rooms)) //azurirani broj soba se cuva u Redisu

    redisClient.get("roomIndices", (err, reply) => {
      let roomIndices
      if (reply) {
        roomIndices = JSON.parse(reply)
      } else {
        roomIndices = {} //ako roomIndices ne postoji, kreira se novi prazan objekat
      }
      roomIndices[`${roomId}`] = index //dodaje se novi indeks
      redisClient.set("roomIndices", JSON.stringify(roomIndices))
    })
  })
  redisClient.get("total-rooms", (err, reply) => {
    if (err) throw err
    if (reply) {
      //ako total-rooms postoji, parsira se u int, povecava za 1 i cuva u Redisu
      let totalRooms = parseInt(reply)
      totalRooms += 1
      redisClient.set("totalRooms", totalRooms + "")
    } else {
      redisClient.set("totalRooms", "1") //ako total-rooms ne postoji, postavlja se na 1 jer je onda kreirana prva soba
    }
  })

  redisClient.get("number-of-rooms", (err, reply) => {
    if (err) throw err
    let numberOfRooms = [0, 0, 0, 0] //pocetni broj soba za svaki od rankova je 0
    if (reply) {
      numberOfRooms = JSON.parse(reply) //trenutni broj soba za svaki korisnicki rank
    }
    numberOfRooms[numberOfRoomIndices[user.user_rank]] += 1 //povecava se broj soba za odgovarajuci rank korisnika
    redisClient.set("number-of-rooms", JSON.stringify(numberOfRooms))
  })
}

const joinRoom = (roomId, user) => {
  redisClient.get(roomId, (err, reply) => {
    if (err) throw err

    if (reply) {
      let room = JSON.parse(reply)

      room.players[1] = user //ako soba postoji, dodaje korisnika na drugo mesto (jer je vec neko tu)

      redisClient.set(roomId, JSON.stringify(room))

      redisClient.get("roomIndices", (err, reply) => {
        if (err) throw err

        if (reply) {
          let roomIndices = JSON.parse(reply)

          redisClient.get("rooms", (err, reply) => {
            if (err) throw err
            if (reply) {
              let rooms = JSON.parse(reply)

              rooms[roomIndices[roomId]].players[1] = user
              redisClient.set("rooms", JSON.stringify(rooms))
            }
          })
        }
      })
    }
  })
}
const removeRoom = (roomId, userRank) => {
  redisClient.del(roomId)
  redisClient.get("roomIndices", (err, reply) => {
    if (err) throw err

    if (reply) {
      let roomIndices = JSON.parse(reply)

      redisClient.get("rooms", (err, reply) => {
        if (err) throw err
        if (reply) {
          let rooms = JSON.parse(reply)

          rooms.splice(roomIndices[roomId], 1) //uklanja element iz niza
          delete roomIndices[roomId]
          redisClient.set("rooms", JSON.stringify(rooms))
          redisClient.set("roomIndices", JSON.stringify(roomIndices))
        }
      })
    }
  })
  redisClient.get("total-rooms", (err, reply) => {
    if (err) throw err
    if (reply) {
      let totalRooms = parseInt(reply)
      totalRooms -= 1
      redisClient.set("totalRooms", totalRooms + "")
    }
  })

  redisClient.get("number-of-rooms", (err, reply) => {
    if (err) throw err

    if (reply) {
      numberOfRooms = JSON.parse(reply)
      numberOfRooms[numberOfRoomIndices[user.user_rank]] -= 1
      redisClient.set("number-of-rooms", JSON.stringify(numberOfRooms))
    }
  })
}
const createTestingRooms = () => {
  const user = {
    username: "testuser",
    user_rank: "beginner",
    user_points: 1000,
    room: "room1",
  }
  const user2 = {
    username: "testuser2",
    user_rank: "expert",
    user_points: 1000,
    room: "room2",
  }

  createRoom("room1", user, 0)
  createRoom("room2", user2, 0, "password")
}

module.exports = { createRoom, joinRoom, removeRoom, createTestingRooms }

// const { json } = require("express")
// const redisClient = require("../config/redis")

// let numberOfRoomIndices = {
//   beginner: 0,
//   intermediate: 1,
//   advanced: 2,
//   expert: 3,
// }

// const createRoom = (roomId, user, time, password = null) => {
//   console.log("CREATE ROOMS")
//   let room = {
//     id: roomId,
//     players: [null, null],
//     moves: [],
//     time,
//     gameStarted: false,
//   }
//   room.players[0] = user

//   if (password) {
//     room.password = password
//   }

//   console.log("Kreirana soba:", room)

//   redisClient.set(roomId, JSON.stringify(room), (err) => {
//     if (err) throw err
//     console.log(`Soba ${roomId} je dodata u Redis`)
//   })

//   // Ažuriranje liste svih soba
//   console.log("PRE ROOMSA")
//   redisClient.get("rooms", (err, reply) => {
//     console.log("USAO U ROOMS")
//     if (err) throw err
//     let rooms
//     let index
//     if (reply) {
//       rooms = JSON.parse(reply)
//       index = rooms.length
//       rooms.push(room)
//     } else {
//       index = 0
//       rooms = [room]
//     }
//     redisClient.set("rooms", JSON.stringify(rooms), (err) => {
//       if (err) throw err
//       console.log(`Lista soba ažurirana:`, rooms)
//     })

//     redisClient.get("roomIndices", (err, reply) => {
//       let roomIndices
//       if (reply) {
//         roomIndices = JSON.parse(reply)
//       } else {
//         roomIndices = {}
//       }
//       roomIndices[`${roomId}`] = index
//       redisClient.set("roomIndices", JSON.stringify(roomIndices))
//     })
//   })
//   console.log("IZASAO IZ ROOMSA")

//   // Ažuriranje ukupnog broja soba
//   redisClient.get("total-rooms", (err, reply) => {
//     if (err) throw err
//     if (reply) {
//       let totalRooms = parseInt(reply)
//       totalRooms += 1
//       redisClient.set("totalRooms", totalRooms + "", (err) => {
//         if (err) throw err
//         console.log("Ukupan broj soba je ažuriran:", totalRooms)
//       })
//     } else {
//       redisClient.set("totalRooms", "1", (err) => {
//         if (err) throw err
//         console.log("Ukupan broj soba je postavljen na 1")
//       })
//     }
//   })

//   // Ažuriranje broja soba po korisničkom rangu
//   redisClient.get("number-of-rooms", (err, reply) => {
//     if (err) throw err
//     let numberOfRooms = [0, 0, 0, 0]
//     if (reply) {
//       numberOfRooms = JSON.parse(reply)
//     }
//     numberOfRooms[numberOfRoomIndices[user.user_rank]] += 1
//     redisClient.set("number-of-rooms", JSON.stringify(numberOfRooms), (err) => {
//       if (err) throw err
//       console.log("Broj soba po rangu je ažuriran:", numberOfRooms)
//     })
//   })
// }

// const joinRoom = (roomId, user) => {
//   redisClient.get(roomId, (err, reply) => {
//     if (err) throw err

//     if (reply) {
//       let room = JSON.parse(reply)
//       room.players[1] = user

//       redisClient.set(roomId, JSON.stringify(room), (err) => {
//         if (err) throw err
//         console.log(`Korisnik je dodan u sobu ${roomId}:`, room)
//       })

//       redisClient.get("roomIndices", (err, reply) => {
//         if (err) throw err

//         if (reply) {
//           let roomIndices = JSON.parse(reply)

//           redisClient.get("rooms", (err, reply) => {
//             if (err) throw err
//             if (reply) {
//               let rooms = JSON.parse(reply)
//               rooms[roomIndices[roomId]].players[1] = user
//               redisClient.set("rooms", JSON.stringify(rooms), (err) => {
//                 if (err) throw err
//                 console.log(
//                   "Ažurirana lista soba nakon pridruživanja korisnika:",
//                   rooms
//                 )
//               })
//             }
//           })
//         }
//       })
//     }
//   })
// }

// const removeRoom = (roomId, userRank) => {
//   redisClient.del(roomId, (err) => {
//     if (err) throw err
//     console.log(`Soba ${roomId} je obrisana iz Redis`)
//   })

//   redisClient.get("roomIndices", (err, reply) => {
//     if (err) throw err

//     if (reply) {
//       let roomIndices = JSON.parse(reply)

//       redisClient.get("rooms", (err, reply) => {
//         if (err) throw err
//         if (reply) {
//           let rooms = JSON.parse(reply)
//           rooms.splice(roomIndices[roomId], 1)
//           delete roomIndices[roomId]
//           redisClient.set("rooms", JSON.stringify(rooms), (err) => {
//             if (err) throw err
//             console.log("Lista soba ažurirana nakon brisanja sobe:", rooms)
//           })
//           redisClient.set("roomIndices", JSON.stringify(roomIndices))
//         }
//       })
//     }
//   })

//   redisClient.get("total-rooms", (err, reply) => {
//     if (err) throw err
//     if (reply) {
//       let totalRooms = parseInt(reply)
//       totalRooms -= 1
//       redisClient.set("totalRooms", totalRooms + "", (err) => {
//         if (err) throw err
//         console.log("Ukupan broj soba je smanjen:", totalRooms)
//       })
//     }
//   })

//   redisClient.get("number-of-rooms", (err, reply) => {
//     if (err) throw err
//     if (reply) {
//       let numberOfRooms = JSON.parse(reply)
//       numberOfRooms[numberOfRoomIndices[userRank]] -= 1
//       redisClient.set(
//         "number-of-rooms",
//         JSON.stringify(numberOfRooms),
//         (err) => {
//           if (err) throw err
//           console.log("Broj soba po rangu smanjen:", numberOfRooms)
//         }
//       )
//     }
//   })
// }

// // const createTestingRooms = () => {
// //   const user = {
// //     username: "testuser",
// //     user_rank: "beginner",
// //     user_points: 1000,
// //     room: "room1",
// //   }
// //   const user2 = {
// //     username: "testuser2",
// //     user_rank: "expert",
// //     user_points: 1000,
// //     room: "room2",
// //   }

// //   createRoom("room1", user, 0)
// //   createRoom("room2", user2, 0, "password")
// // }
// const createTestingRooms = async () => {
//   try {
//     const rooms = [
//       {
//         id: "room1",
//         players: [
//           {
//             username: "testuser",
//             user_rank: "beginner",
//             user_points: 1000,
//             room: "room1",
//           },
//           null,
//         ],
//         moves: [],
//         time: 0,
//         gameStarted: false,
//       },
//       {
//         id: "room2",
//         players: [
//           {
//             username: "testuser2",
//             user_rank: "expert",
//             user_points: 1000,
//             room: "room2",
//           },
//           null,
//         ],
//         moves: [],
//         time: 0,
//         gameStarted: false,
//         password: "password",
//       },
//     ]
//     createRoom("room1", user, 0)
//     createRoom("room2", user2, 0, "password")

//     console.log("Rooms saved to Redis") // Proveri da li se sobe pravilno čuvaju u Redis
//   } catch (err) {
//     console.error("Error creating rooms:", err)
//   }
// }

// module.exports = { createRoom, joinRoom, removeRoom, createTestingRooms }
