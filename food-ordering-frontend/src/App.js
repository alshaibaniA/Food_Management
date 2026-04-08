import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import OrderPage from './OrderPage';
import DineInOrder from './DineInOrder';
import ItemList from './ItemList';
import AddItemForm from './AddItemForm';
import PendingOrder from './PendingOrder';
import UnderProcessOrder from './UnderProcessOrder';
import SuccessfulOrder from './SuccessfulOrder';
import DoneOrder from './DoneOrder';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import UserList from './UserList';
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component
import AboutUs from './AboutUs';
function App() {
  const [user, setUser] = useState(null); // User state to track the logged-in user
  const [loading, setLoading] = useState(true); // Loading state to handle initial render
  const navigate = useNavigate(); // Hook to navigate to other routes
  const location = useLocation(); // Hook to get the current route

  // Check for user in localStorage on app load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser); // Set the user state if found in localStorage
    }
    setLoading(false); // Done loading after the check
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('user'); // Remove user from localStorage
    setUser(null);  // Clear the user state
    navigate('/login');  // Redirect to login page
  };

  // Check if the current route is /place-order
  const isPlaceOrderPage = location.pathname === "/takeAway-order";
  const isPlaceDineInOrder = location.pathname === "/dineIn-order";

  // Function to navigate to different routes
  const navigateTo = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator until localStorage is checked
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <img src="/image/myLogo.jpg" alt="Logo" className="App-logo" />
        <h1 lang="ar">ألوان الطعام</h1>
      </header>

      {/* Navigation Buttons */}
      <nav>
        <div className="nav-list">
          {/* Place Order Button */}
          <button onClick={() => navigateTo("/takeAway-order")} className="nav-button">للطلبات الخارجية</button>
          <button onClick={() => navigateTo("/dineIn-order")} className="nav-button">للطلبات المحلي</button>

          {user && user.role === 'ADMIN' && (
            <>
              {/* Admin-specific buttons */}
              <button onClick={() => navigateTo("/items")} className="nav-button">المنيو</button>
              <button onClick={() => navigateTo("/admins")} className="nav-button">الموظفين</button>
              <button onClick={() => navigateTo("/add-item")} className="nav-button">أضف منتج</button>
              <button onClick={() => navigateTo("/pending-orders")} className="nav-button">قائمة الانتظار</button>
              <button onClick={() => navigateTo("/under-process-orders")} className="nav-button">تحت الاجراء</button>
              <button onClick={() => navigateTo("/successful-orders")} className="nav-button">منجزة</button>
              <button onClick={() => navigateTo("/done-orders")} className="nav-button">احصائية الطلبات</button>
            </>
          )}

          {user && user.role === 'USER' && (
            <>
              {/* User-specific buttons */}
              <button onClick={() => navigateTo("/pending-orders")} className="nav-button">Pending Orders</button>
              <button onClick={() => navigateTo("/under-process-orders")} className="nav-button">Under Process Orders</button>
              <button onClick={() => navigateTo("/successful-orders")} className="nav-button">Successful Orders</button>
            </>
          )}
        {/* About Us Button */}
            <button onClick={() => navigateTo("/about-us")} className="nav-button">من نحن</button> {/* Add this button for About Us */}

          {/* Logout Button */}
          {user ? (
            <button onClick={handleLogout} className="nav-button">Logout</button>
          ) : (
            // Only show the Login button if the user is not on the place-order page
            //!isPlaceOrderPage && !isPlaceDineInOrder && (
              //<button onClick={() => navigateTo("/login")} className="nav-button">Login1</button>
           // )
           null)}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<LoginForm setUser={setUser} />} />

        {/* Public signup route */}
        <Route path="/signup" element={<SignUpForm setUser={setUser} />} />

        <Route
          path="/items"
          element={user?.role === 'ADMIN' ? <ItemList /> : <RedirectToLogin />}
        />
        <Route
          path="/admins"
          element={user?.role === 'ADMIN' ? <UserList /> : <RedirectToLogin />}
        />
        <Route
          path="/add-item"
          element={user?.role === 'ADMIN' ? <AddItemForm /> : <RedirectToLogin />}
        />
        <Route path="/takeAway-order" element={<OrderPage />} />
        <Route path="/dineIn-order" element={<DineInOrder />} />

        <Route
          path="/pending-orders"
          element={user ? <PendingOrder /> : <RedirectToLogin />}
        />
        <Route
          path="/under-process-orders"
          element={user ? <UnderProcessOrder /> : <RedirectToLogin />}
        />
        <Route
          path="/successful-orders"
          element={user ? <SuccessfulOrder /> : <RedirectToLogin />}
        />
        <Route
          path="/done-orders"
          element={user?.role === 'ADMIN' ? <DoneOrder /> : <RedirectToLogin />}
        />
        {/* About Us Page */}
          <Route path="/about-us" element={<AboutUs />} /> {/* Add this route for the About Us page */}
      </Routes>
    </div>
  );
}

// Redirect if not authorized
const RedirectToLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  }, [navigate]);
  return <h2>Redirecting to login...</h2>;
};

export default App;
