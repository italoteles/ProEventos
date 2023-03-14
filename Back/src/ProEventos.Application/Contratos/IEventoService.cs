using ProEventos.Application.Dtos;


namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEvento(EventoDto model);
        Task<EventoDto> UpdateEvento(int eventoId, EventoDto model);
        Task<bool> DeleteEvento(int eventoId);

        Task<EventoDto[]> GetAllEventosAsync(bool includePalestrante = false);
        Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrante = false);
        Task<EventoDto> GetAEventoByIdAsync(int eventoId, bool includePalestrante = false);
    }
}