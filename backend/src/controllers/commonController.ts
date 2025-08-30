/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { Patient } from '../models/patientModel';
import sendEmail from '../utils/sendEmail';
import logger from '../utils/logger'
 
// Get All
export const getAllController = async (req: Request, res: Response): Promise<any> => {

    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const search = (req.query.search as string)?.trim() || "";
        const sortBy = (req.query.sortBy as string) || "name";
        const sortOrder = req.query.order === "desc" ? -1 : 1;
 
        const skip = (page - 1) * limit;
 
        const searchQuery = {
            $and: [
                { isActive: true },
                search
                ? {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                        { phone: { $regex: search, $options: "i" } },
                    ],
                    }
                : {},
            ],
        }
 
        const response = await Patient.find(searchQuery)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
 
        const total = await Patient.countDocuments(searchQuery);
        const totalPages = Math.ceil(total / limit);

        // sendEmail("skcreations0110@gmail.com", "Fetched data successfully.")

        logger.info('GET ALL table route hit');
 
        res.status(200).send({
            code: 200,
            status: "SUCCESS",
            message: "Fetched data successfully.",
            data: {
                success: true,
                message: "Fetched data successfully.",
                data: response,
                total,
                totalPages,
                currentPage: page,
                limit,
            }
        });
    } catch (err) {
        res.status(500).send({ 
            code: 500,
            status: "FAILURE",
            message: "Failed to fetch data" ,
            data: err
        });
    }
};
 
// Get One
export const getOneController = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await Patient.findById(req.params.id);
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

        const response = await Patient.create(req.body);

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

        const response = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
        
        const response = await Patient.findByIdAndDelete(req.params.id);

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