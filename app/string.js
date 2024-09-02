const data = {};

function handleSetCommand(commandParts) {
    const key = commandParts[4];
    const value = commandParts[6];
    data[key] = value;
    return "+OK\r\n";
}

function handleGetCommand(commandParts) {
    const key = commandParts[4];
    console.log(data);
    if (key in data) {
        console.log(key);
        const value = data[key];
        console.log(value);
        return `$${value.length}\r\n${value}\r\n`;
    } else {
        return "$-1\r\n";
    }
}

function handleMGetCommand(commandParts) {
    const keys = [];
    for(let i=4;i<commandParts.length;i+=2){
        if (commandParts[i].startsWith("$")) continue;
        keys.push(commandParts[i]);
    }

    let response = "*" + keys.length + "\r\n";
    
    keys.forEach((key) => {
        if (key in data) {
            const value = data[key];
            response += "$" + value.length + "\r\n" + value + "\r\n";
        } else {
            response += "$-1\r\n";
        }
    });
    
    return response;
}

function handleDelCommand(commandParts) {
    const key = commandParts[4];
    if (key in data) {
        delete data[key];
        return ":1\r\n";
    } else {
        return ":0\r\n";
    }
}

module.exports = { handleSetCommand, handleGetCommand, handleDelCommand, handleMGetCommand };