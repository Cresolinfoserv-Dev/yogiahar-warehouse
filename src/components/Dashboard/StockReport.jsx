import PropTypes from "prop-types";

export default function StockReport({
  showResults,
  noData,
  productData,
  productComponentRef,
  fromDate,
  toDate,
}) {
  return (
    <div>
      {noData ? (
        <div>
          <p className="text-xl text-center text-red-600">No Data Found</p>
        </div>
      ) : (
        <>
          {showResults && (
            <div className="p-1 mt-4 bg-white" ref={productComponentRef}>
              <div className="mt-4">
                <h3 className="mb-2 text-xl font-bold text-center text-black">
                  Total Stock Report from{" "}
                  {new Date(fromDate).toLocaleDateString()} to{" "}
                  {new Date(toDate).toLocaleDateString()}
                </h3>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-5">S.NO</th>
                      <th className="py-5 text-start">Product Name</th>
                      <th className="py-5">Quantity</th>
                      <th className="py-5">Stock Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.map((product, index) => (
                      <tr key={index}>
                        <td className="py-2 text-center">{index + 1}</td>
                        <td className="py-2">{product.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

StockReport.propTypes = {
  showResults: PropTypes.bool.isRequired,
  noData: PropTypes.bool.isRequired,
  totalAmount: PropTypes.number.isRequired,
  totalAmountByCash: PropTypes.number.isRequired,
  totalAmountByCard: PropTypes.number.isRequired,
  totalAmountByUpi: PropTypes.number.isRequired,
  productData: PropTypes.array.isRequired,
  componentRef: PropTypes.object.isRequired,
  productComponentRef: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
};
