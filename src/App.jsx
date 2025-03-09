import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import About from './pages/About';
// import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import { config } from '../config';

function App() {
  console.log('Backend URL:', config.API_URL);

  return (
    <div className="App">
      {/* <Navbar /> */}
      <Routes>
        {/* Set SignUp as the root route */}
        <Route path="/" element={<SignUp />} />
        {/* <Route path="/home" element={<Home />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/signup" element={<SignUp />} /> {/* Keep this for explicit /signup access */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;