import React, { useCallback, useState } from 'react';
import { Pulsantiera } from '../PulsantieraTable/Pulsantiera';
import { useNavigate } from 'react-router-dom';

export const TabellaComponent = ({ dati = [], colonne = [] }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const pageSize = 3; // Numero di righe per pagina
    const pageCount = (dati.length /pageSize)

    // Funzione per ordinare i dati in base alla colonna cliccata
    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Funzione per paginare i dati
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Ottieni dati ordinati e paginati
    const sortedAndPaginatedData = () => {
        let sortedData = [...dati];
        if (sortConfig.key) {
            sortedData = sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    };

    const goToDettaglio = useCallback((e) => {
        console.log("numero pagina: ", currentPage);
        navigate("/dettaglio/" + e.target.id, { state: { previousPath: "/", previousState: {page: currentPage } } })
      }, [currentPage, navigate]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {colonne.map((colonna, index) => (
                            <th key={index} >
                                <button onClick={() => sortData(colonna)}>
                                {colonna}
                                </button>
                            </th>
                        ))}
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAndPaginatedData().map((row, index) => (
                        <tr key={index}>
                            {colonne.map((colonna, colIndex) => (
                                <td key={colIndex}>{row[colonna]}</td>
                            ))}
                            <td key={"Azioni"}>
                                <button id={row.$id} onClick={goToDettaglio}>Visualizza</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>Pagina {currentPage + 1}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= pageCount - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default TabellaComponent;
