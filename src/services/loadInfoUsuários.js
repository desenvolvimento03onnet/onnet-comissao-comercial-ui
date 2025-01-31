import axios from "axios";

export const loadInfoUsuario = async (user, password) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/SelectUser?user=${user}&password=${password}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar o login:", error);
    throw error;
  }
};