import "./style.css";
import * as Icon from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

const LateralNavbar = () => {
  const isLoggedIn = useAppSelector((state) => state.user.successfullyLoggedIn);
  return (
    <div
      id="navbar-container"
      className={isLoggedIn === true ? "d-block" : "d-none"}
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "activeClassName" : "linkDesign"
        }
      >
        <div className="d-flex align-items-center my-3">
          <Icon.HouseHeartFill className="navbar-icons mr-2" />
          <span>Home</span>
        </div>
      </NavLink>
      <NavLink
        to="/movies"
        className={({ isActive }) =>
          isActive ? "activeClassName" : "linkDesign"
        }
      >
        <div className="d-flex align-items-center mb-3">
          <Icon.Film className="navbar-icons mr-2" />
          <span>My movies</span>
        </div>
      </NavLink>
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          isActive ? "activeClassName" : "linkDesign"
        }
      >
        <div className="d-flex align-items-center mb-3">
          <Icon.GlobeEuropeAfrica className="navbar-icons mr-2" />
          <span>Discover</span>
        </div>
      </NavLink>
      <NavLink
        to="/me/profile"
        className={({ isActive }) =>
          isActive ? "activeClassName" : "linkDesign"
        }
      >
        <div className="d-flex align-items-center mb-3">
          <Icon.PersonCircle className="navbar-icons mr-2" />
          <span>My Profile</span>
        </div>
      </NavLink>
      <NavLink
        to="/friends"
        className={({ isActive }) =>
          isActive ? "activeClassName" : "linkDesign"
        }
      >
        <div className="d-flex align-items-center mb-3">
          <Icon.PeopleFill className="navbar-icons mr-2" />
          <span>Friends</span>
        </div>
      </NavLink>
      <NavLink
        to="/logOut"
        className={({ isActive }) =>
          isActive ? "activeClassName" : "linkDesign"
        }
      >
        <div className="d-flex align-items-center mb-3">
          <Icon.DoorOpenFill className="navbar-icons mr-2" />
          <span>Log out</span>
        </div>
      </NavLink>
    </div>
  );
};

export default LateralNavbar;
