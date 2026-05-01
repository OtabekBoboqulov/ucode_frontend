import React, {useEffect} from 'react';
import Index from './pages/index.jsx';
import { getTheme, setTheme } from './utils/theme-utils.jsx';

const App = () => {
  useEffect(() => {
    const theme = getTheme();
    setTheme(theme);
  }, []);

  return (
    <div>
      <Index />
    </div>
  );
};

export default App;