import { Evento } from "./Evento";
import { RedeSocial } from "./RedeSocial";
import { UserUpdate } from "./identity/UserUpdate";

export interface Palestrante {
  id : Number;
  miniCurriculo : string;
  user : UserUpdate;
  redesSociais : RedeSocial[];
  palestrantesEventos : Evento[];
}
