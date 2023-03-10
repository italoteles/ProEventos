using Microsoft.AspNetCore.Mvc;

using ProEventos.Domain;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private IEventoService _eventoService;

    public EventosController(IEventoService eventoService)
    {
        _eventoService = eventoService;

    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosAsync(true);
            if (eventos == null) return NotFound("Nenhum evento encontrado!");

    
            return Ok(eventos);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }

    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var evento = await _eventoService.GetAEventoByIdAsync(id, true);
            if (evento == null) return NotFound("Nenhum evento encontrado!");
            return Ok(evento);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar o evento. Erro: {ex.Message}");
        }



    }
    [HttpGet("{tema}/tema")]
    public async Task<IActionResult> GetByTema(string tema)
    {
        try
        {
            var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
            if (evento == null) return NotFound("Nenhum evento encontrado com este tema!");
            return Ok(evento);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar o evento com este tema. Erro: {ex.Message}");
        }

    }

    [HttpPost]
    public async Task<IActionResult> Post(EventoDto model)
    {
        try
        {
            var evento = await _eventoService.AddEvento(model);
            if (evento == null) return BadRequest("Erro ao tentar adicionar o evento!");
            return Ok(evento);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar o evento com este tema. Erro: {ex.Message}");
        }

    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, EventoDto model)
    {
        try
        {
            var evento = await _eventoService.UpdateEvento(id, model);
            if (evento == null) return BadRequest("Erro ao tentar atualizar o evento!");
            return Ok(evento);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir o evento. Erro: {ex.Message}");
        }

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            if (await _eventoService.DeleteEvento(id))
                return Ok("Deletado");

            else
                return BadRequest("Evento n??o deletado");

        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar o evento. Erro: {ex.Message}");
        }

    }
}
