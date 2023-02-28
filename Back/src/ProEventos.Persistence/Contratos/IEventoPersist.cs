using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    
    public interface IEventoPersist
    {
       
        Task<Evento[]> GetAllEventosAsync(bool includePalestrante = false);
        Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrante = false);
        Task<Evento> GetAEventoByIdAsync(int EventoId, bool includePalestrante = false);
        
        

    }
}