import { useEffect } from "react";
import { getMyProfileAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import "./style.css";

const Home = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMyProfileAction());
  }, []);
  return <div>home page</div>;
};

export default Home;
