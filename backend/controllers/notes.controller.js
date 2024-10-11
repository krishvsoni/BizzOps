import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/notes.model.js";

const addNote = asyncHandler(async(req,res)=>{
    const { title, content} = req.body
    const owner = req.user?._id
    if(!title || !content){
        throw new ApiError(400,"All fields are required")
    }
    if(!owner){
        throw new ApiError(400,"Unauthorized request")
    }

    const note = Note.create({
        owner,
        title,
        content
    })

    return res
    .status(200)
    .json(new ApiResponse(200,note,"Note created successfully"))
})

const getNote = asyncHandler(async(req,res)=>{
    const ownerId = req.user?._id
    if(!ownerId){
        throw new ApiError(400,"Unauthorized request")
    }

    const notes = await Note.find({owner : ownerId})

    return res
    .status(200)
    .json(new ApiResponse(200, { notes }, "Notes retrieved successfully"));
})

const deleteNote = asyncHandler(async(req,res)=>{
    const ownerId = req.user?._id;
    const note = req.body;
    if(!note){
        throw new ApiError(400,"Note id is are required")
    }
    if(!owner){
        throw new ApiError(400,"Unauthorized request")
    }
    const deleteNote = await Note.findByIdAndDelete({owner:ownerId, _id:note})
    if(!deleteNote){
        throw new ApiError(400,"Error while deleting note")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,null, "Note deleted successfull"))
})

export {
    addNote,
    getNote,
    deleteNote
}