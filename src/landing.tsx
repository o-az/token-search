import type { Chain } from './types'
import { html } from 'hono/html'

const exampleTokenAddress = '0x2e3d870790dc77a83dd1d18184acc7439a53f475'

const LineBreak = () => html`<br /><br />`

const Link = (properties: { href: string; text: string }) => html`
	<a href=${properties.href} target='_blank' rel='noreferrer'>
		${properties.text}
	</a>
	`

export function IndexPage({ baseURL, chains }: { baseURL: string; chains: ReadonlyArray<Chain> }) {
  return (
    <Layout>
      <h2 style='font-weight:900;'>Supported Chains</h2>
      <ul>
        {chains.map((chain) => (
          <li key={chain}>
            <Link href={`${baseURL}${chain}?pretty`} text={chain} />
          </li>
        ))}
      </ul>
      <h4>
        Try this example{' '}
        <a
          href={`${baseURL}optimism/token?address=${exampleTokenAddress}`}
          target='_blank'
          rel='noreferrer'
        >
          {baseURL}optimism/token?address={exampleTokenAddress}
        </a>
        <LineBreak />
        or this example{' '}
        <a
          href={`${baseURL}optimism/token/${exampleTokenAddress}`}
          target='_blank'
          rel='noreferrer'
        >
          {baseURL}optimism/token/{exampleTokenAddress}
        </a>
        <LineBreak />
        or get token logo by address{' '}
        <a href={`${baseURL}optimism/logo/${exampleTokenAddress}`} target='_blank' rel='noreferrer'>
          {baseURL}optimism/logo/{exampleTokenAddress}
        </a>
        <LineBreak />
        or see all tokens on ethereum{' '}
        <a href={`${baseURL}ethereum/tokens?pretty`} target='_blank' rel='noreferrer'>
          {baseURL}ethereum/tokens
        </a>
      </h4>
      <LineBreak />
      <h4>Source code:</h4>
      <a href='https://github.com/o-az/token-search' target='_blank' rel='noreferrer'>
        https://github.com/o-az/token-search
      </a>
    </Layout>
  )
}

export function Layout(properties: { children: unknown }) {
  return html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="EVM token registry">
      <meta property="og:title" content="Token Search">
      <meta property="og:image" content="TODO">
      <title>Token Search</title>
      <style>
        * {
          background:rgba(231, 241, 239);
          color:rgba(72, 113, 397);
        }
      </style>
    </head>
    <body>
      ${properties.children}
    </body>
  </html>
`
}
