/**
 * ACTiva Arte · Receptor de datos en línea (Google Apps Script)
 *
 * Guarda en una carpeta de Drive cada envío que hace la versión web de ACTiva Arte
 * (usuarios + trazabilidad), como un archivo JSON con fecha y hora.
 *
 * Despliegue (cuenta institucional):
 *  1. script.google.com > Proyecto nuevo > pegar este código.
 *  2. Propiedades del script: FOLDER_ID = id de la carpeta de Drive donde se guardarán los JSON.
 *     (opcional) TOKEN = clave compartida; debe coincidir con SYNC_TOKEN en index.html.
 *  3. Implementar > Aplicación web > Ejecutar como: yo · Acceso: cualquier usuario.
 *  4. Copiar la URL /exec y pegarla en DEFAULT_SYNC_URL de index.html.
 *
 * Nota de seguridad: la URL es pública y el token viaja en el código de la página; sirve para
 * filtrar ruido, no como autenticación. Los datos incluyen nombre y cédula (Ley 1581 de 2012).
 */
function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var body = JSON.parse(e.postData.contents);
    var token = props.getProperty('TOKEN');
    if (token && body.token !== token) return out_({ ok: false, error: 'token' });
    var folder = DriveApp.getFolderById(props.getProperty('FOLDER_ID'));
    var stamp = Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd_HHmmss');
    var nombre = 'ACTivaArte_' + (body.action || 'envio') + '_' + stamp + '.json';
    folder.createFile(nombre, JSON.stringify(body, null, 2), MimeType.PLAIN_TEXT);
    return out_({ ok: true, archivo: nombre });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}
function doGet() { return out_({ ok: true, servicio: 'ACTiva Arte · receptor' }); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
