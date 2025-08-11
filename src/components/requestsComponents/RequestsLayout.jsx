import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Header from "./Header";

const RequestsLayout = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default RequestsLayout;
