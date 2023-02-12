import { type Chain } from './types';

const exampleTokenAddress = '0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab';

const Layout = (properties: { children?: string }) => (
  <html style="background:#f0f3ff;">
    <body>{properties.children}</body>
  </html>
);

type IIndexPage = (properties: { baseURL: string; chains: ReadonlyArray<Chain> }) => string;

export const IndexPage: IIndexPage = ({ baseURL, chains }) => (
  <Layout>
    <h2>Supported Chains</h2>
    <ul>
      {chains.map(chain => (
        <li key={chain}>
          <a href={`${baseURL}/${chain}?pretty`} target="_blank">
            {chain}
          </a>
        </li>
      ))}
    </ul>
    <h4>
      Try this example{' '}
      <a href={`${baseURL}/ethereum/token?address=${exampleTokenAddress}`} target="_blank">
        {baseURL}/ethereum/token?address={exampleTokenAddress}
      </a>
      <br />
      <br />
      or this example{' '}
      <a href={`${baseURL}/ethereum/token/${exampleTokenAddress}`} target="_blank">
        {baseURL}/ethereum/token/{exampleTokenAddress}
      </a>
      <br />
      <br />
      or see all tokens on ethereum{' '}
      <a href={`${baseURL}/ethereum/tokens?pretty`} target="_blank">
        {baseURL}/ethereum/tokens
      </a>
    </h4>
  </Layout>
);
