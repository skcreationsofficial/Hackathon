import axios, {type AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import type {ApiConfig} from '../interfaces/components/Table'

export interface ApiResponse<T = unknown> {
  code: number;
  status: 'success' | 'failure';
  message: string;
  data: T;
}

// method : any = "", 
//   url : any = "", 
//   params : any = {}, 
//   data : any = {}, 
//   headers : any = {}, 
//   setLoading: any = ()=>{},
//   toastEnabled: boolean = false

const useApiRequest = async (config: ApiConfig) => {
    
  try {

    config?.setLoading?.(true);

    const response = await axios(config);
    const result = response.data;

    if (result?.status?.toLowerCase() == "success") {
      config?.toastEnabled && toast.success(result?.message);
    } else {
      config?.toastEnabled && toast.error(result?.message);
    }
    return result;

  } catch (error) {

    config?.toastEnabled && toast.error("Something went wrong!");
    return error;

  } finally {

    config?.setLoading?.(false);

  }

};

export default useApiRequest;