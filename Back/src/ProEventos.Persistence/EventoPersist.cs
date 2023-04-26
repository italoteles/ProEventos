using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence
{
    public class EventoPersist : IEventoPersist
    {
        private ProEventosContext _context;

        public EventoPersist(ProEventosContext context)
        {
            _context = context;
            // _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<PageList<Evento>> GetAllEventosAsync(int userId,PageParams pageParams, bool includePalestrante = false)
        {
            
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if (includePalestrante){
                query = query.Include( e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);
            }

            query = query.AsNoTracking()
                .Where(e=>  (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) || 
                            e.Local.ToLower().Contains(pageParams.Term.ToLower())) && 
                            e.UserId == userId)
                .OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query,pageParams.PageNumber,pageParams.pageSize);
        }
        
        public async Task<Evento> GetAEventoByIdAsync(int userId,int eventoId, bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if (includePalestrante){
                query = query.Include( e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);
            }

            query = query.AsNoTracking().OrderBy(e => e.Id)
                .Where(e=>e.Id == eventoId && e.UserId == userId);

        

            return await query.FirstOrDefaultAsync();
        }



        
    }
}