using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IEventoPersist _eventoPersist;
        private readonly IGeralPersist _geralPersist;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist, IMapper mapper)
        {
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
            _mapper = mapper;
        }
        public async Task<EventoDto> AddEvento(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _geralPersist.Add<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync()){
                    var eventoRetorno = await _eventoPersist.GetAEventoByIdAsync(evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }
            
                return null;
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
                
            }
        }
        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
            try
            {
                

                var evento = await _eventoPersist.GetAEventoByIdAsync(eventoId, false);
                if (evento ==null){
                    return null;
                }

                model.Id = eventoId;

                _mapper.Map(model, evento);

                _geralPersist.Update<Evento>(evento);

                if (await _geralPersist.SaveChangesAsync()){
                    var eventoRetorno = await _eventoPersist.GetAEventoByIdAsync(evento.Id, false);
                    
                    return _mapper.Map<EventoDto>(eventoRetorno);
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

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrante = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrante);
                if (eventos == null) return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);
            

                return resultado;

                
            }
            catch (Exception ex)
            {
                
                 throw new Exception(ex.Message);
            }
        }
        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrante = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrante);
                if (eventos == null) return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);
            

                return resultado;
            }
            catch (Exception ex)
            {
                
                 throw new Exception(ex.Message);
            }
        }
        public async Task<EventoDto> GetAEventoByIdAsync(int eventoId, bool includePalestrante = false)
        {
            try
            {
                var evento = await _eventoPersist.GetAEventoByIdAsync(eventoId, includePalestrante);
                if (evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);
                return resultado;
            }
            catch (Exception ex)
            {
                
                 throw new Exception(ex.Message);
            }
        }



    }
}