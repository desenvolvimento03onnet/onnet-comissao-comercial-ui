import axios from "axios";

export const loadGraficoTotalVendasUsuario = async (user) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/SellUserChart?user=${user}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar o login:", error);
    throw error;
  }
};