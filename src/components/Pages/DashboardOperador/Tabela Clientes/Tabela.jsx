import React from "react";
import { useCSVDownloader } from 'react-papaparse';
import { useState, useEffect } from "react";
import { loadTabelaUsuarios } from "../../../../services/loadTabelaUsuários";
import style from './Tabela.module.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { GiConsoleController } from "react-icons/gi";



const gerarChave = (obj) => {
  const entries = Object.entries(obj).filter(([key]) => key !== 'comission');
  return JSON.stringify(Object.fromEntries(entries));
};

const Tabela = ({ filter }) => {
    const [dados, setDados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadTabelaUsuarios(sessionStorage.getItem(0));
          
          const dadosFiltrados = carrega.filter(item => {
            const dataValida = new Date(item.date) >= new Date(filter.startDate) && new Date(item.date) <= new Date(filter.endDate);
            const operacaoValida = filter.operation.length === 0 || filter.operation.includes(item.operation);
            return dataValida && operacaoValida;
              });

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
          
          const mapa = new Map();
          
          ordena.forEach(item => {
            const chave = gerarChave(item);
            
            if (!mapa.has(chave)) {
              mapa.set(chave, { ...item });
            } else {
              const existente = mapa.get(chave);
              var existe = parseFloat(eval(existente.comission).toFixed(2));
              var novo = parseFloat(eval(item.comission).toFixed(2));
              
              const soma = (existe + novo).toFixed(2);

              existente.comission = soma;

              mapa.set(chave, existente);
            }
          });
          
          const resultado = Array.from(mapa.values());
          setDados(resultado);
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
    // const { CSVDownloader, Type } = useCSVDownloader();

    const exportToExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Comissão');

      // Define as colunas
      worksheet.columns = [
        { header: 'Código', key: 'codclient', width: 10 },
        { header: 'Cliente', key: 'name', width: 20 },
        { header: 'Cidade', key: 'city', width: 15 },
        { header: 'Contrato', key: 'contract', width: 15 },
        { header: 'Data', key: 'date', width: 12 },
        { header: 'Operação', key: 'operation', width: 15 },
        { header: 'Plano', key: 'plan', width: 15 },
        { header: 'Valor Plano', key: 'plan_value', width: 15 },
        { header: 'Plano Antigo', key: 'old_plan', width: 15 },
        { header: 'Valor Plano Antigo', key: 'old_plan_value', width: 20 },
        { header: 'Plano Novo', key: 'new_plan', width: 15 },
        { header: 'Valor Plano Novo', key: 'new_plan_value', width: 20 },
        { header: 'Operador', key: 'operator', width: 15 },
        { header: 'Cidade Operador', key: 'city_operator', width: 15 },
        { header: 'Pagamento Recorrente?', key: 'recurring_payment', width: 20 },
        { header: 'TV?', key: 'tv', width: 10 },
        { header: 'Telefonia?', key: 'telephony', width: 10 },
        { header: 'Fatura', key: 'invoice', width: 15 },
        { header: 'Pago?', key: 'paid', width: 10 },
        { header: 'Data Vencimento', key: 'due_date', width: 15 },
        { header: 'Comissão', key: 'comission', width: 15 },
        { header: 'Aprovado?', key: 'accepted', width: 10 },
      ];

      // Estilizando o cabeçalho
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // texto branco
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '00CCFF' }, // azul
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'none' },
          left: { style: 'none' },
          bottom: { style: 'none' },
          right: { style: 'none' },
        };
      });

      const columnNumberToLetter = (colNum) => {
        let temp = '';
        let letter = '';
        while (colNum > 0) {
          temp = (colNum - 1) % 26;
          letter = String.fromCharCode(temp + 65) + letter;
          colNum = (colNum - temp - 1) / 26;
        }
        return letter;
      };

      const lastCol = worksheet.columns.length;
      const lastColLetter = columnNumberToLetter(lastCol);

      worksheet.autoFilter = {
        from: 'A1',
        to: `${lastColLetter}1`
      };

      // Adicionando os dados
      dados.forEach((data) => {
        worksheet.addRow({
          codclient: data.codclient,
          name: data.name,
          city: data.city,
          contract: data.contract,
          date: new Date(data.date).toLocaleDateString("pt-BR"),
          operation: data.operation,
          plan: data.plan,
          plan_value: parseFloat(data.plan_value),
          old_plan: data.old_plan || 'Venda',
          old_plan_value: data.old_plan_value || 'Venda',
          new_plan: data.new_plan || 'Venda',
          new_plan_value: data.new_plan_value || 'Venda',
          operator: data.operator,
          city_operator: data.city_operator,
          recurring_payment: data.recurring_payment ? "Sim" : "Não",
          tv: data.tv ? "Sim" : "Não",
          telephony: data.telephony ? "Sim" : "Não",
          invoice: data.invoice,
          paid: data.paid ? "Sim" : "Não",
          due_date: data.due_date,
          comission: data.paid ? (parseFloat(eval(data.comission).toFixed(2)) || 0) : "Cliente Não Pagou",
          accepted: data.accepted
        });
      });

      // Estilizando as linhas de dados
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) { // Pula o cabeçalho
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'none' },
              left: { style: 'none' },
              bottom: { style: 'none' },
              right: { style: 'none' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          });

          // Exemplo: cor diferente pra linhas alternadas
          if (rowNumber % 2 === 0) {
            row.eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF3F3F3' }, // cinza claro
              };
            });
          }
        }
      });

      // Congela a primeira linha (cabeçalho)
      worksheet.views = [{ state: 'frozen', ySplit: 1 }];

      // Salva o arquivo
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `Comissao_${sessionStorage.getItem(0)}_${dataAtual}.xlsx`;
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, fileName);
    };
    
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
                <th>Aceito?</th>
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
                  <td>{data.accepted}</td>
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
          <button onClick={exportToExcel} className={style.Downloadbtn}>
            Baixar Excel
          </button>
          {/* <CSVDownloader
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
          </CSVDownloader> */}
        </div>
      </div>
  );
};

export default Tabela;