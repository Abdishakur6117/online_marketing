import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import MarketerDashboard from "./pages/dashboards/MarketerDashboard";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import AdminLayout from "./components/layout/AdminLayout";
import MarketerLayout from "./components/layout/MarketerLayout";
import CustomerLayout from "./components/layout/CustomerLayout";
import AdminAccount from "./pages/admin/AdminAccount";
import MarketerAccount from "./pages/marketer/marketerAccount";
import CustomerAccount from "./pages/customer/customerAccount";
import AdminChangePassword from "./pages/admin/change-password";
import MarketerChangePassword from "./pages/marketer/change-password";
import CustomerChangePassword from "./pages/customer/change-password";
import AdminUsers from "./pages/admin/users";
import AdminProducts from "./pages/admin/products";
import AdminCampaigns from "./pages/admin/campaigns";
import AdminOrders from "./pages/admin/orders";
import CustomerReport from "./pages/admin/report/customers";
import MarketerReport from "./pages/admin/report/marketer";
import CustomerDetails from "./pages/CustomerDetails";
import MarketerDetails from "./pages/MarketerDetails";
import MarketerCampaignList from "./pages/marketer/campaigns";
import MarketerProducts from "./pages/marketer/products";
import MarketerProductOrders from "./pages/marketer/productOrders";
import CustomerOrders from "./pages/customer/orders";
import CustomerOrderDetails from "./pages/customer/orderDetails";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";



export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} /> {/* Home page route */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/customer-details/:id" element={<CustomerDetails />} />
      <Route path="/MarketerDetails/:id" element={<MarketerDetails />} />
      {/* <Route path="/change-password" element={<ChangePassword />} /> */}
      {/* Protected Routes with Layouts and nested dashboards */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="/admin/account" element={<AdminAccount />} />
        <Route
          path="/admin/change-password"
          element={<AdminChangePassword />}
        />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="/admin/report/customers" element={<CustomerReport />} />
        <Route path="/admin/report/marketer" element={<MarketerReport />} />

        {/* Haddii aad rabto routes kale hoos admin, halkan ku dar */}
      </Route>
      <Route
        path="/marketer"
        element={
          <PrivateRoute role="marketer">
            <MarketerLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<MarketerDashboard />} />
        <Route path="/marketer/account" element={<MarketerAccount />} />
        <Route
          path="/marketer/change-password"
          element={<MarketerChangePassword />}
        />
        <Route path="campaigns" element={<MarketerCampaignList />} />
        <Route path="products" element={<MarketerProducts />} />
        <Route path="productOrders" element={<MarketerProductOrders />} />
        <Route path="/marketer/report/customers" element={<CustomerReport />} />
      </Route>
      <Route
        path="/customer"
        element={
          <PrivateRoute role="customer">
            <CustomerLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="/customer/account" element={<CustomerAccount />} />
        <Route
          path="/customer/change-password"
          element={<CustomerChangePassword />}
        />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="orderDetails" element={<CustomerOrderDetails />} />
      </Route>
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
