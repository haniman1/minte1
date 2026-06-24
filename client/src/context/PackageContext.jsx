import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const PackageContext = createContext(null);

export const usePackages = () => {
  const context = useContext(PackageContext);

  if (!context) {
    throw new Error("usePackages must be used inside PackageProvider");
  }

  return context;
};

export const PackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await api.get("/packages");

      setPackages((prev) => {
        const same = JSON.stringify(prev) === JSON.stringify(res.data);

        return same ? prev : res.data;
      });
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <PackageContext.Provider
      value={{
        packages,
        setPackages,
        fetchPackages,
        loading,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};
