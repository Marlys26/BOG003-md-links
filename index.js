// // Modulos nativos de node
const fs = require("fs");
const path = require("path");
const resolve = require("path").resolve;
//Librerias adicionales//
const FileHound = require("filehound");
const { default: axios } = require("axios");
const marked = require("marked");

const isDirectory = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stat) => {
      if (err) return reject("No hay un directorio en esta ruta", err);
      return resolve(stat.isDirectory());
    });
  });
};

const getFilesFromDirectory = (ruta) => {
  return new Promise((resolve, reject) => {
    FileHound.create()
      .paths(ruta)
      .ext(".md")
      .find()
      .then((res) => {
        resolve(res);
        //console.log(res)
      })
      .catch((err) => {
        reject(err, "No hay archivos md en el directorio");
      });
  });
};

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(getLinks(data, path));
    });
  });
};

const getLinks = (textfile, file) => {
  let arrayLink = [];
  const renderer = new marked.Renderer();
  renderer.link = (href, _title, text) => {
    arrayLink.push({
      href: href,
      text: text,
      file: file,
    });
  };
  marked(textfile, { renderer: renderer });
  return arrayLink;
};

const status = (Link) => {
  return new Promise((resolve, reject) => {
    axios
      .get(Link.href)
      .then((response) => {
        resolve({
          href: Link.href,
          text: Link.text,
          file: Link.file,
          status: response.status,
          ok: response.statusText,
        });
      })
      .catch((error) => {
        resolve({
          href: Link.href,
          text: Link.text,
          file: Link.file,
          status: error.errno,
          statusText: "Fail",
        });
      });
  });
};

// Inicio de Función mdLinks //
const mdLinks = (path, options) => {
  const absolutePath = resolve(path);
  return new Promise((resolve, reject) => {
    isDirectory(absolutePath)
      .then((res) => {
        if (res) {
          return getFilesFromDirectory(absolutePath).then((files) => {
            const promisesArrays = files.map((file) => {
              return readFile(file);
            });
            Promise.all(promisesArrays).then((links) => {
              const newLinks = links.flat();
              if (options.validate === false) {
                resolve(newLinks);
              } else {
                const promiseArray = newLinks.map((file) => {
                  return status(file);
                });
                Promise.all(promiseArray).then((linksStatus) => {
                  resolve(linksStatus);
                });
              }
            });
          });
        } else {
          readFile(absolutePath).then((res) => {
            if (options.validate === false) {
              resolve(res);
            } else {
              const promiseArray = res.map((file) => {
                return status(file);
              });
              Promise.all(promiseArray).then((linksStatus) => {
                resolve(linksStatus);
              });
            }
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};


//Ruta directorio de prueba
// C:\\Users\\USUARIO\\Documents\\BOG003-md-links\\mdLinks

module.exports = mdLinks;