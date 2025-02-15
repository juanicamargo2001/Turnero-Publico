using Azure;
using Microsoft.Extensions.Configuration;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.BLL
{
    public class EnvioCorreosHTML
    {

        public static string CrearHTMLPostOperatorio(List<MedicamentoxHorarioDTO>? medicamentos, EmailPostOpResponseDTO response)
        {
            string? noMedicamentosHTML = null;
            StringBuilder? medicamentosHtml = null;

            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(response.Nombre.ToLower());

            string recomendacionSexo = response.Sexo switch
            {

                "MACHO" => @"- <strong>Collar Isabelino</strong>.",

                "HEMBRA" => @"- <strong>Collar Isabelino</strong> o <strong>Faja</strong>.",

                _ => ""

            };

            if (medicamentos?.Count == 0)
            {
                noMedicamentosHTML = @"<tr>
                                       <td style=""padding: 20px; padding-left: 35px; font-family: Arial, sans-serif; background-color: #ffffff;"">
                                         <p style=""color: #333333; font-size: 16px; margin: 0 0 10px; line-height: 1.5;"">
                                           No se recetó ningún medicamento.
                                         </p>
                                       </td>
                                     </tr> ";
            }
            else
            {
                medicamentosHtml = new StringBuilder();

                foreach (var medicamento in medicamentos)
                {
                    medicamentosHtml.Append($@"<tr style=""padding: 0;"">
                                           <td style=""padding: 10px 20px 0px; font-family: Arial, sans-serif; background-color: #ffffff;"">
                                             <div style=""padding: 10px 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; margin: 0;"">
                                               <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                                 🧪 <strong>Nombre:</strong> {medicamento.Medicamento}
                                               </p>
                                               <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                                 💉 <strong>Dosis:</strong> {medicamento.Dosis} {medicamento.UnidadMedida}
                                               </p>
                                               <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                                 📝 <strong>Descripción:</strong> {medicamento.Descripcion ?? "Sin descripción"}
                                               </p>
                                             </div>
                                           </td>
                                         </tr>");
                }
            }

            string body = $"{response.Email}\n" + @"
                          <!DOCTYPE html>
                          <html lang=""es"">
                          <head>
                            <meta charset=""UTF-8"">
                            <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                          </head>
                          <body style=""margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;"">
                            <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border-collapse: collapse; background-color: #ffffff;"">
                          
                              <tr>
                                <td align=""left"" style=""padding: 20px 0 10px 20px; background-color: #3a5475;"">
                                  <img src=""https://biocordoba.cordoba.gob.ar/wp-content/uploads/sites/14/2022/02/cropped-favicon.png"" alt=""Logo de la Empresa"" style=""width: 50px; height: auto; display: block; margin: auto;"">
                                  <p style=""margin: 17px 0 5px; color: #e6e6e6; font-size: 16px; text-align: center; font-family:Arial, Helvetica, sans-serif"">Municipio BIOCÓRDOBA</p>
                                </td>
                              </tr>
                          
                              <tr>
                                <td style=""padding: 0 20px;"">
                                  <h2 style=""color: #0072bc; font-size: 22px; margin-top: 30px;"">Cuidados Postquirúrgico</h2>
                                </td>
                              </tr>
                          
                              <tr>
                                <td style=""padding: 10px 20px 0;"">
                                  <p style=""color: #333333; font-size: 16px; margin-top: 0;"">
                                    Hola, " + nombreFormateado + @". Le recordamos los cuidados para su animal:
                                  </p>
                                </td>
                              </tr>
                          
                              <tr>
                                <td style=""padding: 10px 20px 0; font-family: Arial, sans-serif; background-color: #ffffff; "">
                                  <p style=""color: #333333; font-size: 16px; margin: 8px 0; line-height: 1.5;"">
                                    " + recomendacionSexo + @" 
                                  </p>
                                  <hr style=""border: 1px solid #ddd; margin: 15px 0;"">
                                  <p style=""color: #333333; font-size: 16px; margin: 0 0 10px;"">
                                    💊 <strong>Medicación:</strong>
                                  </p>
                                </td>
                              </tr>
                              " + medicamentosHtml?.ToString() + @"

                              " + noMedicamentosHTML + @"
                              <tr>
                              <td>
                                  <p style=""padding: 10px;  color: #555555; font-size: 14px; text-align: center; margin: 10px 0;"">
                                    ℹ️ Consulte siempre con el veterinario para ajustar las dosis según el peso y estado de salud del animal.
                                  </p>
                                  <p style=""padding: 10px; text-align: center; margin: 10px 0;"">
                                    <a href=""centrocastracion.com/encuesta"" 
                                      style=""text-decoration: none; color: #FFFFFF; background-color: #007BFF; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-family: Arial, sans-serif; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"">
                                      ⭐ Contanos sobre tu experiencia completando nuestra encuesta ⭐
                                    </a>
                                  </p>
                                </td>
                              </tr>
                          
                              <tr>
                                <td style=""padding: 20px;"">
                                  <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                    <tr>
                                      <td width=""25%"" style=""background-color: #e8b434; height: 4px;""></td>
                                      <td width=""25%"" style=""background-color: #e64545; height: 4px;""></td>
                                      <td width=""25%"" style=""background-color: #b855d8; height: 4px;""></td>
                                      <td width=""25%"" style=""background-color: #0072bc; height: 4px;""></td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                          
                              <tr>
                                <td style=""padding: 10px 20px; text-align: center; color: #999999; font-size: 12px;"">
                                  Este mensaje se envió de forma automática. Por favor, no responda.<br>
                                  En caso de no haber solicitado ningún turno, desestime este mail.
                                </td>
                              </tr>
                            </table>
                          </body>
                          </html>";


            return body;
        }


        public static string? CrearHTMLCorreoRecuperacion(CorreoRecuperacionDTO correoRecuperacion)
        {
            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(correoRecuperacion.Nombre.ToLower());


            string body = $"{correoRecuperacion.Email}\n" + @"
                            <!DOCTYPE html>
                            <html lang=""es"">
                            <head>
                              <meta charset=""UTF-8"">
                              <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                              <style>
                                body {
                                  font-family: Arial, sans-serif;
                                  margin: 0;
                                  padding: 0;
                                  background-color: #f4f4f4;
                                }
                                .email-container {
                                  max-width: 600px;
                                  margin: 0 auto;
                                  background-color: #ffffff;
                                  border: 1px solid #ddd;
                                  border-radius: 8px;
                                  overflow: hidden;
                                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                                }
                                .email-header {
                                  background-color: #3a5475;
                                  color: #ffffff;
                                  text-align: center;
                                  padding: 20px;
                                }
                                .email-header img {
                                  width: 50px;
                                  height: auto;
                                }
                                .email-header p {
                                  margin: 10px 0 0;
                                  font-size: 16px;
                                }
                                .email-body {
                                  padding: 20px;
                                  color: #333333;
                                  font-size: 16px;
                                }
                                .email-body p {
                                  margin: 10px 0;
                                  line-height: 1.5;
                                }
                                .temporary-password {
                                  display: block;
                                  background-color: #f4f4f4;
                                  border: 1px dashed #0072bc;
                                  font-size: 18px;
                                  text-align: center;
                                  padding: 10px;
                                  margin: 20px 0;
                                  color: #0072bc;
                                  font-weight: bold;
                                }
                                .steps {
                                  margin: 20px 0;
                                }
                                .steps h4 {
                                  font-size: 18px;
                                  margin-bottom: 10px;
                                }
                                .steps ol {
                                  margin: 0;
                                  padding-left: 20px;
                                }
                                .steps ol li {
                                  margin-bottom: 10px;
                                }
                                .email-footer {
                                  padding: 20px;
                                  background-color: #f9f9f9;
                                  text-align: center;
                                  font-size: 14px;
                                  color: #666666;
                                }
                                .email-footer a {
                                  color: #0072bc;
                                  text-decoration: none;
                                }
                                .email-divider {
                                  margin: 20px 0;
                                  width: 100%;
                                }
                                .email-divider td {
                                  height: 4px;
                                }
                                .email-divider .yellow { background-color: #e8b434; }
                                .email-divider .red { background-color: #e64545; }
                                .email-divider .purple { background-color: #b855d8; }
                                .email-divider .blue { background-color: #0072bc; }
                              </style>
                            </head>
                            <body>
                              <div class=""email-container"">
                                <!-- Header -->
                                <div class=""email-header"">
                                  <img src=""https://biocordoba.cordoba.gob.ar/wp-content/uploads/sites/14/2022/02/cropped-favicon.png"" alt=""Logo de la Empresa"">
                                  <p>Municipio BIOCÓRDOBA</p>
                                </div>
                            
                                <div class=""email-body"">
                                  <h2 style=""color: #0072bc; font-size: 22px; margin-top: 0;"">Recuperación de Contraseña</h2>
                                  <p>Hola, <strong>"+ nombreFormateado + @"</strong>.</p>
                                  <p>Hemos generado una contraseña temporal para que puedas acceder a tu cuenta. Por favor, utiliza esta contraseña para iniciar sesión y luego cámbiala por una nueva:</p>
                                  
                                  <span class=""temporary-password"">" + correoRecuperacion.Contraseña + @" </span>
                            
                                  <div class=""steps"">
                                    <h4>Pasos a seguir:</h4>
                                    <ol>
                                      <li>Inicia sesión con la contraseña temporal proporcionada.</li>
                                      <li>Accede a la sección de ""Cambio de contraseña"".</li>
                                      <li>Ingresa una nueva contraseña segura y guárdala.</li>
                                    </ol>
                                  </div>
                            
                                  
                                </div>
                            
                                <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border-collapse: collapse; background-color: #ffffff;"">
                                <tr>
                                    <td style=""padding: 20px;"">
                                      <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                        <tr>
                                          <td width=""25%"" style=""background-color: #e8b434; height: 4px;""></td>
                                          <td width=""25%"" style=""background-color: #e64545; height: 4px;""></td>
                                          <td width=""25%"" style=""background-color: #b855d8; height: 4px;""></td>
                                          <td width=""25%"" style=""background-color: #0072bc; height: 4px;""></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                            
                                  <tr>
                                    <td style=""padding: 10px 20px; text-align: center; color: #999999; font-size: 12px;"">
                                      Este mensaje se envió de forma automática. Por favor, no responda.<br>
                                      En caso de no haber solicitado ningún cambio de contraseña, desestime este mail.
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </body>
                            </html>";

            return body;

        }


        public static string CrearHTMLRegistroCancelacion(EmailDTO? texto, bool esCancelacion)
        {
            string timeString = texto.Hora;
            TimeSpan time = TimeSpan.Parse(timeString);
            string tiempoFormateado = $"{time.Hours}:{time.Minutes:D2} Hrs";

            DateTime fecha = DateTime.Parse(texto.Fecha);
            string fechaFormateada = fecha.ToString("dd-MM-yyyy");

            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(texto.Nombre.ToLower());

            string tipoAnimalEmoji = texto.Tipo switch
            {
                "GATO" => "😺",
                "PERRO" => "🐶",
                _ => ""
            };

            string cancelacionTexto = !esCancelacion ? @"<tr>
                                                        <td style=""text-align: center; padding: 10px;"">
                                                            <p style=""font-size: 14px; background-color: #FFF4E0; padding: 15px; border-radius: 10px; display: inline-block; text-align: center; max-width: 450px; width: 100%; color: #C68642; font-weight: bold;"">
                                                                En caso de no poder asistir al turno programado, es importante que cancele o reprograme por medio de la 
                                                                <a target=""_blank"" rel=""noopener noreferrer"" href=""https://turnero-castraciones-production.up.railway.app/"" style=""color: #A0522D; ""><strong>página oficial</strong></a>
                                                            </p>
                                                        </td>
                                                    </tr>" : String.Empty;


            string Body = $"{texto.Email}\n" + @"
                            <!DOCTYPE html>
                            <html lang=""es"">
                            <head>
                              <meta charset=""UTF-8"">
                              <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                            </head>
                            <body style=""margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;"">
                              <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border-collapse: collapse; background-color: #ffffff;"">

                                <tr>
                                  <td align=""left"" style=""padding: 20px 0 10px 20px; background-color: #3a5475;"">
                                    <img src=""https://biocordoba.cordoba.gob.ar/wp-content/uploads/sites/14/2022/02/cropped-favicon.png"" alt=""Logo de la Empresa"" style=""width: 50px; height: auto; display: block; margin: auto;"">
                                    <p style=""margin: 17px 0 5px; color: #e6e6e6; font-size: 16px; text-align: center; font-family:Arial, Helvetica, sans-serif"">Municipio BIOCÓRDOBA</p>
                                  </td>
                                </tr>

                                <tr>
                                  <td style=""padding: 0 20px;"">
                                    <h2 style=""color: #0072bc; font-size: 22px; margin-top: 30px;"">" + texto.TipoEmail + @"</h2>
                                  </td>
                                </tr>

                                <tr>
                                  <td style=""padding: 10px 20px;"">
                                    <p style=""color: #333333; font-size: 16px; margin: 0;"">
                                      Hola, " + nombreFormateado + @". " + texto.Mensaje + @"
                                    </p>
                                  </td>
                                </tr>

                                <!-- <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <h3 style=""color: #0072bc; font-size: 18px; margin-bottom: -10px;"">Detalle de turno</h3>
                                 </td>
                               </tr> -->
                                <tr>
                                  <td style=""padding: 10px 20px;"">
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      <strong>🏥 Centro Castración: " + texto.CentroCastracion + @" </strong>
                                    </p>
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      <strong>🗓️ Fecha: </strong> " + fechaFormateada + @"
                                    </p>
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      <strong>🕑 Hora: </strong> " + tiempoFormateado + @"
                                    </p>
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      " + tipoAnimalEmoji + @" <strong> Tipo de Animal: </strong> " + char.ToUpper(texto.Tipo[0]) + texto.Tipo.Substring(1).ToLower() + @"
                                    </p>
                                  </td>
                                </tr>              
                                " + cancelacionTexto + @"
                                <tr>
                                  <td style=""padding: 20px;"">
                                    <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                      <tr>
                                        <td width=""25%"" style=""background-color: #e8b434; height: 4px;""></td>
                                        <td width=""25%"" style=""background-color: #e64545; height: 4px;""></td>
                                        <td width=""25%"" style=""background-color: #b855d8; height: 4px;""></td>
                                        <td width=""25%"" style=""background-color: #0072bc; height: 4px;""></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>

                                <tr>
                                  <td style=""padding: 10px 20px; text-align: center; color: #999999; font-size: 12px;"">
                                    Este mensaje se envió de forma automática. Por favor, no responda.<br>
                                    En caso de no haber solicitado ningún turno, desestime este mail.
                                  </td>
                                </tr>
                              </table>
                            </body>
                            </html>";

            return Body;
        }

        public static string CrearHTMLConfirmacionYRecordatorio(CorreosProgramados correo, bool incluirBotonConfirmar)
        {
            string tiempoFormateado = $"{correo.Hora.Hours}:{correo.Hora.Minutes:D2} Hrs";

            string fechaFormateada = correo.FechaEnvio.ToString("dd-MM-yyyy");

            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(correo.NombreCompleto.ToLower());

            string tipoAnimalEmoji = correo.TipoAnimal switch
            {
                "GATO" => "😺",
                "PERRO" => "🐶",
                _ => ""
            };


            string botonConfirmar = incluirBotonConfirmar ? @"
                <tr>
                    <td style=""text-align: center; margin-bottom: 7px;"">
                        <a target=""_blank"" rel=""noopener noreferrer"" href=""https://turnero-castraciones-production.up.railway.app/iniciarsesion"" style=""background-color: #2c7dda; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; text-decoration: none; display: inline-block;"">
                            Confirmar
                        </a>
                    </td>
                </tr>" : string.Empty;


            string tipoAnimalRecomendacionesRecordatorio = !incluirBotonConfirmar ? correo.TipoAnimal switch
            {
                "GATO" => @"<tr>
                            <td style=""padding: 10px 20px;"">
                              <h3 style=""color: #0072bc; font-size: 18px; margin-bottom: 10px;"">📋 Requisitos para la cirugía de gatos</h3>
                              <ul style=""color: #333333; font-size: 16px; margin: 5px 0; padding-left: 20px;"">
                                <p>🐾 <strong>Ayuno:</strong> 8 horas sin sólidos. Última comida ligera y en poca cantidad.</p>
                                <p><img width=""18"" height=""18"" src=""https://img.icons8.com/pastel-glyph/64/cat-cage--v1.png"" alt=""Transportadora""/> <strong>Transporte:</strong> Llevar al gato en doble bolsa red (de cebolla) bien cerrada o en una transportadora adecuada.</p>
                                <p><img width=""18"" height=""18"" src=""https://img.icons8.com/external-nawicon-outline-color-nawicon/64/external-blanket-bedroom-nawicon-outline-color-nawicon.png"" alt=""Manta""/> <strong>Colcha:</strong> Limpia, abrigada y acorde al tamaño del animal. No se permite sábana ni toalla.</p>
                                <p><img width=""19"" height=""19"" src=""https://img.icons8.com/color/48/bandage.png"" alt=""bandage""/> <strong>Protección:</strong> Llevar 2 zaleas o 2 pañales de adulto sin elástico.</p>
                                <p><img width=""19"" height=""19"" src=""https://img.icons8.com/dusk/64/id-verified.png"" alt=""id-verified""/> <strong>Documentación:</strong> DNI. Solo puede asistir quien tenga el turno asignado.</p>
                                <p>⏰ <strong>Puntualidad:</strong> Llegar 15 minutos antes. Tolerancia máxima de 15 minutos.</p>
                                <p>🛁 <strong>Limpieza:</strong> Si es posible, bañe al gato para que esté limpio antes de la cirugía.</p>
                                <p>👥 <strong>Acompañamiento:</strong> La cirugía dura entre 1 y 1,5 horas. Es obligatorio esperar en el lugar hasta que se entregue al animal.</p>
                              </ul>
                            </td>
                          </tr>",
                "PERRO" => @"<tr>
                             <td style=""padding: 10px 20px;"">
                               <h3 style=""color: #0072bc; font-size: 18px; margin-bottom: 10px;"">📋 Requisitos para la cirugía de perros</h3>
                               <ul style=""color: #333333; font-size: 16px; margin: 5px 0; padding-left: 20px;"">
                                 <p>🐾 <strong>Ayuno:</strong> 8 horas sin sólidos. Última cena ligera y en poca cantidad.</p>
                                 <p><img width=""18"" height=""18"" src=""https://img.icons8.com/external-nawicon-outline-color-nawicon/64/external-blanket-bedroom-nawicon-outline-color-nawicon.png"" alt=""external-blanket-bedroom-nawicon-outline-color-nawicon""/> <strong>Colcha:</strong> Limpia, abrigada y del tamaño adecuado. No se permite sábana ni toalla.</p>
                                 <p>🔗 <strong>Correa y collar:</strong> Puestos en el animal al momento de llevarlo.</p>
                                 <p><img width=""19"" height=""19"" src=""https://img.icons8.com/color/48/bandage.png"" alt=""bandage""/> <strong>Protección:</strong> Llevar 2 zaleas o 2 pañales de adulto sin elástico.</p>
                                 <p><img width=""19"" height=""19"" src=""https://img.icons8.com/dusk/64/id-verified.png"" alt=""id-verified""/> <strong>Documentación:</strong> DNI. Solo puede asistir quien tenga el turno asignado.</p>
                                 <p>⏰ <strong>Puntualidad:</strong> Llegar 15 minutos antes. Tolerancia máxima de 15 minutos.</p>
                                 <p>🛁 <strong>Limpieza:</strong> Bañar al perro antes de la cirugía para que esté limpio.</p>
                                 <p>👥 <strong>Acompañamiento:</strong> La cirugía dura entre 1 y 1,5 horas. Es obligatorio esperar en el lugar hasta que se entregue al animal.</p>
                               </ul>
                             </td>
                            </tr>",
                _ => ""

            } : string.Empty;

            string tituloDestino = incluirBotonConfirmar ? "Confirmación de Turno" : "Recordatorio de Turno";

            string Body = $"{correo.EmailDestino}\n" + @"
                           <!DOCTYPE html>
                           <html lang=""es"">
                           <head>
                             <meta charset=""UTF-8"">
                             <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                           </head>
                           <body style=""margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;"">
                             <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border-collapse: collapse; background-color: #ffffff;"">

                               <tr>
                                 <td align=""left"" style=""padding: 20px 0 10px 20px; background-color: #3a5475;"">
                                   <img src=""https://biocordoba.cordoba.gob.ar/wp-content/uploads/sites/14/2022/02/cropped-favicon.png"" alt=""Logo de la Empresa"" style=""width: 50px; height: auto; display: block; margin: auto;"">
                                   <p style=""margin: 17px 0 5px; color: #e6e6e6; font-size: 16px; text-align: center; font-family:Arial, Helvetica, sans-serif"">Municipio BIOCÓRDOBA</p>
                                 </td>
                               </tr>

                               <tr>
                                 <td style=""padding: 0 20px;"">
                                   <h2 style=""color: #0072bc; font-size: 22px; margin-top: 30px;"">" + tituloDestino + @"</h2>
                                 </td>
                               </tr>

                               <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <p style=""color: #333333; font-size: 16px; margin: 0;"">
                                     Hola, " + nombreFormateado + @". Le recordamos que tiene un turno:
                                   </p>
                                 </td>
                               </tr>
                               <!-- <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <h3 style=""color: #0072bc; font-size: 18px; margin-bottom: -10px;"">Detalle de turno</h3>
                                 </td>
                               </tr> -->
                               <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     <strong>🏥 Centro Castración: </strong> " + correo.CentroCastracion + @"
                                   </p>
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     <strong>🗓️ Fecha: </strong> " + fechaFormateada + @"
                                   </p>
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     <strong>🕑 Hora: </strong> " + tiempoFormateado + @"
                                   </p>
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     " + tipoAnimalEmoji + @" <strong> Tipo de Animal: </strong> " + char.ToUpper(correo.TipoAnimal[0]) + correo.TipoAnimal.Substring(1).ToLower() + @"
                                   </p>
                                 </td>

                                " + tipoAnimalRecomendacionesRecordatorio + @"

                               </tr>
                               <tr>
                                   <td style=""text-align: center; padding: 10px;"">
                                       <p style=""font-size: 14px; background-color: #FFF4E0; padding: 15px; border-radius: 10px; display: inline-block; text-align: center; max-width: 450px; width: 100%; color: #C68642; font-weight: bold;"">
                                           En caso de no poder asistir al turno programado, es importante que cancele o reprograme por medio de la 
                                          <a target=""_blank"" rel=""noopener noreferrer"" href=""https://turnero-castraciones-production.up.railway.app/"" style=""color: #A0522D; ""><strong>página oficial</strong></a>
                                       </p>
                                   </td>
                               </tr>
    
    
                               <tr>
                                   " + botonConfirmar + @"
                               </tr>

                               <tr>
                                 <td style=""padding: 20px;"">
                                   <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                     <tr>
                                       <td width=""25%"" style=""background-color: #e8b434; height: 4px;""></td>
                                       <td width=""25%"" style=""background-color: #e64545; height: 4px;""></td>
                                       <td width=""25%"" style=""background-color: #b855d8; height: 4px;""></td>
                                       <td width=""25%"" style=""background-color: #0072bc; height: 4px;""></td>
                                     </tr>
                                   </table>
                                 </td>
                               </tr>

                               <tr>
                                 <td style=""padding: 10px 20px; text-align: center; color: #999999; font-size: 12px;"">
                                   Este mensaje se envió de forma automática. Por favor, no responda.<br>
                                   En caso de no haber solicitado ningún turno, desestime este mail.
                                 </td>
                               </tr>
                             </table>
                           </body>
                           </html>";

            return Body;
        }


        public static string CrearHTMLCancelacionMasiva(CancelacionMasivaDTO cancelacionMasiva)
        {
            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(cancelacionMasiva.Nombre.ToLower());

            string tiempoFormateado = $"{cancelacionMasiva.Hora.Hours}:{cancelacionMasiva.Hora.Minutes:D2} Hrs";

            string fechaFormateada = cancelacionMasiva.Dia.ToString("dd-MM-yyyy");

            string body = $"{cancelacionMasiva.Email}\n" + @"
                            <!DOCTYPE html>
                            <html lang=""es"">
                            <head>
                              <meta charset=""UTF-8"">
                              <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                              <title>Cancelación de Turno</title>
                              <style>
                                body {
                                  margin: 0;
                                  padding: 0;   
                                  font-family: Arial, sans-serif;
                                  color: #333333;
                                }
                                .container {
                                  max-width: 600px;
                                  margin: 20px auto;
                                  background-color: #ffffff;
                                  border-radius: 8px;
                                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                  overflow: hidden;
                                }
                                .header {
                                  background-color: #3a5475;
                                  text-align: center;
                                  padding: 20px;
                                }
                                .header img {
                                  width: 60px;
                                  height: auto;
                                }
                                .header p {
                                  margin: 10px 0 0;
                                  color: #ffffff;
                                  font-size: 18px;
                                }
                                .content {
                                  padding: 20px;
                                  font-size: 16px;
                                  line-height: 1.5;
                                }
                                .content h2 {
                                  color: #0072bc;
                                  font-size: 24px;
                                  margin-top: 0;
                                }
                                .highlight {
                                  background-color: #fbe9e9;
                                  color: #d9534f;
                                  padding: 10px;
                                  border-radius: 4px;
                                  text-align: center;
                                  font-weight: bold;
                                  margin: 20px 0;
                                }
                                .footer {
                                  padding: 20px;
                                  text-align: center;
                                  font-size: 12px;
                                  color: #999999;
                                }
                                .divider {
                                  display: flex;
                                  height: 4px;
                                }
                                .divider div {
                                  flex: 1;
                                }
                                .button {
                                  display: inline-block;
                                  padding: 10px 20px;
                                  background-color: #0072bc;
                                  text-decoration: none;
                                  border-radius: 4px;
                                  margin-top: 10px;
                            
                                }
                                .button:hover {
                                  background-color: #005a99;
                                }
                              </style>
                            </head>
                            <body style=""margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;"">
                              <div class=""container"">
                                <div class=""header"">
                                  <img src=""https://biocordoba.cordoba.gob.ar/wp-content/uploads/sites/14/2022/02/cropped-favicon.png"" alt=""Logo de la Empresa"">
                                  <p>Municipio BIOCÓRDOBA</p>
                                </div>
                            
                                <div class=""content"">
                                  <h2>Cancelación de Turno</h2>
                                  <p>Hola, <strong>" + nombreFormateado + @"</strong>,</p>
                                  <p>Queremos informarle que su turno programado para el día <strong>" + fechaFormateada + @"</strong> a las <strong>" + tiempoFormateado + @"</strong> ha sido cancelado debido a:</p>
                            
                                  <div class=""highlight"">
                                    " + cancelacionMasiva.Motivo + @"
                                  </div>
                            
                                  <p >Le pedimos disculpas por los inconvenientes ocasionados. Puede reprogramar su turno llamando al <strong>0800-888-0404</strong> o accediendo a nuestra página web:</p>
                                  
                                  <div style=""text-align: center;"">
                                    <a target=""_blank"" rel=""noopener noreferrer"" href=""https://turnero-castraciones-production.up.railway.app/iniciarsesion"" class=""button"" style=""color: #ffffff;"">Reprogramar Turno</a>
                                  </div>
                                </div>
                            
                                <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border-collapse: collapse; background-color: #ffffff;"">
                                    <tr>
                                        <td style=""padding: 20px;"">
                                          <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                            <tr>
                                              <td width=""25%"" style=""background-color: #e8b434; height: 4px;""></td>
                                              <td width=""25%"" style=""background-color: #e64545; height: 4px;""></td>
                                              <td width=""25%"" style=""background-color: #b855d8; height: 4px;""></td>
                                              <td width=""25%"" style=""background-color: #0072bc; height: 4px;""></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
  
                                      <tr>
                                        <td style=""padding: 10px 20px; text-align: center; color: #999999; font-size: 12px;"">
                                          Este mensaje se envió de forma automática. Por favor, no responda.<br>
                                          En caso de no haber solicitado ningún cambio de contraseña, desestime este mail.
                                        </td>
                                      </tr>
                                    </table>
                              </div>
                            </body>
                            </html>
                            ";

            return body;

        }

    }
}
