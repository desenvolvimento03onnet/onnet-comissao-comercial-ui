import axios from "axios";

export const loadCidades = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/SelectAllCity`);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar o login:", error);
    throw error;
  }
};