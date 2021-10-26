#!/usr/bin/env node

const { options } = require('yargs')
const [,, ...args] = process.argv
// console.log(args)
const validate = args[0] ? true : false
const stats = args[1] ? true : false
const mdLinks = require('./index.js');
const argv = require('yargs')
             .option(`v`,{ alias: "validate",
             demandOption: false,
             describe: "Validar links"}).argv

             console.log(` 
                     
             😎😍    WELCOME TO MD-LINKS          😎😍
             
             
                💜   BY MARLYS RODRIGUEZ  💜           
                                                                              `);




mdLinks("C:\\Users\\USUARIO\\Documents\\BOG003-md-links\\mdLinks", {validate})
  .then((res) => {
   console.log("Respuesta final ", res);
  })
  .catch((err) => {
    console.log("Tienes un error ", err);
  });
