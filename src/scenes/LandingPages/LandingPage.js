import React from 'react';
import Header from './Header';
import Introduction from './Introduction';


// Assuming baseUrl is defined somewhere globally or passed as a prop
const baseUrl = ''; // Update this with your actual base URL

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      <Home />

      {/* Introduction */}
      {/* <Introduction />  */}

      
    </div>
  );
};

export default LandingPage;
