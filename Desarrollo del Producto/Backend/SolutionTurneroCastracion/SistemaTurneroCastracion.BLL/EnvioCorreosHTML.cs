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
                                  <p style=""margin: 17px 0 5px; color: #e6e6e6; font-size: 16px; text-align: center; font-family:Arial, Helvetica, sans-serif"">Municipio BIOCORDOBA</p>
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

    }
}
