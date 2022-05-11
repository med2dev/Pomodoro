
// functions:

function start_session() {
    // if running, exit unsuccessfully
    if (running){
        return 1
    }
    // change buton UI
    disable_start()
    running = true

    // pull values from the form
    const pomLength = document.querySelector('#pLength').value * 60000
    const breakLength = document.querySelector('#bLength').value * 60000
    const cycles = document.querySelector('#cycles').value 

    // calculate or set other values
    const interval = pomLength + breakLength
    const pomMessage = "Pomodoro"
    const breakMin = breakLength / 60000
    const breakMessage = `Take a ${breakMin} minute break`

    // if restarting, reset the styles and the timers array
    document.querySelector('header').classList.remove('pomodoro', 'complete')
    timers = []


    // start the break timer, offset by the pom length
    start_break(breakMessage, interval, cycles, pomLength, breakLength)
    
    // start the pom timer
    start_pom(pomMessage, interval, cycles, pomLength)

}
 function setVolume(){
    speechVolume = document.querySelector('#volume').value
    console.log(`speechVolume is ${speechVolume}`)
    
 }

// starts the break timer with an offset
// adds the timeoutID to timers
function start_break(message, interval, cycles, offset, length){
    breakTimeoutId = setTimeout(() => start_timer(message, interval, cycles, length), offset)
    timers.push(breakTimeoutId)
}


// starts the pom timer
// this is a wrapper with no added functionality. 
// Consider simply removing it, and using start_timer in start_session
function start_pom(message, interval, cycles, length){
    start_timer(message, interval, cycles, length)
}

// kill all timers
// calls send_message, so you can change states there
function kill_all(timerArray){
    console.log('Killing All Timers')
    timerArray.forEach(timer => {
        // might as well kill both 
        clearInterval(timer)
        clearTimeout(timer)
    })

    send_message("Session Complete.\nTake a longer break!", length = 0, kill = true)
}



// This is where we make changes to the DOM
// TODO: add starting timers

// pseudo code:
// take in length (will be different than interval)
// convert legnth from ms to seconds, start timer

function send_message(message, length, kill = false) {
    console.log(`message is: ${message}`)
    const placeForMessage = document.querySelector('#message')
    const placeForStyle = document.querySelector('header')
    if (kill){
        placeForStyle.classList.add("complete")
        // change state here
        running = false
        enable_start()
    } else {
        const seconds = Math.floor(length / 1000)
        start_stop_watch(seconds)
        placeForStyle.classList.toggle("pomodoro")
    }
    let utterance = new SpeechSynthesisUtterance(message)
    if (typeof(speechVolume) !== 'undefined') {
        utterance.volume = speechVolume
    }
    placeForMessage.textContent = message
    speechSynthesis.speak(utterance)
}


// send the first message, set up the interval, 
// and kill after cycle cycles (if it is set)
function start_timer(message, interval, cycles = 0, length){

    // send the first message
    send_message(message, length)

    // then send the message after every interval
    const intervalId = setInterval(() => send_message(message, length), interval)
    timers.push(intervalId)
    
    // edge case: if pomLength (and thus interval) is very short
    // this may kill the timer before the final pomodoro
    if (cycles != ""){
        const timeToKill = (cycles - 1) * interval + length
        console.log(`killing at ${timeToKill}`)
        const killTimeoutId = setTimeout(() => {
            // state change happens in send_message, which kill_all calls
            kill_all(timers)
            console.log('killed all timers')
            // send_message(message = "Session Complete!", length = 0, kill = true)
            // clearInterval(intervalId)
            // console.log('killed an interval timer')
        }, timeToKill)
        timers.push(killTimeoutId)
        
    }
}


function time_diff(date1, date2){
    // returns difference in seconds
    return Math.floor(Math.abs(date1 - date2)/1000)
}

function timeArraytoSeconds(timeArray){
    // a time array is a length 3 array, with hours, minutes, and seconds
    return timeArray[0]*3600 + timeArray[1]*60 + timeArray[2]
}

function secondstoTimeString(s){
    // a time array is a length 3 array, with hours, minutes, and seconds
    const seconds = s % 60
    const minutes = ((s - seconds) % 3600 ) / 60
    const hours = (s - (seconds + minutes * 60)) / 3600
    const timeArray = [hours, minutes, seconds]
    const timeString = timeArray.map(num => num.toString().padStart(2,0)).join(':')
    return timeString
}


// Wrapper function to start the timer. Configure it to process different time strings
function start_stop_watch(seconds){
    document.querySelector('#timer1').textContent = ""
    stop_watch(seconds)
}

function stop_watch(seconds = '', doneDate = ''){
    // Wrap this function in another that does not have the doneDate parameter
    // doneDate is passed on the recursive call
    

    // what time is it now?
    const nowDate = new Date()
    // console.log(`nowDate is ${nowDate}`)
    
    // if doneDate is set
    // 1. check to see if you're done
    // 2. convert to seconds
    if (doneDate !== ''){
        // block 1
        // console.log(`doneDate has been set, so we're running block 1`)
        // are you done?
        if (nowDate >= doneDate){
            // block 1.done
            // console.log(`nowDate (${nowDate}) is equal to or greater than doneDate (${doneDate}), so we are in block 1.done: done!`)
            // handles edge case where 0 passed in the intervening window
            // without this line, stopwatch will end at '00:00:01'
            document.querySelector('#timer1').textContent = '00:00:00'
            return 0
        } else {
            // block 1.notdone
            // console.log(`not done yet, so we're in block 1.notdone, finding out how many seconds before we're done`)
            // how many seconds do we have left?
            seconds = time_diff(nowDate, doneDate)
            // console.log(`We have ${seconds} left on the timer`)
        }
        
    }   else if (seconds !== ''){
        // block 2
        // console.log(`seconds has been set, so we're running block 2`)
        // console.log(`this should only ever run once`)

        // if seconds is set, this is the first call
        // when are you done?
        doneDate = new Date(nowDate.getTime() + seconds * 1000)
    }

    // convert seconds to a stopWatch string
    let stopWatchString = secondstoTimeString(seconds)
    // put it in the DOM
    document.querySelector('#timer1').textContent = stopWatchString

    // check again in 50 ms
    // only pass a value for doneDate
    // interesting. Unless we specify seconds = '' in the call, doneDate is interpreted as the first argument
    let watchTimeoutID = setTimeout(() => stop_watch(seconds = '', doneDate = doneDate), 30)
    timers.push(watchTimeoutID)

}

function disable_start(){
    // UI change 
    document.querySelector('#start_session').classList.add('disabled')
    document.querySelector('#end_session').classList.remove('disabled')
    
}

function enable_start(){
    document.querySelector('#start_session').classList.remove('disabled')
    document.querySelector('#end_session').classList.add('disabled')
}

function toggle_timer(){
    if (running){
        console.log(`running is ${running}, so we are killing all timers`)
        kill_all(timers)
    } else {
        console.log(`running is ${running}, so we are starting a session.`)
        start_session()
    }
}

// main scope variables

let timers = []
let running = false

// Event listeners
document.querySelector('#start_session').addEventListener('click', start_session)
document.querySelector('#end_session').addEventListener('click', () => kill_all(timers))
document.querySelector('#timer1').addEventListener('click', toggle_timer)


// Functionality to add
// 1. optional audio cue:
// toggle button for sound
// set sound state (is there a typical way of allowing user to mute sound?)
// in send_message, include:
// let utterance = new SpeechSynthesisUtterance(message)
// speechSynthesis.speak(utterance)


// 2. long break timer

// 3. tracker (complete pomodoros, pomodoros required to complete a task, spoiled pomodors)

// 4. data (login, userid, stats on the number of pomodoros you've completed)
