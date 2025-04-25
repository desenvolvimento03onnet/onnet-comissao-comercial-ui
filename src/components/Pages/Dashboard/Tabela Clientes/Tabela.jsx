import React from "react";
import { useCSVDownloader } from 'react-papaparse';
import { useState, useEffect } from "react";
import { loadTabelaUsuarios } from "../../../../services/loadTabelaUsuários";
import style from './Tabela.module.css';

const Tabela = ({ filter }) => {
    const [dados, setDados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadTabelaUsuarios(sessionStorage.getItem(0));
          
          const dadosFiltrados = filter.startDate && filter.endDate
            ? carrega.filter(item =>
                new Date(item.date) >= new Date(filter.startDate) &&
                new Date(item.date) <= new Date(filter.endDate)
              )
            : carrega;

          const ordena = [...dadosFiltrados].sort((a, b) => {
            const cidadeComparison = a.city.localeCompare(b.city);
            if (cidadeComparison !== 0) return cidadeComparison;

            // 2️⃣ Se a cidade for igual, ordena por data (mais antiga primeiro)
            const dataComparison = new Date(a.date) - new Date(b.date);
            if (dataComparison !== 0) return dataComparison;

            // 3️⃣ Se a data for igual, ordena por operação (ordem alfabética)
            const operacaoComparison = a.operation.localeCompare(b.operation);
            if (operacaoComparison !== 0) return operacaoComparison;

            // 4️⃣ Se a operação for igual, ordena por nome (ordem alfabética)
            return a.name.localeCompare(b.name);
          });

          setDados(ordena);
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);

    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    
    const itemsPerPage = 10; // Define quantos itens serão exibidos por página

    // Calcular o índice inicial e final dos dados a serem exibidos
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dados.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular o total de páginas
    const totalPages = Math.ceil(dados.length / itemsPerPage);

    // Função para mudar de página
    const nextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const { CSVDownloader, Type } = useCSVDownloader();
    
  return (
      <div id="chart" className={style.Tabela}>
        <div className={style.tableContainer}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Cidade</th>
                <th>Contrato</th>
                <th>Data</th>
                <th>Operação</th>
                <th>Plano</th>
                <th>Valor Plano</th>
                <th>Plano Antigo</th>
                <th>Valor</th>
                <th>Plano Novo</th>
                <th>Valor</th>
                <th>Operador</th>
                <th>Cidade</th>
                <th>Pagamento Recorrente</th>
                <th>TV</th>
                <th>Telefonia</th>
                <th>Fatura</th>
                <th>Pago?</th>
                <th>Data Vencimento</th>
                <th>Comissão</th>
              </tr>
            </thead>
            <tbody className={style.Tbody}>
              {currentItems.map((data, index) => (
                <tr key={index} className={style.Linhas}>
                  <td>{data.codclient}</td>
                  <td>{data.name}</td>
                  <td>{data.city}</td>
                  <td>{data.contract}</td>
                  <td>{new Date(data.date).toLocaleDateString("pt-BR")}</td>
                  <td>{data.operation}</td>
                  <td>{data.plan}</td>
                  <td>R$ {data.plan_value}</td>
                  <td>{data.old_plan ? `${data.old_plan}` : "Venda"}</td>
                  <td>{data.old_plan_value ? `R$ ${data.old_plan_value}` : "Venda"}</td>
                  <td>{data.new_plan ? `${data.new_plan}` : "Venda"}</td>
                  <td>{data.new_plan_value ? `R$ ${data.new_plan_value}` : "Venda"}</td>
                  <td>{data.operator}</td>
                  <td>{data.city_operator}</td>
                  <td>{data.recurring_payment ? "Sim" : "Não"}</td>
                  <td>{data.tv ? "Sim" : "Não"}</td>
                  <td>{data.telephony ? "Sim" : "Não"}</td>
                  <td>{data.invoice}</td>
                  <td>{data.paid ? "Sim" : "Não"}</td>
                  <td>{data.due_date}</td>
                  <td>{data.paid ? (parseFloat(eval(data.comission).toFixed(2)) || 0) : "Cliente Não Pagou"}</td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>

            {/* Controles de Paginação */}
        <div className={style.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Próxima
          </button>
          <CSVDownloader
            className={style.Downloadbtn}
            type={Type.Button}
            filename={'Comissão_'+sessionStorage.getItem(0)+'_'+dataAtual}
            bom={true}
            config={{
              delimiter: ';',
            }}
            data={
              dados.map((data) => (
                {
                  'Código': data.codclient,
                  'Cliente': data.name,
                  'Cidade': data.city,
                  'Contrato': data.contract,
                  'Data': new Date(data.date).toLocaleDateString("pt-BR"),
                  'Operação': data.operation,
                  'Plano': data.plan,
                  'Valor Plano': 'R$ ' + data.plan_value,
                  'Plano Antigo': data.old_plan || 'Venda',
                  'Valor Plano Antigo': (data.old_plan_value ? 'R$ ' + data.old_plan_value : 'Venda'),
                  'Plano Novo': data.new_plan || 'Venda',
                  'Valor Plano Novo': (data.new_plan_value ? 'R$ ' + data.new_plan_value : 'Venda'),
                  'Operador': data.operator,
                  'Cidade Operador': data.city_operator,
                  'Pagamento Recorrente?': data.recurring_payment ? "Sim" : "Não",
                  'TV?': data.tv ? "Sim" : "Não",
                  'Telefonia?': data.telephony ? "Sim" : "Não",
                  'Fatura': data.invoice,
                  'Pago?': data.paid ? "Sim" : "Não",
                  'Data Vencimento': data.due_date
                }
              ))
            }
          >
            Baixar CSV
          </CSVDownloader>
        </div>
      </div>
  );
};

export default Tabela;