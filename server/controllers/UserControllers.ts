import { Request, Response } from "express"
import Thumbnail from "../models/Thumbnail.js";

// Controllers to get all User Thumbnails 
export const getUsersThumbnails = async (req: Request, res: Response) => {
    try{
        const { userId } = req.session;
        const thumbnail = await Thumbnail.find({userId}).sort({createdAt: -1});

        res.json({thumbnail});
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

// Controller to get a single Thumbnail of a User 
export const getThumbnailById = async (req: Request, res: Response) => {
    try{
        const { userId } = req.session;
        const { id } = req.params;
        
        const thumbnail = await Thumbnail.findOne({userId, _id: id});
        res.json(thumbnail);
    }catch(err: any){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}