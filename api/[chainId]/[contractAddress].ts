import { createPublicClient, http, type Address, type Chain } from 'viem';
import { supportedChains } from '../../utils/chains.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ETHERSCAN_API_URL =
  `https://api.etherscan.io/v2/api?apikey=${process.env.ETHERSCAN_SECRET_KEY}` +
  `&chainid=%chainId%&address=%address%&module=contract&action=getsourcecode`;

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const chainId = req.query.chainId as string;
  const contractAddress = req.query.contractAddress as Address;

  try {
    const chain = getChain(chainId);
    if (!chain) {
      return res.status(400).json({ error: 'Unsupported chain' });
    }

    if (!(await isContract(chain, contractAddress))) {
      return res.status(404).json({ error: 'No contract found at this address' });
    }

    console.log('start etherscan fetch', Date.now());
    const response = await fetch(
      ETHERSCAN_API_URL.replace('%chainId%', chainId).replace('%address%', contractAddress),
    );
    console.log('end etherscan fetch', Date.now());

    const data = await response.json();

    if (data.message === 'NOTOK') {
      return res.status(400).json({ error: data.result });
    } else if (data.result[0].ABI === 'Contract source code not verified') {
      return res.status(400).json({ error: 'Contract source code not verified' });
    }

    res.json({ source: data.result[0].SourceCode, abi: JSON.parse(data.result[0].ABI) });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getChain = (chainId: string): Chain | undefined =>
  Object.values(supportedChains).find((c) => c.id === Number(chainId)) as Chain | undefined;

const isContract = async (chain: Chain, contractAddress: string) => {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  console.log('start getCode', Date.now());
  const bytecode = await publicClient.getCode({ address: contractAddress as Address });
  console.log('end getCode', Date.now());

  if (!bytecode || bytecode === '0x') {
    return false;
  }

  return true;
};

export default handler;
