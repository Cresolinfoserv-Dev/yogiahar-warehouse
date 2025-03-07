import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { singleProductGetFunction } from "../../Services/Apis";
import Layout from "../layout";
import BreadCrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import AddVendorDetails from "./AddVendorDetails";
import { FiEdit } from "react-icons/fi";
import EditVendorDetails from "./EditVendorDetails";

export default function ViewProduct() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [modalAddVendor, setModalAddVendor] = useState(false);
  const [modalEditVendor, setModalEditVendor] = useState(false);
  const [vendorId, setVendorId] = useState("");

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getSingleDetails = async () => {
    try {
      const response = await singleProductGetFunction(id);

      if (response.status === 200) {
        setData(response.data?.product);
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

  const handleClickAddVendor = () => {
    setModalAddVendor(true);
  };

  const handleClickEditVendor = (vendorId) => {
    setVendorId(vendorId);
    setModalEditVendor(true);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {loading ? (
          <p className="text-center text-xl font-bold">Loading...</p>
        ) : (
          <>
            <BreadCrumb pageName="Product View" />
            <BackButton link="products" />
            <div className="mb-4">
              <button
                className="p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit"
                onClick={() => handleClickAddVendor()}
              >
                Add vendor details
              </button>
            </div>
            {data ? (
              <div className="bg-white p-6 rounded-md shadow-md">
                <div className="flex justify-between mb-6">
                  <div className="space-y-2">
                    {data?.inventoryProductName && (
                      <h3 className="text-2xl font-bold">
                        {data.inventoryProductName}
                      </h3>
                    )}
                    {data?.inventoryProductDescription && (
                      <p>{data.inventoryProductDescription}</p>
                    )}
                    {data?.inventoryCategory?.inventoryCategoryName && (
                      <p>
                        Category: {data.inventoryCategory.inventoryCategoryName}
                      </p>
                    )}
                    {data?.inventoryProductQuantity &&
                      data?.inventoryProductUnit?.inventoryUnitName && (
                        <p>
                          Quantity: {data.inventoryProductQuantity} (
                          {data.inventoryProductUnit.inventoryUnitName})
                        </p>
                      )}
                    <p>Cost Price: ₹ {data.inventoryCostPrice}</p>
                    <p>Selling Price: ₹ {data.inventorySellingPrice}</p>
                    <p>GST Percent: {data.gstPercent}%</p>
                    <p>GST Amount: ₹ {data.gstAmount}</p>
                    {data?.inventoryHSNCode && (
                      <p>HSN Code: {data.inventoryHSNCode}</p>
                    )}
                    {data?.inventoryBarCodeId && (
                      <p>Product Code: {data.inventoryBarCodeId}</p>
                    )}
                    {data?.inventoryCategory?.inventoryType !== "Kitchen" && (
                      <img src={data.inventoryBarCode} alt="BarCode" />
                    )}
                  </div>

                  <div className="space-y-3 min-w-40">
                    <h3 className="text-xl font-bold">Product Image</h3>
                    {data?.inventoryProductImageUrl ? (
                      <img
                        src={data.inventoryProductImageUrl}
                        alt={data.inventoryProductName}
                        className="w-36 h-auto"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                </div>

                {data?.vendorDetails.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold ">Vendor Details</h3>
                    {data?.vendorDetails.map((item) => (
                      <div className="pb-4 flex gap-5" key={item._id}>
                        <div>
                          {item.name && <p>Vendor Name: {item.name}</p>}
                          {item.landingCost && (
                            <p>Landing Cost: {item.landingCost}</p>
                          )}
                          {item.contact && <p>Contact: {item.contact}</p>}
                          {item.address && <p>Address: {item.address}</p>}
                          {item.city && <p>City: {item.city}</p>}
                          {item.batchNumber && (
                            <p>Batch Number: {item.batchNumber}</p>
                          )}
                          {item.manufacturedDate && (
                            <p>
                              Manufactured Date:{" "}
                              {formatDate(item.manufacturedDate)}
                            </p>
                          )}
                          {item.expiryDate && (
                            <p>Expiry Date: {formatDate(item.expiryDate)}</p>
                          )}
                          {item.gst && <p>GST: {item.gst}</p>}
                          {item.igst && <p>IGST: {item.igst}</p>}
                        </div>

                        <div className="mb-4">
                          <button
                            className="p-2 text-center text-white bg-black hover:bg-white hover:text-black hover:duration-500 w-fit"
                            onClick={() => handleClickEditVendor(item._id)}
                          >
                            <FiEdit />
                          </button>
                        </div>
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

      {modalAddVendor && (
        <AddVendorDetails
          showModal={modalAddVendor}
          setShowModal={setModalAddVendor}
          productId={id}
          getSingleDetails={getSingleDetails}
        />
      )}
      {modalEditVendor && (
        <EditVendorDetails
          showModal={modalEditVendor}
          setShowModal={setModalEditVendor}
          productId={id}
          vendorId={vendorId}
          vendorData={data?.vendorDetails}
          getSingleDetails={getSingleDetails}
        />
      )}
    </Layout>
  );
}
