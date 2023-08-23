import { axiosPrivate } from "../api/AxiosConfig";
import { useEffect } from "react";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          const token = auth?.jwtToken;

          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Return a cleanup function to remove the interceptor when the component unmounts
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
    };
  }, [auth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
