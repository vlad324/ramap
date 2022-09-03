import { OnRpcRequestHandler } from '@metamask/snap-types';

type InitiateOnRampRequest = {
  id: string,
  redirectUrl: string,
}

const supportedAssets = [
  'ETH_ETH',
  'MATIC_MATIC',
  'MATIC_USDC',
  'MATIC_DAI',
];

const mapSwapAssets = (chainId: string, asset: string): string => {
  let chainName = '';
  switch (chainId) {
    case '0x4': // rinkeby
      chainName = 'ETH';
      break;
    case '0x13881': // matic mumbai
      chainName = 'MATIC';
      break;
    default:
      throw new Error('Unsupported chain');
  }

  const result = chainName + '_' + asset;
  if (supportedAssets.indexOf(result) === -1) {
    console.log(result);
    throw new Error('Unsupported asset');
  }

  return result;
}

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'initiateOnRamp':
      const id = crypto.randomUUID();

      const addresses = await wallet.request({ method: 'eth_requestAccounts' });
      const walletAddress = addresses[0];
      const chainId = await wallet.request({ method: 'eth_chainId' });

      const swapAsset = encodeURIComponent(mapSwapAssets(chainId, request.asset));
      const swapAmount = encodeURIComponent(request.amount);
      const userAddress = encodeURIComponent(walletAddress);
      const hostAppName = encodeURIComponent('Ramap');
      const webhookStatusUrl = encodeURIComponent('https://us-central1-ramap-5041d.cloudfunctions.net/handleWebhook/' + id);

      const onRampUrl = 'https://widget.hackaton.ramp-network.org?' +
        `hostAppName=${hostAppName}` +
        `&swapAsset=${swapAsset}` +
        `&swapAmount=${swapAmount}` +
        `&userAddress=${userAddress}` +
        `&webhookStatusUrl=${webhookStatusUrl}` +
        '';

      return Promise.resolve({
        id: id,
        redirectUrl: onRampUrl,
      } as InitiateOnRampRequest);
    case 'queryStatus':
      throw new Error('Not implemented');
    default:
      throw new Error('Method not found.');
  }
};
