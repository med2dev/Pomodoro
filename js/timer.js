
// function should generate the time string, put it in the DOM, decrement the count, and then set a timeout to call itself (will you get overflow this way?)

// time set by decrementing the count of seconds after a timeout
function slow_stop_watch(seconds){
    timeString = transform_sec(seconds)
    document.querySelector('#timer').textContent = timeString
    if (seconds == 0){
        return false
    }
    seconds--
    setTimeout(() => timer(seconds), 1000)
}
// slow_stop_watch is a touch slow, presumably because the setTimeout isn't guaranteed to run... will microtask queue make it more accurate?



function transform_sec(sec){
    const seconds = (sec % 60).toString().padStart(2,0)
    // basic math operators coerce
    const minutes = ((sec - seconds) / 60).toString().padStart(2,0)
    return `${minutes}:${seconds}`
}

function timeStringToHMS(timeString){
    // time_string must be a colon separated time string
    // seconds only: no colons
    // minutes and seconds: one colon (....mm:ss)
    // hours, minutes, and seconds: two colons (....hh:mm:ss)
    

    let timeArray = timeString.split(':').map(s => Number(s))
    while (timeArray.length < 3){
        timeArray.unshift(0)
    }
    let [hours, minutes,  seconds] = timeArray
}
// lets try using the actual time

// check every 50ms. When 1 second has passed, decrement the timer

// Parse input
function timerInputToSeconds(timerHours = 0, timerMinutes = 0, timerSeconds = 0, timerString = ""){
    if (timerString){
        let timerArray = timerString.split(':').map(s => Number(s))
        while (timerArray.length < 3){
            timerArray.unshift(0)
            [timerHours, timerMinutes, timerSeconds] = timerArray
        }
    }       
    const seconds = timerSeconds + timerMinutes * 60 + timerHours * 3600
    return seconds

}

// process input



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
    document.querySelector('#stopwatch').textContent = ""
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
            document.querySelector('#stopwatch').textContent = '00:00:00'
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
    document.querySelector('#stopwatch').textContent = stopWatchString

    // check again in 50 ms
    // only pass a value for doneDate
    // interesting. Unless we specify seconds = '' in the call, doneDate is interpreted as the first argument
    setTimeout(() => stop_watch(seconds = '', doneDate = doneDate), 30)

}



// a clever little string conversion
function hms_diff_string(date1, date2, h = true){
    let first = 17
    if (! h){
        first = 20 
    } 
    return new Date(Math.abs(date2 - date1)).toUTCString().slice(first, 25)
}