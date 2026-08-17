import { useQuery } from '@tanstack/react-query';
import { Abi, Address } from 'abitype';
import type { AbiFunctionWithId } from '../types/index';
import contractService from '../services/contractService';
import { Abi as AbiSchema } from 'abitype/zod';
import { useContractAddress, useChainId } from '../stores/useContractStore';

const extractFunctions = (abi: Abi, contractAddress: Address) =>
  abi
    .filter(item => item.type === 'function')
    .map(fn => ({
      ...fn,
      id: contractAddress + fn.name,
    })) as AbiFunctionWithId[];

function useContract() {
  const contractAddress = useContractAddress();
  const chainId = useChainId();

  const {
    data,
    isPending,
    error: AbiError,
  } = useQuery({
    queryKey: ['contracts', contractAddress, chainId],
    queryFn: async (): Promise<{
      contractSource: string;
      abi: Abi;
      functions: AbiFunctionWithId[];
    }> => {
      const contract = await contractService.contractSource(chainId, contractAddress!);
      if (!contract) {
        throw new Error(
          `No contract found at address ${contractAddress} or the source code is not verified on Etherscan`,
        );
      } 

      const parsedAbi = AbiSchema.safeParse(contract.abi);
      if (!parsedAbi.success) {
        throw new Error(`Invalid ABI: ${parsedAbi.error}`);
      }

      return {
        contractSource: contract.source,
        abi: parsedAbi.data,
        functions: extractFunctions(parsedAbi.data, contractAddress!),
      };
    },
    enabled: !!contractAddress,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    contractSource: data?.contractSource,
    abi: data?.abi,
    contractFunctions: data?.functions,
    isPending,
    AbiError,
  };
}

export default useContract;
