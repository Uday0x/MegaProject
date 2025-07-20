// boilderplate code

import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js"
import mongoose from "mongoose"
const getNotes = async (req, res) => {
  // get all notes
  const { projectId } = req.params


  if(!projectId){
    throw new ApiError(202,"project id not found",false)
  }
  
  const project = await Project.findById(mongoose.Types.ObjectId(projectId))

  const notes=await ProjectNote.find({
    project:mongoose.Types.ObjectId(projectId)
  }).populate("createdBy","username email fullname")


  return res.status(200).json(
    new (ApiResponse(200,notes,"notes fected successfully"))
  )

};

const getNoteById = async (req, res) => {
  // get note by id
};

const createNote = async (req, res) => {
  // create note
};

const updateNote = async (req, res) => {
  // update note
};

const deleteNote = async (req, res) => {
  // delete note
};

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
