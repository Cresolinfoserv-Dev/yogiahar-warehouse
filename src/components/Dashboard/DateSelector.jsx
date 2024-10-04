import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

export default function DateSelector({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  getStocksReport,
}) {
  const today = new Date();

  const handleFromDateChange = (date) => {
    if (date > toDate) {
      setToDate(date);
    }
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    if (date < fromDate) {
      setFromDate(date);
    }
    setToDate(date);
  };

  return (
    <div className="flex flex-col mt-8 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      <div className="md:flex items-center gap-4">
        <div>
          <label className="block text-gray-700">From Date:</label>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            selectsStart
            startDate={fromDate}
            endDate={toDate}
            maxDate={today}
            className="px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">To Date:</label>
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            selectsEnd
            startDate={fromDate}
            endDate={toDate}
            minDate={fromDate}
            maxDate={today}
            className="px-4 py-2 border rounded"
          />
        </div>
      </div>
      <button
        onClick={getStocksReport}
        className="self-end px-4 py-2 text-white bg-blue-500 rounded h-fit"
      >
        Submit
      </button>
    </div>
  );
}

DateSelector.propTypes = {
  fromDate: PropTypes.instanceOf(Date).isRequired,
  setFromDate: PropTypes.func.isRequired,
  toDate: PropTypes.instanceOf(Date).isRequired,
  setToDate: PropTypes.func.isRequired,
  getStocksReport: PropTypes.func.isRequired,
};
