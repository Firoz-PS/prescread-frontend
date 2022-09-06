import { BrowserRouter, Routes, Route} from "react-router-dom";
import Main from "./Pages/Main/Main";
import Result from "./Pages/Result/Result";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
