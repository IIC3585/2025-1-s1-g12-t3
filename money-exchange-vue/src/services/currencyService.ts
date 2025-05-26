import axios from "axios";

const OPEN_EXCHANGE_APPID = import.meta.env.VITE_OPEN_EXCHANGE_API_ID;
const OPEN_EXCHANGE_BASE_URL = `https://openexchangerates.org/api`;
const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const currencyService = {
  async getSupportedCurrencies() {
    try {
      const response = await axios.get(`${BASE_URL}/codes`);
      const result: [string, string][] = response.data.supported_codes;

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

  async getExchangeRate(baseCurrency: string, targetCurrency: string) {
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

  async getLastUpdate(baseCurrency: string) {
    try {
      const response = await axios.get(`${BASE_URL}/latest/${baseCurrency}`);
      return response.data.time_last_update_utc;
    } catch (error) {
      console.error("Error al obtener la fecha de actualización:", error);
      return null;
    }
  },

  async getHistoricalRate(baseCurrency: string, targetCurrency: string, date: string) {
    try {
      let params = {
        base : baseCurrency,
        symbols : targetCurrency,
        show_alternative : true,
      };
      let requestConfig = {
        method: "get",
        url: `${OPEN_EXCHANGE_BASE_URL}/historical/${date}.json`,
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

  async getHistoricalRates(baseCurrency: string, targetCurrency: string, dates: string[]) {
    return Promise.all(
      dates.map((date) => this.getHistoricalRate(baseCurrency, targetCurrency, date))
    )
      .then((responses) => {
        return responses.map((response, idx) => {
          const rate = response.data.rates[targetCurrency];
          return { date: new Date(dates[idx]), rate: rate };
        });
      })
      .catch((error) => {
        console.error("Error al obtener las tasas de cambio históricas:", error);
        throw error;
      });
  },

};

export default currencyService;
