import "./App.css";
import LateralNavbar from "./components/navbar/LateralNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./components/profile/ProfilePage";
import LogIn from "./components/login/LogIn";
import Register from "./components/login/Register";
import Home from "./components/home/Home";
import ProtectedRoute from "./components/helpers/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect } from "react";
import {
  editProfileInfoAction,
  editProfilePhotoAction,
  getMyProfileAction,
} from "./redux/actions";
import EditProfileInput from "./components/profile/EditProfileInput";
import Movies from "./components/movies/Movies";
import SingleMoviePage from "./components/movies/SingleMoviePage";
import FriendsPage from "./components/friends/FriendsPage";
import SingleUserPage from "./components/friends/SingleUserPage";
import DiscoverPage from "./components/discover/DiscoverPage";

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.successfullyLoggedIn);
  const profileInfoEditSuccessfully = useAppSelector(
    (state) => state.user.editProfileInfoSuccessfully
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getMyProfileAction());
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <LateralNavbar />
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/:movieId"
          element={
            <ProtectedRoute>
              <SingleMoviePage></SingleMoviePage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {
          /* <Route
          path="/me/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        /> */
          <Route
            path="/me/profile/:friendId"
            element={
              <ProtectedRoute>
                <SingleUserPage />
              </ProtectedRoute>
            }
          />
        }
        <Route
          path="/me/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfileInput />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/friends/:friendId"
          element={
            <ProtectedRoute>
              <SingleUserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
