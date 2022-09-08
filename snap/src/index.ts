import { OnRpcRequestHandler } from '@metamask/snap-types';

type InitiateOnRampResponse = {
  id: string,
  redirectUrl: string
}

type PaymentStatus = {
  id: string
  status: string
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
    case '0x1': // mainnet
    case '0x3': // ropsten
    case '0x4': // rinkeby
    case '0x5': // görli
      chainName = 'ETH';
      break;
    case '0x89': // matic mumbai
    case '0x13881': // matic mumbai
      chainName = 'MATIC';
      break;
    default:
      throw new Error('Unsupported chain');
  }

  // todo: fetch supported assets

  const result = chainName + '_' + asset;
  if (supportedAssets.indexOf(result) === -1) {
    console.log(result);
    throw new Error('Unsupported asset');
  }

  return result;
}

let paymentId: string;

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'initiateOnRamp':
      paymentId = crypto.randomUUID();

      const chainId = await wallet.request({ method: 'eth_chainId' });

      const url = request.url || 'https://buy.ramp.network/';
      const swapAsset = encodeURIComponent(mapSwapAssets(chainId, request.asset));
      const swapAmount = encodeURIComponent(request.amount);
      const userAddress = encodeURIComponent(request.walletAddress);
      const hostAppName = encodeURIComponent('Ramap');
      const webhookStatusUrl = encodeURIComponent('https://us-central1-ramap-5041d.cloudfunctions.net/handleWebhook/' + paymentId);

      const onRampUrl = `${url}?` +
        `hostAppName=${hostAppName}` +
        `&swapAsset=${swapAsset}` +
        `&swapAmount=${swapAmount}` +
        `&userAddress=${userAddress}` +
        `&webhookStatusUrl=${webhookStatusUrl}` +
        '';

      return Promise.resolve({
        id: paymentId,
        redirectUrl: onRampUrl,
      } as InitiateOnRampResponse);
    case 'queryStatus':
      if (!request.paymentId) {
        throw new Error("PaymentId is missing");
      }

      return fetch('https://us-central1-ramap-5041d.cloudfunctions.net/getPaymentStatus/' + request.paymentId)
        .then(response => response.json())
        .then(response => response as PaymentStatus);
    default:
      throw new Error('Method not found.');
  }
};
