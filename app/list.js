class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.index = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.indexCounter = 0;
    }

    append(data) {
        const newNode = new Node(data.key, data.value);
        newNode.index = this.indexCounter++;
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    prepend(data) {
        const newNode = new Node(data.key, data.value);
        newNode.index = this.indexCounter++;
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        this.length++;
        this.updateIndexesFromHead();
    }

    remove(data) {
        if (this.head === null) return;

        if (this.head.key === data.key && this.head.value === data.value) {
            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
            } else {
                this.head = this.head.next;
            }
            this.length--;
            this.updateIndexesFromHead();
        } else {
            let current = this.head;
            while (current.next !== null && (current.next.key !== data.key || current.next.value !== data.value)) {
                current = current.next;
            }

            if (current.next !== null) {
                if (current.next === this.tail) {
                    this.tail = current;
                }
                current.next = current.next.next;
                this.length--;
                this.updateIndexesFromHead();
            }
        }
    }

    find(key) {
        let current = this.head;
        while (current !== null && current.key !== key) {
            current = current.next;
        }
        return current;
    }

    getHead() {
        return this.head;
    }

    getTail() {
        return this.tail;
    }

    updateIndexesFromHead() {
        let current = this.head;
        let index = 0;
        while (current !== null) {
            current.index = index++;
            current = current.next;
        }
        this.indexCounter = index;
    }

    getNodeByIndex(index) {
        let current = this.head;
        while (current !== null) {
            if (current.index === index) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
}

// Create a new instance of the list
const list = new LinkedList();

function handleLPushCommand(commandParts) {
    const key = commandParts[4];
    const value = commandParts[6];
    list.append({ key, value });
    return `:${list.length}\r\n`;
}

function handleLFindCommand(commandParts) {
    const key = commandParts[4];
    const node = list.find(key);
    if (node !== null) {
        return `+${node.value}\r\n`;
    } else {
        return "$-1\r\n";
    }
}

function handleLDelCommand(commandParts) {
    const key = commandParts[4];
    const value = commandParts[6];
    list.remove({ key, value });
    return `:${list.length}\r\n`;
}

module.exports = { handleLPushCommand, handleLFindCommand ,handleLDelCommand};
