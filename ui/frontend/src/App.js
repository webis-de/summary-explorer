import { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  useLocation,
  useRoutes,
  useSearchParams,
} from "react-router-dom";

import About from "./components/About";
import Credits from "./components/Credits";
import Footer from "./components/Footer";
import LoadingIcon from "./components/icons/LoadingIcon";
import Index from "./components/Index";
import MainView from "./components/MainView";
import Models from "./components/Models";
import Navbar from "./components/Navbar";
import Resolve from "./components/Resolve";
import { DatasetsContext, DatasetsProvider } from "./contexts/datasets";

function ScrollRouterTop({ children }) {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return children;
}

function Router({ children }) {
  return (
    <BrowserRouter>
      <ScrollRouterTop>{children}</ScrollRouterTop>
    </BrowserRouter>
  );
}

function MainViewWrapper() {
  const [search] = useSearchParams();
  const dataset = search.get("dataset");

  // const {loading, value, error} = useAsync()

  // const loadSModelsList = (dataset_id) => {
  //   axios.get(`../api/dataset/${dataset_id}/models`).then((res) => {
  //     setState({
  //       all_models_loaded: true,
  //       all_models: res.data,
  //     });
  //   });
  // };

  // useEffect(() => {
  //   if (token !== null) loadSModelsList(token);
  // }, []);

  if (dataset === null) return <div>dataset parameter is not specified</div>;
  const datasetId = parseInt(dataset, 10);
  if (Number.isNaN(datasetId))
    return <div>dataset parameter needs to be a number</div>;
  return <MainView key={datasetId} dataset_id={datasetId} />;
}

const ROUTES = [
  { path: "/", element: <Index /> },
  { path: "/main", element: <MainViewWrapper /> },
  { path: "/models", element: <Models /> },
  { path: "/article", element: <Resolve /> },
  { path: "/credits", element: <Credits /> },
  { path: "/about", element: <About /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

function Content() {
  const currentRoute = useRoutes(ROUTES);
  const { loading, datasets, error } = useContext(DatasetsContext);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon big />
      </div>
    );

  if (error) return <div>an error occurred: {error.message}</div>;
  return (
    <>
      <div className="mb-16 pb-16">
        <Navbar datasets={datasets} />
        <div className="container mx-auto mt-2 w-full">
          <div className="App">{currentRoute}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <DatasetsProvider>
        <Content />
      </DatasetsProvider>
    </Router>
  );
}

export default App;
