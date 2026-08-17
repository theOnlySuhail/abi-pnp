import { Address } from 'abitype';
import { create } from 'zustand';

interface ContractAddressState {
  contractAddress: Address | undefined;
  chainId: number;
  actions: {
    setContractAddress: (contractAddress: Address) => void;
    setChainId: (chainId: number) => void;
  };
}

const useContractLocationStore = create<ContractAddressState>(set => ({
  contractAddress: undefined,
  chainId: 11155111, // sepolia testnet
  actions: {
    setContractAddress: (contractAddress: Address) =>
      set(() => ({ contractAddress: contractAddress })),
    setChainId: (chainId: number) => set(() => ({ chainId: chainId })),
  },
}));

export const useContractAddress = () =>
  useContractLocationStore(state => state.contractAddress);
export const useChainId = () => useContractLocationStore(state => state.chainId);

export const useContractLocationActions = () =>
  useContractLocationStore(state => state.actions);
