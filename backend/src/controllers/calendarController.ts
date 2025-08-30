/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import {Patient} from '../models/patientModel';
import Shift from '../models/shiftModel';
const mongoose = require('mongoose');

 
// Get All
export const getAllController = async (req: Request, res: Response): Promise<any> => {

    try {

        const requestBody = req.body
  
        let searchQuery: any = {isActive: true};

        if (requestBody?.property) {
            if (requestBody?.value?.toLowerCase() == "all") {
                searchQuery = {isActive: true}
            } else {
                searchQuery[`${requestBody?.property}`] = requestBody?.value
            }
        }
 
        let response;

        if (searchQuery?.role || searchQuery?.department) {

            const resLvl1 = await Patient.find(searchQuery)
            const ids = resLvl1?.map((datum)=>datum?._id?.toString())
            console.log('ids => ', ids)
            const results = await Shift.find({
                userId: { $in: ids }
            });
            response = results

        } else {
            response = await Shift.find(searchQuery)
        }

        console.log('searchQuery => ', searchQuery, response) 
 
        res.status(200).send({
            code: 200,
            status: "SUCCESS",
            message: "Fetched data successfully.",
            data: response,
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            code: 500,
            status: "FAILURE",
            message: "Something went wrong!",
            data: err
        });
    }

};
 
// Get One
export const getOneController = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await Shift.findById(req.params.id);
        if (!response) return res.status(404).json({ message: 'Data not found' });

        if (response) {
            res.status(200).send({
                code: 200,
                status: "SUCCESS",
                message: "Successfully fetched data",
                data: response
            });
        } else {
            res.status(400).send({
                code: 400,
                status: "FAILURE",
                message: "Failed to fetch data",
                data: {}
            });
        }
        
    } catch (error) {
        res.status(500).send({
            code: 500,
            status: "FAILURE",
            message: "Something went wrong!",
            data: error
        });
    }
};

// Create controller
export const createController = async (req: Request, res: Response) => {

    try {

        const response = await Shift.create(req.body);

        if (response) {

            res.status(200).send({ 
                code: 200,
                status: 'SUCCESS',
                message: `Created successfully!`,
                data: response
            });

        } else {

            res.status(400).send({ 
                code: 400,
                status: 'FAILURE',
                message: `Failed to create!`,
                data: {}
            });
            
        }

    } catch (error) {

        res.status(500).send({ 
            code: 500,
            status: 'FAILURE',
            message: `Something went wrong!`,
            data: error
        });

    }

};

// Update controller
export const updateController = async (req: Request, res: Response): Promise<any> => {

    try {

        const response = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (response) {

            res.status(200).send({ 
                code: 200,
                status: 'SUCCESS',
                message: `Updated successfully!`,
                data: response
            });

        } else {

            res.status(400).send({ 
                code: 400,
                status: 'FAILURE',
                message: `Failed to update!`,
                data: {}
            });

        }

    } catch (error) {

        res.status(500).send({ 
            code: 500,
            status: 'FAILURE',
            message: `Something went wrong!`,
            data: error
        });

    }
    
};

// Delete controller
export const deleteController = async (req: Request, res: Response): Promise<any> => {
    
    try {
        
        const response = await Shift.findByIdAndDelete(req.params.id);

        if (response) {

            res.status(200).send({ 
                code: 200,
                status: 'SUCCESS',
                message: `Deleted successfully!`,
                data: response
            });

        } else {

            res.status(400).send({ 
                code: 400,
                status: 'FAILURE',
                message: `Failed to delete!`,
                data: {}
            });

        }
        

    } catch (error) {

        res.status(500).send({ 
            code: 500,
            status: 'FAILURE',
            message: `Something went wrong!`,
            data: error
        });

    }

};