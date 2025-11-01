import sugestaoService from "../services/sugestaoService.js";
import { ObjectId } from "mongodb";
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import logService from "../services/logService.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/sugestoes');
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) {
        console.error("Error generating random bytes for filename:", err);
        return cb(err, file.originalname);
      }
      const fileExtension = path.extname(file.originalname || '').toLowerCase();
      cb(null, `${hash.toString('hex')}${fileExtension}`);
    });
  },
});

const upload = multer({ storage: storage });

const  createSugestao= async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);
      console.log("REQ FILE:", req.file);
      const dados = JSON.parse(req.body.dados);
      const { idUser, url, motivo, tipo } = dados;

      const foto = req.files && req.files['foto'] && req.files['foto'][0] ? req.files['foto'][0].filename : undefined;

      const sugestao = await sugestaoService.createSugestao({
        idUser,
        url,
        motivo,
        tipo,
        foto,
      });
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
      if (!ObjectId.isValid(req.params.id)) return res.sendStatus(400);
      
        const { idUser, url, motivo, tipo, situacao } = req.body;
        
        const payload = {
          
          ...(idUser !== undefined && { idUser }),
          ...(url !== undefined && { url }),
          ...(motivo !== undefined && { motivo }),
          ...(tipo !== undefined && { tipo }),
          ...(situacao !== undefined && { situacao }),
        };  

        if (req.file){
          payload.foto = req.file.path.replace(/\\/g, "/");
        }
        
        const sugestao = await sugestaoService.update(
          req.params.id,
          req.body.idUser,
          req.body.url,
          req.body.motivo,
          req.body.tipo,
          req.body.situacao,
          req.file ? req.file.path.replace(/\\/g, "/") : undefined,
          req.user.id
        );


      

        res.status(200).json(sugestao);
      } catch(error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  export default {
    getAllSugestao,updateSugestao,getOneSugestao,createSugestao: [
      (req, res, next) => {
        console.log("Content-Type Header:", req.headers['content-type']);
        upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'dados', maxCount: 1 }])(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error("Multer Error:", err);
            return res.status(400).json({ message: err.message, code: err.code });
          } else if (err) {
            // An unknown error occurred when uploading.
            console.error("Unknown Upload Error:", err);
            return res.status(500).json({ message: `Erro ao fazer upload da imagem. ${err}`, error: err });
          }
          next();
        });
      },
      createSugestao,
    ],
  };