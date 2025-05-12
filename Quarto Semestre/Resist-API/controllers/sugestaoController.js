import sugestaoService from "../services/sugestaoService.js";
import { ObjectId } from "mongodb";

const  createSugestao= async (req, res) => {
    try {
      const sugestao = await sugestaoService.createSugestao(req.body);
      res.status(201).json(sugestao);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


const  getAllSugestao= async (req, res) => {
    try {
      const sugestao = await sugestaoService.getAll();
      res.status(200).json(sugestao);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

const getOneSugestao = async (req,res)=>{
  try{
    if (ObjectId.isValid(req.params.id)){
      const id = req.params.id;
      const sugestao = await sugestaoService.getOne(id)
      res.status(200).json(sugestao)
    }else{
      res.sendStatus(400);
    }
  }catch(error){
    console.log(error)
  }
}

const updateSugestao = async (req,res)=>{
  try{
    if (ObjectId.isValid(req.params.id)){
      const id = req.params.id;
      const {idUser,url,motivo,tipo,situacao,foto} = req.body;
      const sugestao = await sugestaoService.update(id,idUser,url,motivo,tipo,situacao,foto);
      res.status(200).json(sugestao)
    }else{
      res.sendStatus(400);
    }
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
}
  export default {
    getAllSugestao,updateSugestao,getOneSugestao,createSugestao
  };