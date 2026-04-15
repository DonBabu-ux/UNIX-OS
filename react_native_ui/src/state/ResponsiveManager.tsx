import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

interface ResponsiveContextType {
  isMobile: boolean;
  screenWidth: number;
  screenHeight: number;
}

const ResponsiveContext = createContext<ResponsiveContextType>({
  isMobile: false,
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
});

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(width < 768);

  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  return (
    <ResponsiveContext.Provider value={{ isMobile, screenWidth: width, screenHeight: height }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => useContext(ResponsiveContext);
