import SideMenu from "../components/common/SideMenu";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <div className="flex">
      <SideMenu />
      <div className="w-full flex flex-col justify-between">
        <div>
          <Header />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
