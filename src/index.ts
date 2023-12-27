import crypto from "crypto";

interface BlockShape {
    hash: string; // 해쉬 값
    prevHash: string; // 이전 해쉬 값
    height: number; // 블록의 위치를 표시해주는 숫자
    data: string;
}

class Block implements BlockShape {
    public hash: string;
    constructor (
        public prevHash: string,
        public height: number,
        public data: string,
        // hash 값은 prevHash, height, data 값을 이용해서 계산됨
        // 어떤 입력값의 해쉬는 항상 같은 값이 나옴
        ) {
            this.hash = Block.calculateHash(prevHash, height, data);
        }
        static calculateHash(prevHash: string, height: number, data: string) {
            const toHash = `${prevHash}${height}${data}`;
            return crypto.createHash("sha256").update(toHash).digest("hex");
        }
}

class BlockChain {
    private blocks: Block[];
    constructor() {
        this.blocks = [];
    }
    private getPrevHash() {
        if(this.blocks.length === 0) return ""
        return this.blocks[this.blocks.length - 1].hash;
    }
    public addBlock(data: string) {
        const newBlock = new Block(this.getPrevHash(), this.blocks.length + 1, data)
        this.blocks.push(newBlock);
    }
    public getBlocks() {
        return [...this.blocks];
    }
}

const blockchain = new BlockChain();

blockchain.addBlock("First one");
blockchain.addBlock("Second one");
blockchain.addBlock("Third one");
blockchain.addBlock("Fourth one");

console.log(blockchain.getBlocks());