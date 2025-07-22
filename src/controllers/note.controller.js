// boilderplate code

import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js"
import mongoose from "mongoose"


const getNotes = async (req, res) => {
  // get all notes
  try {
    const { projectId } = req.params
  
  
    if (!projectId) {
      throw new ApiError(202, "project id not found", false)
    }
  
    const project = await Project.findById(mongoose.Types.ObjectId(projectId))
  
    const notes = await ProjectNote.find({
      project: mongoose.Types.ObjectId(projectId)
    }).populate("createdBy", "username email fullname")
  
  
    return res.status(200).json(
      new (ApiResponse(200, notes, "notes fected successfully"))
    )
  } catch (error) {
    return res.status(500).json(
      new (ApiError(200,"Something went wrong in fetching the notes",false))
    )
  }

};

const getNoteById = async (req, res) => {
  // get note by id


  try {
    const { noteId } = req.params

    if (!noteId) {
      throw new ApiError(404, "noteId not found")
    }
    const noteById = await ProjectNote.findById(noteId).populate("createdBy", "username email fullname") //no commas here //will have debudding issues

    if (!noteById) {
      throw new ApiError(404, "problem in getting notes by Id", false)
    }

    return res.status(200).json(
      new (ApiResponse(200, noteById, "Feteched notes by Id"))
    )
  }
  catch (error) {
    return new ApiError(200, "something went wrong in fetcging notesbyId", false)
  }
}
const createNote = async (req, res) => {
  //get the porjectID
  //validate either in the middleware or in the code
  //check if current user is the project member
  //create the note 

  try {
    const { projectId } = req.params;
    const { userContent } = req.body //projectId should be same what u gave in the route //keep an eye
    if (!projectId || !userContent) {
      throw new ApiError(200, "projectId or usercontent not found", false)
    }


    const project = await Project.findById(projectId)

    //members can be validated from teh middleware
    if (!project) {
      throw new ApiError(404, "Project not found", false)
    }


    const note = await ProjectNote.create({
      project: projectId,
      createdBy: req.user._id,
      content: userContent
    })

    await note.save(); //redudant here //just for sdafety purposes
    return res.status(200).json(
      new (ApiResponse(200, note, "careted the notes"))
    )
  } catch (error) {
      return new ApiError(200, "something went wrong in creating the note", false)
  }
}


const updateNote = async (req, res) => {
  try {
    // update note
    //get the projectId
    //get the content for the notes from the body
    //update the notes the notes in the content field
  
    const { projectId,noteId } = req.params;
    const { userContent } = req.body;
  
    if(!projectId || !userContent){
      throw new ApiError(200,"projectId and userCoontent not found",false)
    }
  
    const project = await Project.findById(projectId)
  
    if(!project){
      throw new ApiError(200,"project not found plz exit",false)
    }
  
    const note = await ProjectNote.findById(noteId);
    if(!note){
      throw new ApiError(200,"Note not found","false")
    }
  
    note.content= userContent;
    await note.save();

     return res.status(200).json(
    new (ApiResponse(200, note,"updated the note successfully"))
  )

  } catch (error) {
      throw new ApiError(200,"something went wrong in updating the note",false)
  }
};

const deleteNote = async (req, res) => {
  //delete note
  //we are choosing to delete the content

 try {
   const { projectId , noteId } = req.params
   if(!projectId || !noteId){ 
       throw new ApiError(404,"projectId and noteId not found",false)
   }
   
   const project = await Project.findById(projectId);
   const note = await ProjectNote.findById(noteId).populate("createdBy", "username email fullname")
   //this populate will give us who delted the note
 
 
   if(!project || !note){
     throw new ApiError(200,"project or note not found",false)
   }
 
   note.content = " ";
   await note.save();
    return res.status(200).json(
    new (ApiResponse(200, note,"note content cleared soft deleted successfully"))
  )
 } catch (error) {
   throw new ApiError(200,"something went wrong in deleting the note",false)
 }

};

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
