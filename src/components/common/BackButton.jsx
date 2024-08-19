import PropTypes from "prop-types";
import { MdArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";

const BackButton = (props) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link
        to={`/${props.link}`}
        className="font-semibold text-black flex items-center gap-1 "
      >
        <MdArrowBackIos />
        <h2>Back</h2>
      </Link>
    </div>
  );
};

export default BackButton;

BackButton.propTypes = {
  link: PropTypes.string.isRequired,
};
