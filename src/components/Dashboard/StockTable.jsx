import { format } from "date-fns";
import PropTypes from "prop-types";

export default function StockTable({ stockReport }) {
  if (stockReport.size === 0) {
    return <p>No data available for the selected date range.</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-left">Date</th>
            <th className="px-4 py-2 border text-left">Product Name</th>
            <th className="px-4 py-2 border text-left">Quantity</th>
            <th className="px-4 py-2 border text-left">Stock Type</th>
          </tr>
        </thead>
        <tbody>
          {[...stockReport].map(([key, value]) => (
            <tr key={key}>
              <td className="px-4 py-2 border">
                {format(value.date, "yyyy-MM-dd")}
              </td>
              <td className="px-4 py-2 border">{value.productName}</td>
              <td className="px-4 py-2 border">{value.sendQuantity}</td>
              <td className="px-4 py-2 border">{value.stockType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

StockTable.propTypes = {
  stockReport: PropTypes.instanceOf(Map).isRequired,
};
