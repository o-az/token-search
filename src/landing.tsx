import { chains } from './constants';

const isProduction = process.env.RAILWAY_ENVIRONMENT && process.env.RAILWAY_ENVIRONMENT.length > 0;
const BASE_URL = isProduction
  ? 'https://token-search-production.up.railway.app'
  : 'http://0.0.0.0:3003';

export const IndexPage = () => (
  <main>
    <h2>Supported Chains</h2>
    <ul>
      {chains.map(chain => (
        <li key={chain}>
          <a href={`${BASE_URL}/${chain}?pretty`} target="_blank">
            {chain}
          </a>
        </li>
      ))}
    </ul>
    <h4>
      Try this example{' '}
      <a
        href={`${BASE_URL}/ethereum/token?address=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab`}
        target="_blank"
      >
        {BASE_URL}/ethereum/token?address=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
      </a>
      <br />
      <br />
      or this example{' '}
      <a
        href={`${BASE_URL}/ethereum/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab`}
        target="_blank"
      >
        {BASE_URL}/ethereum/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
      </a>
      <br />
      <br />
      or see all tokens on ethereum{' '}
      <a href={`${BASE_URL}/ethereum/tokens?pretty`} target="_blank">
        {BASE_URL}/ethereum/tokens
      </a>
    </h4>
  </main>
);
