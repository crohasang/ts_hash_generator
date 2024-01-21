"use strict";
// src/index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Block {
    constructor(prevHash, height, data) {
        this.prevHash = prevHash;
        this.height = height;
        this.data = data;
        this.hash = '';
    }
    static calculateHash(prevHash, height, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const toHash = `${prevHash}${height}${data}`;
            const encoder = new TextEncoder();
            const digest = yield window.crypto.subtle.digest('SHA-256', encoder.encode(toHash));
            return Array.from(new Uint8Array(digest))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hash = yield Block.calculateHash(this.prevHash, this.height, this.data);
        });
    }
}
class BlockChain {
    constructor() {
        this.blocks = [];
    }
    getPrevHash() {
        if (this.blocks.length === 0)
            return '';
        return this.blocks[this.blocks.length - 1].hash;
    }
    addBlock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlock = new Block(this.getPrevHash(), this.blocks.length + 1, data);
            yield newBlock.initialize();
            this.blocks.push(newBlock);
            // newBlock.hash = await Block.calculateHash(
            //   newBlock.prevHash,
            //   newBlock.height,
            //   newBlock.data
            // );
        });
    }
    getBlocks() {
        return [...this.blocks];
    }
}
const blockchain = new BlockChain();
function addBlockAndDisplay(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield blockchain.addBlock(data);
        const blocks = blockchain.getBlocks();
        const lastBlock = blocks[blocks.length - 1];
        const hashValueElement = document.getElementById('hashValue');
        if (hashValueElement) {
            hashValueElement.innerText = lastBlock.hash;
        }
        else {
            console.error('hashValue element not found');
        }
    });
}
window.addBlockAndDisplay = addBlockAndDisplay;
