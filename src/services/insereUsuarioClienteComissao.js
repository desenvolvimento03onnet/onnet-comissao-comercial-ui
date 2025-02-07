import axios from "axios";

const insereUsuarioClienteComissao = async (id_user, id_client, comission_value, created_at) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/InsertUserClientComission?id_user=${id_user}&id_client=${id_client}&comission_value=${comission_value}&created_at=${created_at}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao inserir Comissão do Usuário no Cliente: ", error);
    throw error;
  }
};

export default insereUsuarioClienteComissao;