import axios from "axios";
import { Buffer } from 'buffer';

const valida = async (user, senha) => {
  // console.log(Buffer.from('teste4', 'utf-8').toString('base64'));
  // console.log(Buffer.from('dGVzdGU=', 'base64').toString('utf8'));
  const password = Buffer.from(senha, 'utf-8').toString('base64');
  try {
    sessionStorage.setItem(1,password);
    const response = await axios.get(`http://localhost:3000/api/SelectUserPermission?user=${user}&password=${password}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar o login:", error);
    throw error;
  }
};

export default valida;