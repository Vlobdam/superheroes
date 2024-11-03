const express = require("express");
const parseHeroForm = require("../middleware/parseHeroForm");
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const firebaseMiddleware = require("../middleware/firebaseMiddleware");
const { 
  addHero,
  getHeroes,
  getHeroDetails,
  updateHero,
  deleteHero
} = require("../controllers/heroController");

const router = express.Router();
router.use(firebaseMiddleware);

router.get("/", getHeroes)
router.post("/", upload.array("images"), parseHeroForm, addHero)
router.get("/:heroId", getHeroDetails)
router.put("/:heroId", upload.array("images"), parseHeroForm, updateHero)
router.delete("/:heroId", deleteHero)

module.exports = router