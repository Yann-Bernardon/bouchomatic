import { makeServer } from '../server/server';

if (process.env.NODE_ENV === 'development') {
    makeServer();
}
