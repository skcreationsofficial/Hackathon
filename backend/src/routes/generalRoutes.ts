import express from 'express';
import {
    getAllController,
    getOneController,
    createController,
    updateController,
    deleteController
} from '../controllers/commonController';

const Router = express.Router();

Router.get('/getAll', getAllController);
Router.get('/getOne/:id', getOneController);
Router.post('/create', createController);
Router.patch('/update/:id', updateController);
Router.patch('/delete/:id', deleteController);
 
export default Router;