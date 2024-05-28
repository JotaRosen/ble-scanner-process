const noble = require('@abandonware/noble');
const fs = require('fs');

let counter = 0;
noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    noble.startScanning();
    console.log('Escaneando dispositivos BLE...');
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', (device) => {
    counter = counter + 1;

    console.log('Dispositivo encontrado:', device.advertisement.localName, device.id);

  const manufacturerDataBuffer = device.advertisement.manufacturerData;
  let hexBuffer
  let firstInt
  if (manufacturerDataBuffer) {
    // console.log('Datos del fabricante (Buffer):', manufacturerDataBuffer);
    hexBuffer = manufacturerDataBuffer.toString('hex')
    console.log(manufacturerDataBuffer.toString('hex'));

    
    // const buffer = Buffer.from(manufacturerDataBuffer);
    // const text = buffer.toString('utf8');
    // console.log('text: ',text); 

    // Leer datos binarios específicos
    if (manufacturerDataBuffer.length >= 4) {
      firstInt = manufacturerDataBuffer.readUInt32LE(0);
      console.log('Primer entero:', firstInt);
    }
  }

  const lineaAEscribir = `${counter} dev Id: ${device.id} | Hex Buffer: ${hexBuffer} | Primer Entero: ${firstInt} \n`

// Escribir el contenido en el archivo
    fs.appendFile('dispositivos.txt', lineaAEscribir , (error) => {
    if (error) {
        console.error('¡Hubo un error al escribir el archivo:', error);
    } else {
        console.log('¡El archivo se ha escrito correctamente!');
    }
    });
    // Detener el escaneo después de encontrar un dispositivo (opcional)
    setTimeout(() => {
        noble.stopScanning();

    }, 500)
});

// 4c001005451c3393e2
