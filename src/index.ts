import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { IndexPage } from '@/landing';
import { getAllTokens, getToken } from '@/database';

const app = new Hono();

app.use('*', prettyJSON());
app.use('*', logger());

app.get('/', context => context.html(IndexPage()));

app.notFound(context => context.json({ code: 404, message: 'Not found' }, 404));

// Ideally don't want to pass the error to the client but well
app.onError((error, context) => context.json({ code: 500, message: error.message }, 500));

app.get('/tokens', context => context.json(getAllTokens()));

app.get('/token/:address', context => {
  const address = context.req.param('address');
  const token = getToken({ by: 'address', value: address });
  return context.json(token);
});

// with address as query parameter
app.get('/token', context => {
  const address = context.req.query('address');
  const token = getToken({ by: 'address', value: address });
  return context.json(token);
});

export default {
  port: process.env.PORT || 3003,
  fetch: app.fetch,
};
