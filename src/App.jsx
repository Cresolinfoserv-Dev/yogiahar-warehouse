import { Route, Routes } from "react-router-dom";
import Cards from "./components/Dashboard/Cards";
import Login from "./components/Login";
import PrivateRoute from "./PrivateRoute";
import GetProducts from "./components/Products/GetProducts";
import AddProducts from "./components/Products/AddNewProduct";
import ViewProduct from "./components/Products/ViewProduct";
import UpdateProduct from "./components/Products/UpdateProduct";
import InStock from "./components/Stock/AddStock/InStock";
import OutStock from "./components/Stock/OutStock/OutStock";
import ProcessingOrders from "./components/Orders/ProcessingOrders";
import CompleteOrders from "./components/Orders/CompleteOrders";
import ReturnedOrders from "./components/Orders/ReturnedOrders";
import GetQuantity from "./components/Quantity/GetQuantity";
import AddQuantity from "./components/Quantity/AddQuantity";
import ViewOrderDetails from "./components/Orders/ViewOrderDetails";
import UpdateQuantity from "./components/Quantity/UpdateQuantity";
import ReturnStock from "./components/Stock/ReturnStock/ReturnStock";
import GetCategories from "./components/Categories/GetCategories";
import AddCategory from "./components/Categories/AddCategory";
import EditCategory from "./components/Categories/EditCategory";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Cards />} />

          {/* categories */}

          <Route path="/get-categories" element={<GetCategories />} />
          <Route path="/add-categories" element={<AddCategory />} />
          <Route path="/edit-categories/:id" element={<EditCategory />} />

          {/* Quantity */}

          <Route path="/get-quantity" element={<GetQuantity />} />
          <Route path="/add-quantity" element={<AddQuantity />} />
          <Route path="/update-quantity/:id" element={<UpdateQuantity />} />

          {/* Products */}

          <Route path="/products" element={<GetProducts />} />
          <Route path="/product/add" element={<AddProducts />} />
          <Route path="/product/view/:id" element={<ViewProduct />} />
          <Route path="/product/update/:id" element={<UpdateProduct />} />

          {/* Stock */}

          <Route path="/in-stock" element={<InStock />} />
          <Route path="/out-stock" element={<OutStock />} />
          <Route path="/return-stock" element={<ReturnStock />} />

          {/* Orders */}

          <Route path="/view-order/:id" element={<ViewOrderDetails />} />
          <Route path="/processing-orders" element={<ProcessingOrders />} />
          <Route path="/completed-orders" element={<CompleteOrders />} />
          <Route path="/returned-orders" element={<ReturnedOrders />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
