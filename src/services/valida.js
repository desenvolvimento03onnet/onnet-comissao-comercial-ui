import axios from "axios";
import { Buffer } from 'buffer';

sessionStorage.clear();

const valida = async (user, senha) => {
  const password = Buffer.from(senha, 'utf-8').toString('base64');
  try {
    sessionStorage.setItem(1,password);
    const response = await axios.get(`http://localhost:3000/api/SelectUser?user=${user}&password=${password}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar o login:", error);
    throw error;
  }
};

export default valida;