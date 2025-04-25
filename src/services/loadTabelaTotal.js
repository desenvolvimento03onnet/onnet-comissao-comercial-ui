import axios from "axios";

export const loadTabelaAll = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/AllTable`);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar o login:", error);
    throw error;
  }
};