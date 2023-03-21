using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    
    public interface ILotePersist
    {
       /// <summary>
       ///  Método que retornará uma lista de lotes de um evento
       /// </summary>
       /// <param name="eventoId">Código chave da tabela evento</param>
       /// <returns>Array de Lotes</returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
        
        /// <summary>
        /// Método get que retornará apenas um lote
        /// </summary>
        /// <param name="eventoId">Código chave da tabela evento</param>
        /// <param name="id">Código chave da tabela de lote</param>
        /// <returns>Apenas um lote</returns>
        Task<Lote> GetALoteByIdsAsync(int eventoId, int id);
        
        

    }
}