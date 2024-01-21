// src/index.ts
declare global {
  interface Window {
    addBlockAndDisplay: typeof addBlockAndDisplay;
  }
}

interface BlockShape {
  hash: string;
  prevHash: string;
  height: number;
  data: string;
}

class Block implements BlockShape {
  public hash: string;
  constructor(
    public prevHash: string,
    public height: number,
    public data: string
  ) {
    this.hash = '';
  }
  static async calculateHash(prevHash: string, height: number, data: string) {
    const toHash = `${prevHash}${height}${data}`;
    const encoder = new TextEncoder();
    const digest = await window.crypto.subtle.digest(
      'SHA-256',
      encoder.encode(toHash)
    );
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  async initialize() {
    this.hash = await Block.calculateHash(
      this.prevHash,
      this.height,
      this.data
    );
  }
}

class BlockChain {
  private blocks: Block[];
  constructor() {
    this.blocks = [];
  }
  private getPrevHash() {
    if (this.blocks.length === 0) return '';
    return this.blocks[this.blocks.length - 1].hash;
  }
  public async addBlock(data: string) {
    const newBlock = new Block(
      this.getPrevHash(),
      this.blocks.length + 1,
      data
    );
    await newBlock.initialize();
    this.blocks.push(newBlock);
    // newBlock.hash = await Block.calculateHash(
    //   newBlock.prevHash,
    //   newBlock.height,
    //   newBlock.data
    // );
  }
  public getBlocks() {
    return [...this.blocks];
  }
}

const blockchain = new BlockChain();

export async function addBlockAndDisplay(data: string) {
  await blockchain.addBlock(data);
  const blocks = blockchain.getBlocks();
  const lastBlock = blocks[blocks.length - 1];
  const hashValueElement = document.getElementById('hashValue');
  if (hashValueElement) {
    hashValueElement.innerText = lastBlock.hash;
  } else {
    console.error('hashValue element not found');
  }
}

window.addBlockAndDisplay = addBlockAndDisplay;
