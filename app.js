const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const port = process.env.PORT || 0;

let qrHtml = "Generando código QR, por favor, actualiza la página en unos segundos...";

app.get('/', (req, res) => {
    res.send(qrHtml);
});

const client = new Client();

client.on('qr', qr => {
    console.log('QR recibido, generando imagen...');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error al generar el código QR', err);
            qrHtml = "Error al generar el código QR. Por favor, revisa la consola.";
            return;
        }
        qrHtml = `<img src="${url}">`;
        console.log('Código QR generado');
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    if (message.body === 'Hola') {
        client.sendMessage(message.from, '¡Hola! ¿Cómo estás?');
    }
});

client.initialize();

const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${server.address().port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('El puerto está en uso. Intentando con otro puerto...');
        app.listen(0);
    }
});
