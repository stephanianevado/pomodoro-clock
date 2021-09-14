function App() {
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("./alarm.mp3"));

    {/* For playing the alarm */
    }
    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
        if (displayTime <= 0) {
            setOnBreak(true);
            setBreakAudio();
        } else if (!timerOn && displayTime === breakTime) {
            setOnBreak(false);
        }
    }


    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return (
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        );
    };

    function formatTimeLength(time) {
        let minutes = Math.floor(time / 60);
        return (minutes);
    }

    const changeTime = (amount, type) => {
        if (type === "break") {
            if ((breakTime <= 60 && amount < 0) || (breakTime >= 60 * 60 && amount > 0)) {
                return;
            }
            setBreakTime((prev) => prev + amount);
        } else {
            if ((sessionTime <= 60 && amount < 0) || (sessionTime >= 60 * 60 && amount > 0)) {
                return;
            }
            setSessionTime((prev) => prev + amount);
            if (!timerOn) {
                setDisplayTime(sessionTime + amount);
            }
        }
    };

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;

        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if (prev <= 0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval);
        }
        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"));
        }
        setTimerOn(!timerOn);
    };

    const resetTime = () => {
        clearInterval(localStorage.getItem("interval-id"));
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
        setTimerOn(false);
        setOnBreak(false);
    };

    return (
        <div className="center-align">
            <h1>Pomodoro Clock</h1>
            <div className="dual-container">
                {/* Break Component*/}
                <Length
                    title={"Break Length"}
                    changeTime={changeTime}
                    type={"break"}
                    time={breakTime}
                    formatTime={formatTimeLength}
                    labelID={"break-label"}
                    incrementID={"break-increment"}
                    decrementID={"break-decrement"}
                    counterID={"break-length"}
                />
                {/* Session Component*/}
                <Length
                    title={"Session Length"}
                    changeTime={changeTime}
                    type={"session"}
                    time={sessionTime}
                    formatTime={formatTimeLength}
                    labelID={"session-label"}
                    incrementID={"session-increment"}
                    decrementID={"session-decrement"}
                    counterID={"session-length"}
                />
            </div>
            {/*Timer Component*/}
            <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
            <h1 id="time-left">{formatTime(displayTime)}</h1>

            <button onClick={controlTime} id="start_stop" className="btn-large pink accent-3">
                {timerOn ? (
                    <i className="material-icons">pause_circle_filled</i>
                ) : (
                    <i className="material-icons">play_circle_filled</i>
                )}
            </button>
            <button onClick={resetTime} id="reset" className="btn-large pink accent-3">
                <i className="material-icons">autorenew</i>
            </button>
            <audio src={new Audio} id="beep"/>
        </div>
    );
}

function Length({title, changeTime, type, time, formatTime}) {
    return (
        <div>
            <h3 id={Length.labelID}>{title}</h3>
            <div className="time-sets">
                <button id={Length.decrementID} className="btn small pink accent-3"
                        onClick={() => changeTime(-60, type)}
                >
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h2 id={Length.counterID}>{formatTime(time)}</h2>
                <button id={Length.incrementID} className="btn small pink accent-3"
                        onClick={() => changeTime(60, type)}
                >
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));

