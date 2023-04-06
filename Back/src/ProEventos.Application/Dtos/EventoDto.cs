using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        // [MinLength(3, ErrorMessage ="{0} deve ter no mínimo 4 caracteres")]
        // [MaxLength(75, ErrorMessage ="{0} deve ter no máximo 75 caracteres")]
        [StringLength(75, MinimumLength = 3, ErrorMessage = "{0} deve ter entre 3 e 75 caracteres.")]
        public string Tema { get; set; }
        
        [Display(Name = "Quantidade de Pessoas")]
        [Range(10,1500,ErrorMessage ="{0} precisa ser entre 10 e 1500")]
        public int QtdPessoas { get; set; }
        public string Lote { get; set; }
        
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. Apenas gif, jpeg, jpg, bmp ou png são aceitas.")]
        public string ImagemURL { get; set; }
        
        [Phone(ErrorMessage = "{0} inválido.")]
        public string Telefone{ get; set; }

        [Required(ErrorMessage = "O {0} é obrigatório.")]
        [Display(Name = "e-mail")]
        [EmailAddress(ErrorMessage = "O {0} não é válido.")]
        public string email { get; set; }

        public int UserId { get; set; }
        public UserDto UserDto { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}