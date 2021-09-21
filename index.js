const yargs = require("yargs");
const child = require("child_process");
const http = require("http");
const fs = require("fs");
const url = require("url");
const jimp = require("jimp");

/*1. El servidor debe ser levantado por instrucción de una aplicación Node que use el
paquete Yargs para capturar los argumentos en la línea de comando. Se deberá
ejecutar el comando para levantar el servidor solo si el valor de la propiedad “key” es
la correcta (123).
*/
const key = 123;
const argv = yargs
  .command(
    "servidor",
    "Levantar servidor",
    {
      acceso: {
        describe: "Key",
        demand: true,
        alias: "k",
      },
    },
    (args) => {
      args.acceso == key
        ? http
            .createServer((req, res) => {
              if (req.url == "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                fs.readFile("index.html", "utf8", (err, html) => {
                  res.end(html);
                });
              }
              if (req.url == "/estilos") {
                res.writeHead(200, { "Content-Type": "text/css" });
                fs.readFile("estilos.css", (err, css) => {
                  res.end(css);
                });
              }
              const params = url.parse(req.url, true).query;
              const url_imagen = params.ruta;

              if (req.url.includes("/imagen")) {
                jimp.read(url_imagen, (err, imagen) => {
                  imagen
                    .resize(350, jimp.AUTO)
                    .grayscale()
                    .quality(60)
                    .writeAsync("newImg.jpg")
                    .then(() => {
                      fs.readFile("newImg.jpg", (err, Imagen) => {
                        res.writeHead(200, { "Content-Type": "image/jpeg" });
                        res.end(Imagen);
                      });
                    });
                });
              }
            })
            .listen(3000, () => console.log("Servidor encendido", process.pid))
        : console.log("Credenciales incorrectas");
    }
  )
  .help().argv;
