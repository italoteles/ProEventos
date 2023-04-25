using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence.Contratos
{
    
    public interface IEventoPersist
    {
       
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrante = false);
        
        Task<Evento> GetAEventoByIdAsync(int userId,int eventoId, bool includePalestrante = false);
        
        

    }
}