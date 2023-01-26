import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";
import {BrowserHistory} from "history";

interface CustomRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
    history: BrowserHistory,
}

export const CustomRouter = ({  basename, children, window, history}: CustomRouterProps) => {
    const [state, setState] = useState({
      action: history.action,
      location: history.location
    });
  
    useLayoutEffect(() => history.listen(setState), [history]);
  
    return (
      <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
      />
    );
  };