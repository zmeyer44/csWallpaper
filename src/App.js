import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Home from "./pages";
import Banner from "./pages/banner";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
