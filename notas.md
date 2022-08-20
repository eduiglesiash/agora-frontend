# Notas para Ágora

## Sistema de búsqueda. ISBN

Después de buscar varias opciones de búsqueda de libros por ISNB de forma gratuita, la mejor opción que hemos encontrado ha sido Google API

https://www.googleapis.com/books/v1/volumes

https://www.googleapis.com/books/v1/volumes?q=9788414016336%2Bisbn&maxResults=1

## Mock Api 

Tenemos la librería de [JSON - Server](https://github.com/typicode/json-server) en local 
[JSON PlaceHolder](https://jsonplaceholder.typicode.com/) en internet. Lo que nos va a permitir gestionar los endpoint desde la red


## Colores de los estados 

Green: #5AA469
Red: #D35D6E
Yellow: #F8D49D
Purple: #6C5070
Grises: #efefef;

Para los Fondos de los bloques #213c60 
Con el texto en blanco

Colores relativos a los colores del escudo. 

red-pigment: ED1C24
platinum: E3E4E5
jonquil: EAC102
russian green: 60935D
spanish blue: 0071BC

## Fuentes

Para textos NOTO SANS de Google Fonts

## Botones

Cancelar con el border en azul o el color que corresponda el texto del mismo color 
Disabled con la opacidad al .5
Aceptar en el Azul 100%


## Dashboard de ejemplo 
https://colorlib.com/polygon/adminator/index.html

## Back con Strapi (https://strapi.io/)

http://localhost:1337/admin/auth/register?registrationToken=eafa2d666a6aebec77d1b848069a2a6502e17507


Sombreado: 
box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
.bg-purple {
    color: #fff;
    background: -webkit-linear-gradient(110deg, #a60af3 40%, rgba(0, 0, 0, 0) 30%), -webkit-radial-gradient(farthest-corner at 0% 0%, #7a00cc 70%, #c03fff 70%);
    background: -o-linear-gradient(110deg, #a60af3 40%, rgba(0, 0, 0, 0) 30%), -o-radial-gradient(farthest-corner at 0% 0%, #7a00cc 70%, #c03fff 70%);
    background: -moz-linear-gradient(110deg, #a60af3 40%, rgba(0, 0, 0, 0) 30%), -moz-radial-gradient(farthest-corner at 0% 0%, #7a00cc 70%, #c03fff 70%);
    background: linear-gradient(110deg, #a60af3 40%, rgba(0, 0, 0, 0) 30%), radial-gradient(farthest-corner at 0% 0%, #7a00cc 70%, #c03fff 70%);
}

.bg-spring {
    background: -webkit-linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), -webkit-linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
    background: -o-linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), -o-linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
    background: -moz-linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), -moz-linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
    background: linear-gradient(70deg, #fff810  30%, rgba(0,0,0,0) 30%), linear-gradient(30deg, #63e89e 60%, #ff7ee3 60%);
}

https://blog.prototypr.io/css-only-multi-color-backgrounds-4d96a5569a20
