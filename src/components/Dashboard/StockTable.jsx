import { format } from "date-fns";
import PropTypes from "prop-types";

export default function StockTable({ stockReport }) {
  if (stockReport.size === 0) {
    return <p>No data available for the selected date range.</p>;
  }

  const safeValue = (value) => (isNaN(value) ? 0 : value);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border">Date</th>
            <th className="px-4 py-2 text-left border">Product Name</th>
            <th className="px-4 py-2 text-left border">In Quantity</th>
            <th className="px-4 py-2 text-left border">Out Quantity</th>
            <th className="px-4 py-2 text-left border">Returned Quantity</th>
          </tr>
        </thead>
        <tbody>
          {[...stockReport]
            .filter(
              ([, value]) =>
                safeValue(value.inQuantity) !== 0 ||
                safeValue(value.outQuantity) !== 0 ||
                safeValue(value.returnQuantities) !== 0 // Include return quantities in filter
            )
            .map(([, value]) => (
              <tr key={value.productName}>
                <td className="px-4 py-2 border">
                  {format(new Date(value.date), "yyyy-MM-dd")}
                </td>
                <td className="px-4 py-2 border">{value.productName}</td>
                <td className="px-4 py-2 border">
                  {safeValue(value.inQuantity).toFixed(2)}
                </td>
                <td className="px-4 py-2 border">
                  {safeValue(value.outQuantity).toFixed(2)}
                </td>
                <td className="px-4 py-2 border">
                  {safeValue(value.returnQuantities).toFixed(2)}
                </td>
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
