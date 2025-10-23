import MainLayout from "../Layout/MainLayout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import DashboardLayout from "../Layout/DashboardLayout";
import ProductDetails from "../components/ProductDetails";
import PrivateRoute from "./PrivateRoute";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import PaymentHistory from "../pages/Dashboard/User/PaymentHistory";
import SellerRequest from "../pages/Dashboard/User/SellerRequest";
import Payment from "../pages/Dashboard/Payment/Payment";
import ProfilePage from "../pages/Dashboard/User/ProfilePage";
import ProductTracking from "../pages/Dashboard/User/ProductTracking";
import MyProducts from "../pages/Dashboard/Seller/MyProducts";
import AddProduct from "../pages/Dashboard/Seller/AddProduct";
import CustomerOrders from "../pages/Dashboard/Seller/CustomerOrders";
import SalesAnalytics from "../pages/Dashboard/Seller/SalesAnalytics";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllSellers from "../pages/Dashboard/Admin/AllSellers";
import AllProducts from "../pages/Dashboard/Admin/AllProducts";
import Reports from "../pages/Dashboard/Admin/Reports";
import SellerRequestsAdmin from "../pages/Dashboard/Admin/SellerRequestsAdmin";
import EditProduct from "../pages/Dashboard/Seller/EditProduct";
import SellerRoute from "./SellerRoute";
import AdminRoute from "./AdminRoute";
import AdminUpdateProduct from "../pages/Dashboard/Admin/AdminUpdateProduct";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: 'products',
        element: <Products></Products>
      },
      {
        path: 'products/:id',
        element: <ProductDetails></ProductDetails>
      },
      {
        path: 'about',
        element: <About></About>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      // user route
      {
        path: 'orders',
        element: <PrivateRoute><MyOrders></MyOrders></PrivateRoute>
      },
      {
        path: 'payment/:id',
        element: <PrivateRoute><Payment></Payment></PrivateRoute>
      },
      {
        path: 'payment-history',
        element: <PrivateRoute><PaymentHistory></PaymentHistory></PrivateRoute>
      },
      {
        path: 'order-tracking',
        element: <PrivateRoute><ProductTracking></ProductTracking></PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute><ProfilePage></ProfilePage></PrivateRoute>
      },
      {
        path: 'seller-request',
        element: <PrivateRoute><SellerRequest></SellerRequest></PrivateRoute>
      },
      // seller route 
      {
        path: 'seller/products',
        element: <SellerRoute><MyProducts></MyProducts></SellerRoute>
      },
      {
        path: 'seller/edit-product/:id',
        element: <SellerRoute><EditProduct></EditProduct></SellerRoute>
      },
      {
        path: 'seller/add-product',
        element: <SellerRoute><AddProduct></AddProduct></SellerRoute>
      },
      {
        path: 'seller/orders',
        element: <CustomerOrders></CustomerOrders>
      },
      {
        path: 'seller/analytics',
        element: <SellerRoute><SalesAnalytics></SalesAnalytics></SellerRoute>
      },
      {
        path: 'profile',
        element: <ProfilePage></ProfilePage>
      },
      // admin route
      {
        path: 'admin/all-users',
        element: <AdminRoute><AllUsers></AllUsers></AdminRoute>
      },
      {
        path: 'admin/all-sellers',
        element: <AdminRoute><AllSellers></AllSellers></AdminRoute>
      },
      {
        path: 'admin/all-products',
        element: <AdminRoute><AllProducts></AllProducts></AdminRoute>
      },
      {
        path: 'admin/update-product/:id',
        element: <AdminRoute><AdminUpdateProduct></AdminUpdateProduct></AdminRoute>
      },
      {
        path: 'admin/reports',
        element: <AdminRoute><Reports></Reports></AdminRoute>
      },
      {
        path: 'admin/seller-request-admin',
        element: <AdminRoute><SellerRequestsAdmin></SellerRequestsAdmin></AdminRoute>
      },
      {
        path: 'profile',
        element: <ProfilePage></ProfilePage>
      }
    ]
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/register',
    element: <Register></Register>
  }
])

export default router;