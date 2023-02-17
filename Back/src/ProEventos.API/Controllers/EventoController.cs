using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
    public IEnumerable<Evento> _evento = new Evento[]{
            new Evento(){
                EventoId = 1,
                Tema = "Teste",
                Local = "Teste",
                Lote = "1º lote",
                QtdPessoas = 250,
                DataEvento = DateTime.Now.AddDays(2).ToString(),
                ImagemURL = "teste.png"
            },
            new Evento(){
                EventoId = 2,
                Tema = "Teste2",
                Local = "Teste2",
                Lote = "2º lote",
                QtdPessoas = 252,
                DataEvento = DateTime.Now.AddDays(2).ToString(),
                ImagemURL = "teste2.png"
            }

        };



    public EventoController()
    {

    }

    [HttpGet]
    public IEnumerable<Evento> GetAll()
    {
        return _evento; 

    }
    [HttpGet("{id}")]
    public IEnumerable<Evento> GetById(int id)
    {
        return _evento.Where(evento => evento.EventoId == id); 

    }
}
