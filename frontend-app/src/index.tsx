import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { CustomRouter } from './hooks/CustomRouter';
import history from './hooks/history';
import './i18n';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <CustomRouter history={history}>
        <Suspense fallback={<div>Loading language...</div>}>
          <App />  
        </Suspense>
      </CustomRouter>
    </Provider>    
  </PersistGate>
);
