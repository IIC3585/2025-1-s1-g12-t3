import axios from "axios";

const OPEN_EXCHANGE_APPID = import.meta.env.VITE_OPEN_EXCHANGE_API_ID;
const OPEN_EXCHANGE_BASE_URL = `https://openexchangerates.org/api`;
const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;


const currencyService = {
  async getSupportedCurrencies() {
    try {
      const response = await axios.get(`${BASE_URL}/codes`);
      const result = response.data.supported_codes;

      // Mapea a objetos { value, label }
      return result.map(([code, name]) => ({
        value: code,
        label: `${code} - ${name}`,
      }));
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
      throw error;
    }
  },

  async getExchangeRate(baseCurrency, targetCurrency) {
    try {
      const response = await axios.get(
        `${BASE_URL}/pair/${baseCurrency}/${targetCurrency}`
      );
      return response.data.conversion_rate;
    } catch (error) {
      console.error("Error al obtener la tasa de cambio:", error);
      throw error;
    }
  },

  async getLastUpdate(baseCurrency) {
    try {
      const response = await axios.get(`${BASE_URL}/latest/${baseCurrency}`);
      return response.data.time_last_update_utc;
    } catch (error) {
      console.error("Error al obtener la fecha de actualización:", error);
      return null;
    }
  },

  async getHistoricalRates(baseCurrency, targetCurrency, startDate, endDate) {
    try {
      console.log("Open:", OPEN_EXCHANGE_APPID)
      let params = {
        // app_id : OPEN_EXCHANGE_APPID,
        start : startDate,
        end : endDate,
        base : baseCurrency,
        symbols : targetCurrency,
        show_alternative : true,
      };
      let requestConfig = {
        method: "get",
        url: `${OPEN_EXCHANGE_BASE_URL}/time-series.json`,
        params: params,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${OPEN_EXCHANGE_APPID}`
        },
      };
      const response = await axios.request(requestConfig);
      return response;
    } catch (error) {
      console.error("Error al obtener la tasa de cambio histórica:", error);
      throw error;
    }
  },

};

export default currencyService;
