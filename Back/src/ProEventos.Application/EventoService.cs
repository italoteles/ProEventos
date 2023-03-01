using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private IEventoPersist _eventoPersist;
        private IGeralPersist _geralPersist;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist)
        {
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
        }
        public async Task<Evento> AddEvento(Evento model)
        {
            try
            {
                _geralPersist.Add<Evento>(model);
                if (await _geralPersist.SaveChangesAsync()){
                    return await _eventoPersist.GetAEventoByIdAsync(model.Id, false);
                }
            
                return null;
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
                
            }
        }
        public async Task<Evento> UpdateEvento(int eventoId, Evento model)
        {
            try
            {
                var evento = await _eventoPersist.GetAEventoByIdAsync(eventoId, false);
                if (evento ==null){
                    return null;
                }

                model.Id = eventoId;

                _geralPersist.Update(model);

                if (await _geralPersist.SaveChangesAsync()){
                    return await _eventoPersist.GetAEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetAEventoByIdAsync(eventoId, false);
                if (evento ==null){
                    throw new Exception("Evento para delete não foi encontrado");
                }

                _geralPersist.Delete<Evento>(evento);

                return await _geralPersist.SaveChangesAsync();
                   
                
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrante = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrante);
                if (eventos == null) return null;
                return eventos;
            }
            catch (Exception ex)
            {
                
                 throw new Exception(ex.Message);
            }
        }
        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrante = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrante);
                if (eventos == null) return null;
                return eventos;
            }
            catch (Exception ex)
            {
                
                 throw new Exception(ex.Message);
            }
        }
        public async Task<Evento> GetAEventoByIdAsync(int eventoId, bool includePalestrante = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAEventoByIdAsync(eventoId, includePalestrante);
                if (eventos == null) return null;
                return eventos;
            }
            catch (Exception ex)
            {
                
                 throw new Exception(ex.Message);
            }
        }



    }
}