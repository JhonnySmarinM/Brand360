import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrandAIModule from './components/BrandAIModule';
import IntroAnimation from './components/IntroAnimation';
// import Auth from './components/auth/Auth'

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} enableSkip={true} />;
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={4000} />
      {/* <Auth /> */}
      <BrandAIModule />
    </div>
  );
}

export default App
