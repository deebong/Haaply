import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { StoreProvider } from './providers/StoreProvider.tsx';
import { ConfigProvider } from './providers/ConfigProvider.tsx';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { DataProvider } from './providers/DataProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ConfigProvider>
        <ThemeProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </ThemeProvider>
      </ConfigProvider>
    </StoreProvider>
  </StrictMode>,
);
