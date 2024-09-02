class RedisSet {
    constructor() {
        this.dataStore = new Map();
    }

    sadd(key, members) {
        if (!this.dataStore.has(key)) {
            this.dataStore.set(key, new Set());
        }
        const set = this.dataStore.get(key);
        let addedCount = 0;
        members.forEach(member => {
            if (!set.has(member)) {
                set.add(member);
                addedCount++;
            }
        });
        return addedCount;
    }

    srem(key, members) {
        if (!this.dataStore.has(key)) return 0;

        const set = this.dataStore.get(key);
        let removedCount = 0;
        members.forEach(member => {
            if (set.has(member)) {
                set.delete(member);
                removedCount++;
            }
        });
        return removedCount;
    }

    sismember(key, member) {
        if (!this.dataStore.has(key)) return 0;

        return this.dataStore.get(key).has(member) ? 1 : 0;
    }

    sinter(keys) {
        if (keys.length == 0) {
            return [];
        }

        const sets = keys.map(key => this.dataStore.get(key) || new Set());
        const intersection = sets.reduce((acc, set) => {
            return new Set([...acc].filter(x => set.has(x)));
        });

        return [...intersection];
    }

    scard(key) {
        if (!this.dataStore.has(key)) {
            return 0;
        }

        return this.dataStore.get(key).size;
    }

    sscan(key) {
        if (!this.dataStore.has(key)) {
            return `*0\r\n`;
        }

        const set = this.dataStore.get(key);
        let response = `*${set.size}\r\n`;
        for (const value of set) {
            response += `$${value.length}\r\n${value}\r\n`;
        }
        return response;
    }
}

RedisSetInstance = new RedisSet();

function handleSAddCommand(commandParts){
    const key = commandParts[4];
    const values = [];

    for(let i=6;i<commandParts.length;i+=2){
        values.push(commandParts[i]);
    }

    const addedCount = RedisSetInstance.sadd(key,values);
    return `:${addedCount}\r\n`;
}

function handleSScanCommand(commandParts) {
    const key = commandParts[4];
    const response = RedisSetInstance.sscan(key);
    return response;
}

function handleSRemCommand(commandParts) {
    const key = commandParts[4];
    const values = [];

    for(let i=6;i<commandParts.length;i+=2){
        values.push(commandParts[i]);
    }

    const removedCount = RedisSetInstance.srem(key,values);
    return `:${removedCount}\r\n`;
}

module.exports = {handleSAddCommand, handleSScanCommand,handleSRemCommand};