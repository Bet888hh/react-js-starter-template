import React from 'react'
import PulsantieraFiltri from '../../PulsantieraFiltri/PulsantieraFiltri'
import ConditionalRenderer from '../../../Utility/ConditionalRenderer'
import SortableTableHead from '../SortableTableHead'
import Paginator from '../../Paginator/Paginator'

const sortableTable = ({totali={ aperti: -4, chiusi: -4, inLavorazione: -4, inCarico: -4 }, showContent, elementi, intestazioni, filter, includeInTableIf, onSort, sortConfig, perTabella, getNumeroPagina, location, formatCell, handleFiltra=null,excludeFromSorting}) => {
    return (
        <div>
          {handleFiltra&&  <PulsantieraFiltri totali={totali} handleFiltra={handleFiltra} />}
            <ConditionalRenderer showContent={showContent}>
                {elementi.length > 0 && intestazioni.length > 0 && (
                    <table>
                        <SortableTableHead
                            filter={filter}
                            includeInTableIf={includeInTableIf}
                            excludeFromSorting={excludeFromSorting}
                            intestazioni={intestazioni}
                            onSort={onSort}
                            sort={sortConfig.current}
                        />
                        <tbody>
                            {perTabella.length > 0
                                &&
                                (<Paginator elemPerPagina={5} getNumeroPagina={getNumeroPagina} paginaCorrente={ location.state!== null ? location.state.prevstate.previousState.page : 1}>
                                    {perTabella.map((riga) => {
                                        return (
                                            <tr key={riga.id}>
                                                {intestazioni.map((intestazione) => {
                                                    return (
                                                        <>
                                                            {((intestazione === includeInTableIf.include &&
                                                                includeInTableIf.filter === filter) ||
                                                                intestazione !== includeInTableIf.include) && (
                                                                    <td key={intestazione}>
                                                                        {formatCell(intestazione, riga.content[intestazione])}
                                                                    </td>
                                                                )}
                                                        </>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </Paginator>)
                            }
                        </tbody>
                    </table>
                )}
                {filter===""&&  <p>Seleziona un filtro per visualizzare i ticket</p>}
            {filter!==""&& elementi.length===0&& <p>Non ci sono ticket con questo filtro</p>}
        
            </ConditionalRenderer>
        </div>
    )
}

export default sortableTable