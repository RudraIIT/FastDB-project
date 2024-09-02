const net = require('net');
const {handleSetCommand,handleGetCommand,handleDelCommand,handleMGetCommand} = require('./string.js');
const {handleLPushCommand,handleLFindCommand,handleLDelCommand} = require('./list.js');
const {handleSAddCommand,handleSScanCommand,handleSRemCommand} = require('./set.js');

const server = net.createServer((socket) => {

    console.log("Client connected");

    socket.on('data', (data) => {
        const response = handleCommand(data);
        socket.write(response);
    });

    socket.on('end', () => {
        console.log("Client disconnected");
    });

    socket.on('error', (error) => {
        console.log("Error: ", error);
    });
});

server.listen(6379, "127.0.0.1", () => {
    console.log("Server started at port 6379");
});

// function for commandline interface

// function handleCommand(data) {
//     const commandParts = data.toString().trim().split("\r\n");
//     console.log(commandParts);
//     const command = commandParts[2].toUpperCase();

//     switch (command) {
//         case "PING":
//             return "+PONG\r\n";
//         case "SET":
//             return handleSetCommand(commandParts);
//         case "GET":
//             return handleGetCommand(commandParts);
//         case "MGET":
//             return handleMGetCommand(commandParts);
//         case "DEL":
//             return handleDelCommand(commandParts);
//         case "LPUSH":
//             return handleLPushCommand(commandParts);
//         case "LFIND":
//             return handleLFindCommand(commandParts);
//         case "LDEL":
//             return handleLDelCommand(commandParts);
//         case "SADD":
//             return handleSAddCommand(commandParts);
//         case "SSCAN":
//             return handleSScanCommand(commandParts);
//         case "SREM":
//             return handleSRemCommand(commandParts);
//         default:
//             return "-ERR unknown command '" + command + "'\r\n";
//     }
// }

// function for call through api's

function handleCommand(data) {
    const commandParts = data.toString().trim().split(" ");
    const command = commandParts[0].toUpperCase();
    // prepend something to commandParts upto index 3
    commandParts.unshift('dummy');
    commandParts.unshift('dummy');
    commandParts.unshift('dummy');

    // after index 4 add dummy values in between commandParts
    for(let i=5;i<commandParts.length;i+=2){
        commandParts.splice(i,0,'dummy');
    }
    
    switch (command) {
        case "PING":
            return "+PONG\r\n";
        case "SET":
            console.log(commandParts);
            return handleSetCommand(commandParts);
        case "GET":
            console.log(commandParts);
            return handleGetCommand(commandParts);
        case "MGET":
            return handleMGetCommand(commandParts);
        case "DEL":
            return handleDelCommand(commandParts);
        case "LPUSH":
            return handleLPushCommand(commandParts);
        case "LFIND":
            return handleLFindCommand(commandParts);
        case "LDEL":
            return handleLDelCommand(commandParts);
        case "SADD":
            return handleSAddCommand(commandParts);
        case "SSCAN":
            return handleSScanCommand(commandParts);
        case "SREM":
            return handleSRemCommand(commandParts);
        default:
            return "-ERR unknown command '" + command + "'\r\n";
    }
}