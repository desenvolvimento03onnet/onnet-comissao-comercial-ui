import axios from "axios";

const insereLogUsuario = async (date, type, id_user, description) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/InsertUserLog?date=${date}&type=${type}&id_user=${id_user}&description=${description}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao inserir Log: ", error);
    throw error;
  }
};

export default insereLogUsuario;