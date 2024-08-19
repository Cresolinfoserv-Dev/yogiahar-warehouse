import PropTypes from "prop-types";
import Footer from "./common/Footer";
import Header from "./common/Header";
import SideMenu from "./common/SideMenu";

function Layout({ children }) {
  return (
    <div className="flex">
      <SideMenu />
      <div className="w-full flex flex-col justify-between">
        <div>
          <Header />
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
