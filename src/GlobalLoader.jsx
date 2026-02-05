import { useLoader } from "./LoaderContext";
import './globalloader.css'

const GlobalLoader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="lodingicon">
      <div className="loadspinner"></div>
      <p>Uploading . . . </p>
    </div>
  );
};


export default GlobalLoader;
