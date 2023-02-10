const isProduction = process.env.RAILWAY_ENVIRONMENT && process.env.RAILWAY_ENVIRONMENT.length > 0;
const BASE_URL = isProduction
  ? 'https://token-search-production.up.railway.app'
  : 'http://0.0.0.0:3003';

export const IndexPage = () => (
  <h4>
    Try this example{' '}
    <a
      href={`${BASE_URL}/token?address=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab`}
      target="_blank"
    >
      {BASE_URL}/token?address=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
    </a>
    <br />
    <br />
    or this example{' '}
    <a href={`${BASE_URL}/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab`} target="_blank">
      {BASE_URL}/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
    </a>
  </h4>
);
