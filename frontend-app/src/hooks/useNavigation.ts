import { useState, useCallback } from "react";

export function useNavigation(){

  const [route, setRoute] = useState("Home");
  const selectAction = useCallback(
    (option: string) => {
      if (route === option) return;
      setRoute(option);
    },
    [route]
  );

  return { currentRoute: route, setCurrentRoute: selectAction }
}