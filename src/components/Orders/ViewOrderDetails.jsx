import Layout from "../layout";
import BreadCrumb from "../common/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { singleStockOrderFunction } from "../../Services/Apis";
import Loading from "../common/Loading";
import BackButton from "../common/BackButton";

const ViewOrderDetails = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getSingleDetails = async () => {
    setLoading(true);
    try {
      const response = await singleStockOrderFunction(id);

      if (response.status === 200) {
        setData(response?.data?.order);
      } else {
        console.error("Error fetching barcode details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching barcode details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleDetails();
  }, [id]);

  return (
    <Layout>
      <div className="container px-4 mx-auto mt-4 md:px-8">
        <BreadCrumb pageName="View Order Details" />

        <BackButton
          link={
            data?.orderStatus === "Processing"
              ? "processing-orders"
              : data?.orderStatus === "Returned"
              ? "returned-orders"
              : "completed-orders"
          }
        />

        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="p-2">
              <h2>
                <span className="font-bold">Product Details</span>
              </h2>
            </div>

            <div className="max-w-3xl p-2 space-y-4">
              <table className="block min-w-full border-collapse md:table">
                <thead className="block md:table-header-group">
                  <tr className="border border-gray-300 md:table-row">
                    <th className="block p-2 font-semibold text-left text-gray-700 border border-gray-300 md:table-cell">
                      Name
                    </th>
                    <th className="block p-2 font-semibold text-left text-gray-700 border border-gray-300 md:table-cell">
                      Quantity
                    </th>
                    <th className="block p-2 font-semibold text-left text-gray-700 border border-gray-300 md:table-cell">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group">
                  {data?.products?.map((o, idx) => (
                    <React.Fragment key={idx}>
                      <tr
                        key={idx}
                        className="border border-gray-300 md:table-row"
                      >
                        <td className="block p-2 text-gray-700 border border-gray-300 md:table-cell">
                          {o?.productID?.inventoryProductName}
                        </td>
                        <td className="block p-2 text-gray-500 border border-gray-300 md:table-cell">
                          {o.sendQuantity}
                        </td>
                        <td className="block p-2 text-gray-500 border border-gray-300 md:table-cell">
                          {
                            o?.productID?.inventoryProductUnit
                              ?.inventoryUnitName
                          }
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewOrderDetails;
