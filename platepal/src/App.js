import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Recipes from './components/Recipes';
import ExpandedRecipe from './components/ExpandedRecipe';
import Profile from './components/Profile';
import Login from './components/Login';
import Logout from './components/Logout';
import Footer from './components/Footer';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="App">
        <Header toggleMenu={toggleMenu} isOpen={isOpen} />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:recipeId" element={<ExpandedRecipe />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
