import sugestaoService from "../services/sugestaoService.js";
import { ObjectId } from "mongodb";
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import logService from "../services/logService.js";
import jwt from "jsonwebtoken";

const normalizeFrasesPayload = (frases) => {
  if (!Array.isArray(frases)) return [];
  return frases
    .map((item) => {
      if (typeof item === "string") {
        const texto = item.trim();
        return texto ? { texto, ofensiva: true } : null;
      }
      if (item && typeof item === "object") {
        const texto = String(item.texto || "").trim();
        if (!texto) return null;
        const categoriaRaw = item.categoria || item.motivo || item.label || item.class;
        const categoria = categoriaRaw ? String(categoriaRaw).trim() : null;
        return {
          texto,
          ofensiva: item.ofensiva !== undefined ? Boolean(item.ofensiva) : true,
          categoria: categoria || null,
        };
      }
      return null;
    })
    .filter(Boolean);
};

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
      //console.log("REQ BODY:", req.body);
      //console.log("REQ FILE:", req.file);
      const dados = JSON.parse(req.body.dados);
      const { idUser, url, motivo, tipo, frases } = dados;
      const foto = req.files && req.files['foto'] && req.files['foto'][0] ? req.files['foto'][0].filename : undefined;
      let situacao = "Pendente"
      let creatorLevel = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1];
        try{
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          creatorLevel = Number(decoded.permissoes ?? 0);
        } catch(e){
          creatorLevel = null;
        }
      }

      if(creatorLevel >= 1){
        situacao = "Aceito"
      }
      else{
        situacao = "Pendente"
      }

      const sugestao = await sugestaoService.createSugestao({
        idUser,
        url,
        motivo,
        frases: normalizeFrasesPayload(frases),
        tipo,
        foto,
        situacao
      });
      res.status(201).json(sugestao);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


const  getAllSugestao= async (req, res) => {
    try {
      const filtros = {
        tipo: req.query.tipo,
        situacao: req.query.situacao,
        dia: req.query.dia,
        mes: req.query.mes,
        ano: req.query.ano,
      };

      const sugestao = await sugestaoService.getAll(filtros);
      res.status(200).json(sugestao);
    } catch (error) {
      console.error(error);
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
    //console.log(error)
  }
}

  const updateSugestao = async (req,res)=>{
    try{
      if (!ObjectId.isValid(req.params.id)) return res.sendStatus(400);
      
        const { idUser, url, motivo, tipo, situacao, frasesSelecionadas } = req.body;
        
        const payload = {
          
          ...(idUser !== undefined && { idUser }),
          ...(url !== undefined && { url }),
          ...(motivo !== undefined && { motivo }),
          ...(tipo !== undefined && { tipo }),
          ...(situacao !== undefined && { situacao }),
          ...(frasesSelecionadas !== undefined && { frasesSelecionadas: normalizeFrasesPayload(frasesSelecionadas) }),
        };  

        if (req.file){
          payload.foto = req.file.path.replace(/\\/g, "/");
        }

        const sugestao = await sugestaoService.update(req.params.id, payload, req.user.id);


      

        res.status(200).json(sugestao);
      } catch(error) {
      //console.log(error);
      res.sendStatus(500);
    }
  }

  export default {
    getAllSugestao,updateSugestao,getOneSugestao,createSugestao: [
      (req, res, next) => {
        //console.log("Content-Type Header:", req.headers['content-type']);
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
