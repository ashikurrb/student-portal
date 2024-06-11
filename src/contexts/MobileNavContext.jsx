import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context object
const MobileNavContext = createContext();

// Create a custom hook to use the MobileNavContext
export const useMobileNav = () => {
  return useContext(MobileNavContext);
};

// Create a provider component
export const MobileNavProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  const contextValue = {
    isActive,
    handleClick,
  };

  return (
    <MobileNavContext.Provider value={contextValue}>
      {children}
    </MobileNavContext.Provider>
  );
};

// Export MobileNavProvider as default export
export default MobileNavProvider;
