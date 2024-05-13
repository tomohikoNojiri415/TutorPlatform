import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Views } from "react-big-calendar";

const calendarProps = {
  defaultView: Views.WEEK,
  views: [Views.MONTH, Views.WEEK, Views.DAY],
};

const localizer = momentLocalizer(moment);

export default function Calendar(props) {
  return (
    <>
      <BigCalendar {...calendarProps} {...props} localizer={localizer} />
    </>
  );
}
