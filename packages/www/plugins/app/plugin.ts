//stackpress
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {
  server.on('listen', async _ => {
    //on error, show error page
    server.on('error', () => import('./pages/error.js'));
    server.on('error', '@/plugins/app/views/error', -100);
    //on response, check for errors
    server.on('response', async (req, res, ctx) => {
      if (res.error) {
        await ctx.emit('error', req, res);
      }
    });
  });
  server.on('route', async _ => {
    server.get('/', '@/plugins/app/views/home', -100);
    server.get('/future', '@/plugins/app/views/future', -100);
  });
}; 