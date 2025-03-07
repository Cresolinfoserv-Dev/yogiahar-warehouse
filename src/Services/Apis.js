import { BASE_URL } from "./Helper";
import { commonRequest } from "./ApiCall";

// Login Function

export const adminLoginFunction = async (data, header) => {
  return await commonRequest("POST", `${BASE_URL}/login`, data, header);
};

// Create Category Function

export const createCategoryFunction = async (data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/category/create`,
    data,
    header
  );
};

// Filtered Category By Role

export const getCategoryFunction = async (categoryName) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/category/filter/${categoryName}`
  );
};

// Update category Function

export const categoryUpdateFunction = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/category/update/${id}`,
    data,
    header
  );
};

// Get Single category Function

export const singleCategoryGetFunction = async (id) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/category/get/${id}`,
    ""
  );
};

// Update Category Status Function

export const categoryUpdateStatusFunction = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/category/status/${id}`,
    data,
    header
  );
};

// Create Products Function

export const createProductsFunction = async (data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/product/add`,
    data,
    header
  );
};
export const createBilkProductsFunction = async (data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/product/bulk/add`,
    data,
    header
  );
};

// Create vendor details Function

export const createVendorDetailsFunction = async (productId, data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/product/vendor/add/${productId}`,
    data,
    header
  );
};
// update vendor details Function

export const updateVendorDetailsFunction = async (
  productId,
  vendorId,
  data,
  header
) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/product/vendor/update/${vendorId}/${productId}`,
    data,
    header
  );
};

// Get Products Function

export const getProductsFunction = async (categoryName) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/product/filter/${categoryName}`
  );
};

// Get Single Product Function

export const singleProductGetFunction = async (id) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/product/get/${id}`,
    ""
  );
};

// Update Product Function

export const productUpdateFunction = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/product/update/${id}`,
    data,
    header
  );
};

// Update product Status Function

export const productUpdateStatusFunction = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/product/status/${id}`,
    data,
    header
  );
};

// Add Units

export const createUnitsCodes = async (data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/unit/add`,
    data,
    header
  );
};

// Units

// Filtered Category By Role

export const getUnitsFunction = async (categoryName) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/unit/filter/get/${categoryName}`
  );
};
// Single Unit By ID

export const singleUnitGetFunction = async (id) => {
  return await commonRequest("GET", `${BASE_URL}/inventory/unit/get/${id}`, "");
};

// Update Unit By ID

export const unitUpdateFunction = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/unit/update/${id}`,
    data,
    header
  );
};

// Status Update Unit By ID

export const unitStatusUpdateFunction = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/unit/status/${id}`,
    data,
    header
  );
};

// Add Quantity To Inventory

export const createStock = async (data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/stock/add`,
    data,
    header
  );
};

// Send Stock

export const sendStockFunction = async (data, header) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/inventory/stock/send`,
    data,
    header
  );
};

// Stock Orders

export const getStockOrdersFunction = async (categoryName) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/stock/order/get/${categoryName}`
  );
};

// Single Stock Order By Order ID

export const singleStockOrderFunction = async (id) => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/inventory/stock/get/${id}`,
    ""
  );
};

// Change Order Status By Order ID

export const changeOrderStatusByID = async (id, data, header) => {
  return await commonRequest(
    "PUT",
    `${BASE_URL}/inventory/stock/status/${id}`,
    data,
    header
  );
};

// Get Boutique Employees

export const getBoutiqueEmployeesFunction = async (data) => {
  return await commonRequest("GET", `${BASE_URL}/boutique/owners`, data);
};

// Get Cafe Employees

export const getCafeEmployeesFunction = async (data) => {
  return await commonRequest("GET", `${BASE_URL}/cafe/owners`, data);
};
