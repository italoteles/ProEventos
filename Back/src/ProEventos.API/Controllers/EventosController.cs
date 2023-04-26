using Microsoft.AspNetCore.Mvc;

using ProEventos.Domain;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private IEventoService _eventoService;
    private IWebHostEnvironment _hostEnvironment;
    public IAccountService _accountService { get; }

    public EventosController(IEventoService eventoService, IWebHostEnvironment hostEnvironment, IAccountService accountService)
    {
        _accountService = accountService;
        _eventoService = eventoService;
        _hostEnvironment = hostEnvironment;

    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PageParams pageParams)
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), pageParams, true);
            if (eventos == null) return NoContent();

            Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);

            return Ok(eventos);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var evento = await _eventoService.GetAEventoByIdAsync(User.GetUserId(), id, true);
            if (evento == null) return NoContent();
            return Ok(evento);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar o evento. Erro: {ex.Message}");
        }



    }
    

    [HttpPost]
    public async Task<IActionResult> Post(EventoDto model)
    {
        try
        {
            var evento = await _eventoService.AddEvento(User.GetUserId(), model);
            if (evento == null) return BadRequest("Erro ao tentar adicionar o evento!");
            return Ok(evento);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir o evento. Erro: {ex.Message}");
        }

    }
    [HttpPost("upload-image/{eventoId}")]
    public async Task<IActionResult> UploadImage(int eventoId)
    {
        try
        {
            var evento = await _eventoService.GetAEventoByIdAsync(User.GetUserId(), eventoId, true);
            if (evento == null) return NoContent();

            var file = Request.Form.Files[0];
            if (file.Length > 0)
            {
                DeleteImage(evento.ImagemURL);
                evento.ImagemURL = await SaveImage(file);
            }

            var EventoRetorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);
            return Ok(EventoRetorno);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir a imagem no evento. Erro: {ex.Message}");
        }

    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, EventoDto model)
    {
        try
        {
            var evento = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
            if (evento == null) return NoContent();
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
            var evento = await _eventoService.GetAEventoByIdAsync(User.GetUserId(), id, true);
            if (evento == null) return NoContent();


            if (await _eventoService.DeleteEvento(User.GetUserId(), id))
            {
                DeleteImage(evento.ImagemURL);
                return Ok(new { message = "Deletado" });

            }
            else
            {

                throw new Exception("Ocorreu um erro ao deletar evento.");
            }

        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar o evento. Erro: {ex.Message}");
        }

    }

    [NonAction]
    public async Task<string> SaveImage(IFormFile imageFile)
    {

        string imageName = new string(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');

        imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";

        var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resourcers/images", imageName);

        using (var fileStream = new FileStream(imagePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(fileStream);
        }

        return imageName;
    }
    [NonAction]
    public void DeleteImage(string imageName)
    {
        var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resourcers/images", imageName);
        if (System.IO.File.Exists(imagePath))
            System.IO.File.Delete(imagePath);
    }
}
