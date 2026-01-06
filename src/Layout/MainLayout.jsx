import { Outlet } from "react-router-dom";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
