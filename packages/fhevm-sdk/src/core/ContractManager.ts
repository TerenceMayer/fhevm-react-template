import { Contract, ContractInterface, Signer, providers } from 'ethers';
import { FhevmConfig, ContractConfig, FhevmTransaction } from '../types';

/**
 * Contract Manager
 * Simplifies interaction with FHEVM-enabled smart contracts
 */
export class ContractManager {
  private config: FhevmConfig;
  private contracts: Map<string, Contract> = new Map();

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Get or create a contract instance
   */
  getContract(address: string, abi: ContractInterface, signer: Signer): Contract {
    const key = `${address.toLowerCase()}`;

    if (!this.contracts.has(key)) {
      const contract = new Contract(address, abi, signer);
      this.contracts.set(key, contract);
    }

    return this.contracts.get(key)!;
  }

  /**
   * Call a contract read function
   */
  async call(
    address: string,
    abi: ContractInterface,
    signer: Signer,
    methodName: string,
    ...args: any[]
  ): Promise<any> {
    const contract = this.getContract(address, abi, signer);

    try {
      return await contract[methodName](...args);
    } catch (error) {
      throw new Error(`Contract call failed: ${error}`);
    }
  }

  /**
   * Send a contract transaction
   */
  async send(
    address: string,
    abi: ContractInterface,
    signer: Signer,
    methodName: string,
    ...args: any[]
  ): Promise<FhevmTransaction> {
    const contract = this.getContract(address, abi, signer);

    try {
      const tx = await contract[methodName](...args);
      return {
        hash: tx.hash,
        wait: async (confirmations?: number) => {
          const receipt = await tx.wait(confirmations);
          return {
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed,
            status: receipt.status,
            events: receipt.events,
          };
        },
      };
    } catch (error) {
      throw new Error(`Contract transaction failed: ${error}`);
    }
  }

  /**
   * Listen for contract events
   */
  on(
    address: string,
    abi: ContractInterface,
    provider: providers.Provider,
    eventName: string,
    callback: (...args: any[]) => void
  ): void {
    const contract = new Contract(address, abi, provider);
    contract.on(eventName, callback);
  }

  /**
   * Remove event listener
   */
  off(
    address: string,
    abi: ContractInterface,
    provider: providers.Provider,
    eventName: string,
    callback: (...args: any[]) => void
  ): void {
    const contract = new Contract(address, abi, provider);
    contract.off(eventName, callback);
  }

  /**
   * Get past events
   */
  async queryFilter(
    address: string,
    abi: ContractInterface,
    provider: providers.Provider,
    eventName: string,
    fromBlock?: number,
    toBlock?: number
  ): Promise<any[]> {
    const contract = new Contract(address, abi, provider);

    try {
      const filter = contract.filters[eventName]();
      return await contract.queryFilter(filter, fromBlock, toBlock);
    } catch (error) {
      throw new Error(`Event query failed: ${error}`);
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    address: string,
    abi: ContractInterface,
    signer: Signer,
    methodName: string,
    ...args: any[]
  ): Promise<bigint> {
    const contract = this.getContract(address, abi, signer);

    try {
      const gasEstimate = await contract.estimateGas[methodName](...args);
      return gasEstimate.toBigInt();
    } catch (error) {
      throw new Error(`Gas estimation failed: ${error}`);
    }
  }

  /**
   * Clear contract cache
   */
  clearCache(): void {
    this.contracts.clear();
  }
}
