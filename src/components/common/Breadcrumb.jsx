import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function BreadCrumb(props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="font-semibold text-black ">{props.pageName}</h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/dashboard">Dashboard /</Link>
          </li>
          <li className="text-primary">{props.pageName}</li>
        </ol>
      </nav>
    </div>
  );
}

BreadCrumb.propTypes = {
  pageName: PropTypes.string.isRequired,
};
