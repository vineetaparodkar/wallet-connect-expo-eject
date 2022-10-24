import axios from "axios";

const api = axios.create({
  baseURL: "https://ethereum-api.xyz",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const apiGetGasPrices = async () => {
  const response = await api.get(`/gas-prices`);
  const { result } = response.data;
  return result;
};
