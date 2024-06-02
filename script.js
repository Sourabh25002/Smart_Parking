// var SerialPort=require("serialport");
// const parsers= SerialPort.parsers;
// const parser= new parsers.Readline({
//     delimiter:'\r\n'
// })
// var port= new SerialPort('COM3',{
//     baudRate:115200,
//     dataBits:8,
//     parity:'none',
//     stopBits:1,
//     flowControl: false
// })

// port.pipe(parser);
// parser.on('data',function(data){
//     console.log(data);
// })
// Example function to send data to the server

//MAIN CODE
// const SerialPort = require("serialport");

// const parsers = SerialPort.parsers;
// const parser = new parsers.Readline({
//     delimiter: '\r\n'
// });
// const port = new SerialPort('COM3', {
//     baudRate: 115200,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
// });

// port.pipe(parser);

// parser.on('data', async function(data) {
//     console.log(data);
//     await sendSerialDataToServer(data);
// });

// async function sendSerialDataToServer(data) {
//     const fetch = (await import('node-fetch')).default;

//     fetch('http://localhost:3000/serial-data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ data: data })
//     })
//     .then(response => response.text())
//     .then(responseData => {
//         console.log('Data sent successfully:', responseData);
//     })
//     .catch(error => {
//         console.error('Error sending data:', error);
//     });
// }

//servo code
// const SerialPort = require('serialport');
// const Readline = require('@serialport/parser-readline');

// const port = new SerialPort('COM3', { baudRate: 9600 }); // Specify your Arduino's COM port

// const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
// parser.on('data', console.log);

// function sendCommandToArduino(angle) {
//   port.write(angle.toString(), (err) => {
//     if (err) {
//       return console.error('Error writing to serial port:', err.message);
//     }
//     console.log(Command sent: ${angle});
//   });
// }

// // Example: Read angle from user input
// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// readline.question('Enter the angle (0-180) for the servo motor: ', (angle) => {
//   sendCommandToArduino(angle);
//   readline.close();
// });

//................
// const SerialPort = require("serialport");

// const parsers = SerialPort.parsers;
// const parser = new parsers.Readline({
//     delimiter: '\r\n'
// });
// const port = new SerialPort('COM3', {
//     baudRate: 115200,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
// });

// port.pipe(parser);

// parser.on('data', async function(data) {
//     console.log(data);
//     await sendSerialDataToServer(data);
// });

// async function sendSerialDataToServer(data) {
//     const fetch = (await import('node-fetch')).default;

//     fetch('http://localhost:3000/serial-data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ data: data })
//     })
//     .then(response => response.text())
//     .then(responseData => {
//         console.log('Data sent successfully:', responseData);
//     })
//     .catch(error => {
//         console.error('Error sending data:', error);
//     });
// }

// // Self-calling the function with hardcoded data
// (async () => {
//     await sendSerialDataToServer("Hardcoded data");
// })();

async function sendSerialDataToServer(data) {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("http://localhost:3000/serial-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    });
    const responseData = await response.text();
    console.log("Data sent successfully:", responseData);
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

// Self-calling the function with hardcoded data
(async () => {
  await sendSerialDataToServer("Hardcoded data");
})();

//////////////////////////////////////////
// var SerialPort = require("serialport");
// const parsers = SerialPort.parsers;
// const parser = new parsers.Readline({
//   delimiter: "\r\n",
// });
// var port = new SerialPort("COM3", {
//   baudRate: 9600,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });

// port.pipe(parser);
// parser.on("data", function (data) {
//   console.log(data);
// });
