using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    
    public interface IEventoPersist
    {
       
        Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrante = false);
        Task<Evento[]> GetAllEventosByTemaAsync(int userId,string tema, bool includePalestrante = false);
        Task<Evento> GetAEventoByIdAsync(int userId,int eventoId, bool includePalestrante = false);
        
        

    }
}