import React, { useState } from 'react';
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
      {/* <Auth /> */}
      <BrandAIModule />
    </div>
  );
}

export default App
