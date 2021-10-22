// // Modulos nativos de node
const fs = require("fs");
const path = require("path");
const resolve = require("path").resolve;
//Libreria adicional// 
const FileHound = require('filehound'); //Instalada//
const fetch = require("node-fetch"); //Instalada no usada//
const axios = require("axios"); //Instalada//
const marked = require("marked");

const isDirectory = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stat) => {
      if(err) return reject("No hay un directorio en esta ruta",err);
      return resolve(stat.isDirectory());
    })
  })
}

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
          })
  
});
}

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(getLinks(data, path));

    })
  })
}

const getLinks = (textfile, file) => {
  let arrayLink = [];
  const renderer = new marked.Renderer();
  renderer.link = (href, _title, text) => {
    arrayLink.push({
      href: href,
      text: text,
      file: file,
    });
  }
  marked(textfile, { renderer: renderer });
  return arrayLink;
}


// Inicio de Función mdLinks // 
const mdLinks = (path, options) => {
  const absolutePath = resolve(path);
  return new Promise((resolve, reject) => {
    isDirectory(absolutePath)
      .then((res)=> {
        if(res === true) {
          return getFilesFromDirectory(absolutePath).then((files) => {
            files.forEach(file =>{
              readFile(file).then((res) => {
              })
            })
          })
        } else {
          resolve(readFile(absolutePath))
        }
      })
      .catch((err) => {
        reject(err);
      })
  });
};


mdLinks("filetest.md")
.then((res) => {
 console.log("Respuesta final ", res);
})
.catch((err) => {
  console.log("Error", err);
})

//Ruta directorio de prueba
// C:\\Users\\USUARIO\\Documents\\BOG003-md-links\\mdLinks 

//module.exports = mdLinks