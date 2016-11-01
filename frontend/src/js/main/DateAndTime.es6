import React, {PropTypes} from "react";
import Moment from "moment";
import "moment-duration-format";

const formatSeconds = (input, longTime) => {
    const duration = Moment.duration(input.seconds(), "seconds");
    if (duration.seconds() === 0) {
        return longTime ? "" : "00";
    }
    else if (duration.seconds() === 1 && longTime) {
        return "1 second";
    }
    else if (duration.seconds() < 10 && longTime) {
        return duration.format("s") + " seconds";
    }
    const format = longTime ? " seconds" : "";
    return duration.format("ss") + format;
};

const formatMinutes = (input, longTime) => {
    const duration = Moment.duration(input.minutes(), "minutes");
    if (duration.minutes() === 0) {
        return longTime ? "" : "00:";
    }
    else if (duration.minutes() === 1 && longTime) {
        return "1 minute";
    }
    else if (duration.minutes() < 10 && longTime) {
        return duration.format("m") + " minutes";
    }
    const format = longTime ? " minutes" : ":";
    return duration.format("mm") + format;
};

const formatHours = (duration, longTime) => {
    if (duration.hours() === 0) {
        return "";
    }
    else if (duration.hours() === 1 && longTime) {
        return "1 hour";
    }
    else if (duration.hours() < 10 && longTime) {
        return duration.format("h") + " hours";
    }
    const format = longTime ? " hours" : ":";
    return duration.format("hh") + format;
};

const formatLongDuration = seconds => {
    const duration = Moment.duration(seconds, "seconds");
    const formatted = formatHours(duration, true) + " " + formatMinutes(duration, true) + " " + formatSeconds(duration, true);
    return formatted.trim();
};

const formatShortDuration = seconds => {
    const duration = Moment.duration(seconds, "seconds");
    const formatted = formatHours(duration, false) + formatMinutes(duration, false) + formatSeconds(duration, false);
    return formatted.trim();
};

export const FormattedDuration = ({seconds, longTime}) => {
    const duration = Moment.duration(seconds, "seconds");
    if(longTime){
        return <span className="formattedDuration">{formatLongDuration(duration)}</span>;
    }
    return <span className="formattedDuration">{formatShortDuration(duration)}</span>;
};

FormattedDuration.propTypes = {
    seconds: PropTypes.number.isRequired,
    longTime: PropTypes.bool
};
