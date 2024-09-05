//Ovo je kao obicna klasa kojoj smo zadali da u konstructoru zada ove vrednosti svim atributima
class Timer {
  constructor(
    player,
    roomId,
    minutes,
    seconds,
    updateTimerCallback,
    timerEndedCallback
  ) {
    this.player = player
    this.roomId = roomId
    this.minutes = minutes
    this.seconds = seconds
    this.interval = null
    this.updateTimerCallback = updateTimerCallback
    this.timerEndedCallback = timerEndedCallback
  }

  start() {}

  stop() {}
}
