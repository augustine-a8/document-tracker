import {Request, Response} from 'express'
import {v4 as uuidv4} from 'uuid'

import { AppDataSource } from '../data-source'
import { Document } from '../entity'

const DocumentRepository = AppDataSource.getRepository(Document)

async function getAllDocuments(req: Request, res: Response) {
    const allDocuments = await DocumentRepository.find({})

    res.status(200).json({
        message: "Retrieved all documents",
        allDocuments
    })
}

async function getDocumentById(req: Request, res: Response) {
    const {id: document_id} = req.params
    const document = await DocumentRepository.findOneBy({document_id})

    if (!document) {
        res.status(404).json({
            message:  "Document does not exist",
            document: null
        })
    } else {
        res.status(200).json({
            message: "Document retrieved",
            document
        })
    }
}

async function addDocument(req: Request, res: Response) {
    const {title, description, serialNumber} = req.body

    if (!title) {
        res.status(400).json({
            message: "Document title is required"
        })
        return
    }
    if (!serialNumber) {
        res.status(400).json({
            message: "Document serial number is required"
        })
        return
    }

    const document = new Document()
    document.document_id = uuidv4()
    document.title = title
    document.description = description ? description : ""
    document.serialNumber = serialNumber

    await DocumentRepository.save(document)

    res.status(200).json({
        message: "New document added"
    })
}

async function updateDocument(req: Request, res: Response){
    const {id: document_id} = req.params
    const {title, description, serialNumber} = req.body

    const document = await DocumentRepository.findOneBy({document_id})
    if (!document) {
        res.status(404).json({
            message: "Document with id provided not found",
            document: null
        })
        return
    }

    if (title) {
        document.title = title
    }
    if (description) {
        document.description = description
    }
    if (serialNumber) {
        document.serialNumber = serialNumber
    }

    const updatedDocument = await DocumentRepository.save(document)

    res.status(200).json({
        message: "Document updated successfully",
        document: updatedDocument
    })
}

export {getAllDocuments, getDocumentById, addDocument, updateDocument}
