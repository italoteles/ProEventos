using ProEventos.Application.Dtos;


namespace ProEventos.Application.Contratos
{
    public interface ILoteService
    {
        
        Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models);
        Task<bool> DeleteLote(int eventoId, int LoteId);

        Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId);
        
        Task<LoteDto> GetALoteByIdsAsync(int eventoId, int loteId);
    }
}