import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filtro.module.css";
import { Filter } from "lucide-react"; // Ícone de filtro

const Filtro = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleFilterChange = () => {
      onFilterChange({ startDate, endDate });
      setShowPicker(false);
  };

  return (
      <div className={styles.divFiltro}>
          <button onClick={() => setShowPicker(!showPicker)}>
              <Filter size={24} />
          </button>

          {showPicker && (
              <div className={styles.divDatas}>
                  <DatePicker
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Data inicial"
                  />
                  <DatePicker
                      selected={endDate}
                      onChange={date => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Data final"
                  />
                  <button onClick={handleFilterChange}>Aplicar</button>
              </div>
          )}
      </div>
  );
};

export default Filtro;
