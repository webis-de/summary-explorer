import { useEffect, useState } from "react";

const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    asyncFunction()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [asyncFunction]);
  return { loading, value, error };
};

export default useAsync;
