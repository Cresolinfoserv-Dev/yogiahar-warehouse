import loadingImage from "../../assets/Rolling.svg";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <img src={loadingImage} alt="Loading..." className="w-20 h-20" />
    </div>
  );
};

export default Loading;
