import { OnRpcRequestHandler } from '@metamask/snap-types';

type InitiateOnRampRequest = {
  id: string,
  redirectUrl: string,
}

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'initiateOnRamp':
      const id = crypto.randomUUID();

      // todo: get address
      // todo: get chain

      const swapAsset = encodeURIComponent('ETH_ETH');

      const hostAppName = encodeURIComponent('MetaMask on-ramp');
      const url = encodeURIComponent('https://widget.hackaton.ramp-network.org');

      const onRampUrl = 'https://buy.ramp.network/?' +
        `&swapAsset=${swapAsset}` +
        `&hostAppName=${hostAppName}` +
        `&url=${url}` +
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
