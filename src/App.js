import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Home from "./pages";
import Banner from "./pages/banner";
import Combine from "./pages/combine";
import OgXDemonic from "./pages/ogxdemonic";
import DemonicCombine from "./pages/demoniccombine";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>Crypto Skulls</title>
        <meta name="description" content="Crypto SKulls generation" />
      </Helmet>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="banner" element={<Banner />} />
        <Route path="combine" element={<Combine />} />

        <Route path="ogxdemonic" element={<OgXDemonic />} />
        <Route path="demonic-combine" element={<DemonicCombine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
