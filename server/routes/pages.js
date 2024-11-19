import { Router } from 'express';

import * as pages from '../controllers/pages.js';


const pagesRouter = Router();

pagesRouter.get('/', pages.getHomePage);
pagesRouter.get('/map', pages.getMapPage);
pagesRouter.get('/query', pages.getQueryPage);

export default pagesRouter;