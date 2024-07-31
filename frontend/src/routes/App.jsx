import React from 'react';
import './App.css';
import sampleImage from '../assets/logoUBBfondo.png';

function App() {
  return (
    <div>
      <div className="container">
        <div className="text-container">
          <h1 className="left-text">Préstamo Uso instalaciones e implementos deportivos</h1>
        </div>
        <div className="image-container">
          <img src={sampleImage} alt="Decorative" className="decorative-image" />
        </div>
      </div>
      <footer className="footer">
        Ingenieria de Software
      </footer>
    </div>
  );
}

export default App;
