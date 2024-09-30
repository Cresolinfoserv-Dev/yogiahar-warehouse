import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { singleProductGetFunction } from "../../Services/Apis";
import Layout from "../layout";
import BreadCrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";

export default function ViewProduct() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getSingleDetails = async () => {
    try {
      const response = await singleProductGetFunction(id);
      if (response.status === 200) {
        setData(response.data?.product);
      } else {
        console.error("Error fetching product details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleDetails();
  }, [id]);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {loading ? (
          <p className="text-center text-xl font-bold">Loading...</p>
        ) : (
          <>
            <BreadCrumb pageName="Product View" />
            <BackButton link="products" />
            {data ? (
              <div className="bg-white p-6 rounded-md shadow-md">
                <div className="flex justify-between mb-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      {data?.inventoryProductName}
                    </h3>
                    <p>{data?.inventoryProductDescription}</p>

                    <p>
                      Category: {data?.inventoryCategory?.inventoryCategoryName}
                    </p>

                    <p>
                      Quantity: {data?.inventoryProductQuantity} (
                      {data?.inventoryProductUnit?.inventoryUnitName})
                    </p>
                    <p>SKU: {data?.inventoryProductSKUCode}</p>

                    {data?.inventoryCategory?.inventoryType === "Boutique" && (
                      <>
                        <p>Cost Price: ₹ {data.inventoryCostPrice}</p>
                        <p>Selling Price: ₹ {data.inventorySellingPrice}</p>
                        <p>GST Percent: {data.gstPercent}%</p>
                        <p>GST Amount: ₹ {data.gstAmount}</p>
                        <img src={data.inventoryBarCode} alt="BarCode" />
                      </>
                    )}
                  </div>

                  <div className="space-y-3 min-w-40">
                    <h3 className="text-xl font-bold">Product Image</h3>
                    {data?.inventoryProductImageUrl ? (
                      <img
                        src={data.inventoryProductImageUrl}
                        alt={data?.inventoryProductName}
                        className="w-36 h-auto"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                </div>

                {data?.vendorDetails.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold">Vendor Details</h3>
                    {data?.vendorDetails.map((item) => (
                      <div key={item._id}>
                        <p>Vendor Name: {item.name}</p>
                        <p>Landing Cost: {item.landingCost}</p>
                        <p>Contact: {item.contact}</p>
                        <p>Address: {item.address}</p>
                        <p>City: {item.city}</p>
                        <p>Batch Number: {item.batchNumber}</p>
                        <p>GST: {item.gst}</p>
                        <p>IGST: {item.igst}</p>
                      </div>
                    ))}
                  </div>
                )}

                <hr className="my-6" />
              </div>
            ) : (
              <p className="text-center text-xl font-bold">Product not found</p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
