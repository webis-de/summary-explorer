import React, { useMemo } from "react";

import useAsync from "../hooks/useAsync";
import { get } from "../request";

const DatasetsContext = React.createContext();

function getDatasets() {
  return get("/api/datasets");
}

function DatasetsProvider({ children }) {
  const results = useAsync(getDatasets);
  const renamed = useMemo(() => {
    const { loading, value, error } = results;
    const { datasets } = value ?? {};
    return { loading, datasets, error };
  }, [results]);
  return (
    <DatasetsContext.Provider value={renamed}>
      {children}
    </DatasetsContext.Provider>
  );
}

export { DatasetsContext, DatasetsProvider };
