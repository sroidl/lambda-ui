import React, {PropTypes} from "react";
import Moment from "moment";
import "moment-duration-format";

const formatSeconds = (input) => {
    const duration = Moment.duration(input.seconds(), "seconds");
    if (duration.seconds() === 0) {
        return "";
    }
    else if (duration.seconds() === 1) {
        return "1 second";
    }
    else if (duration.seconds() < 10) {
        return duration.format("s") + " seconds";
    }
    return duration.format("ss") + " seconds";
};

const formatMinutes = (input) => {
    const duration = Moment.duration(input.minutes(), "minutes");
    if (duration.minutes() === 0) {
        return "";
    }
    else if (duration.minutes() === 1) {
        return "1 minute";
    }
    else if (duration.minutes() < 10) {
        return duration.format("m") + " minutes";
    }
    return duration.format("mm") + " minutes";
};

const formatHours = (duration) => {
    if (duration.hours() === 0) {
        return "";
    }
    else if (duration.hours() === 1) {
        return "1 hour";
    }
    else if (duration.hours() < 10) {
        return duration.format("h") + " hours";
    }
    return duration.format("hh") + " hours";
};

const formatDuration = seconds => {
    const duration = Moment.duration(seconds, "seconds");
    const formatted = formatHours(duration) + " " + formatMinutes(duration) + " " + formatSeconds(duration);
    return formatted.trim();
};

export const FormattedDuration = ({seconds, longTime}) => {
    if(longTime){
        const duration = Moment.duration(seconds, "seconds");
        return <span className="formattedDuration">{formatDuration(duration)}</span>;
    }
    return null;
};

FormattedDuration.propTypes = {
    seconds: PropTypes.number.isRequired,
    longTime: PropTypes.bool.isRequired
};
