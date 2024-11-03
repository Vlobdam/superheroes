const {
  uploadImage,
  deleteImage,
} = require("../util/imageUploader");


//from rtdb
const getHeroDetails = async (req, res) => {
  const { heroId } = req.params;

  const ref = req.db.ref("/heroes");
  const hero = await ref.child(heroId).once("value");

  if (!hero.exists()) {
    return res.status(404).json({ message: "Hero not found" });
  }
  
  return res.status(200).json(hero.val());
}

const getHeroes = async (req, res) => {
  const ref = req.db.ref("/heroes");
  let { limit = 5, page = 1 } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);

  try {
    const heroes = (await ref.once("value")).val();
    if (!heroes) {
      return res.status(200).json({
        heroes: [],
        meta: {
          total: 0,
          isThereNextPage: false,
          isTherePrevPage: false,
          next: null,
          prev: null,
          currentPage: 1,
          totalPages: 0
        }
      });
    }

    const lastPage =  Math.ceil(Object.keys(heroes).length / limit);

    const isThereNextPage = page < lastPage;
    const isTherePrevPage = page > 1;

    const meta = {
      total: Object.keys(heroes).length,
      totalPages: lastPage,
      isThereNextPage,
      isTherePrevPage,
      next: isThereNextPage ? `${process.env.BASE_URL}/heroes?limit=${limit}&page=${page + 1}` : null,
      prev: isTherePrevPage ? `${process.env.BASE_URL}/heroes?limit=${limit}&page=${page - 1}` : null,
      currentPage: page,
    }
    
    data = {
      heroes: Object.entries(heroes)
        .map(x => ({ ...x[1], id: x[0] }))
        .filter((_, i) => i >= (page - 1) * limit && i < page * limit),
      meta,
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error getting heroes" });
  }
}

const addHero = async (req, res) => {
  const ref = req.db.ref("/heroes");

  const {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    new_images,
  } = req.formData;

  if (!nickname) {
    return res.status(400).json({ message: "Nickname is required" });
  }

  if (!new_images || new_images.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  const images = [];

  for (const image of new_images) {
    try {
      const { id, deleteHash, url } = await uploadImage(image);
      images.push({ id, deleteHash, url });
    } catch {
      return res.status(500).json({ message: "Error uploading image" });
    }
  }

  const newHero = {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images,
  };

  try { 
    await ref.push(newHero);
    return res.status(201).json({ message: "Hero created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating hero" });
  }
}

const updateHero = async (req, res) => {
  const ref = req.db.ref("/heroes");
  const { heroId } = req.params;
  
  const hero = (await ref.child(heroId).once("value")).val();

  if (!hero) {
    return res.status(404).json({ message: "Hero not found" });
  }

  const {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    new_images,
    deleted_images,
  } = req.formData;

  if (!nickname) {
    return res.status(400).json({ message: "Nickname is required" });
  }

  if ((new_images.length + hero.images.length) - deleted_images?.length < 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  for (const imageId of deleted_images) {
    const deleteHash = hero.images.find((image) => image.id === imageId).deleteHash;
    
    const imgref = ref.child(heroId).child("images").child(imageId);
  
    try {
      await deleteImage(deleteHash);
      await imgref.remove();
    } catch {
      return res.status(500).json({ message: "Error deleting image" });
    }
  }

  const newImages = []

  for (const newImage of new_images) {
    try {
      const { id, deleteHash, url } = await uploadImage(newImage);
      newImages.push({ id, deleteHash, url });
    } catch {
      return res.status(500).json({ message: "Error uploading image" });
    }
  }

  const images = hero.images.filter((image) => !deleted_images.includes(image.id))
  images.push(...newImages)
  
  const updatedHero = {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images,
  };

  try {
    await ref.child(heroId).set(updatedHero);
    return res.status(200).json({ message: "Hero updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating hero" });
  }
}

const deleteHero = async (req, res) => {
  const ref = req.db.ref("/heroes");
  const { heroId } = req.params;
  try {
  const hero = await ref.child(heroId).once("value");
  
  if (!hero.exists()) {
    return res.status(404).json({ message: "Hero not found" });
  }
  
  for (const image of hero.val().images) {
    try {
      await deleteImage(image.deleteHash);
    } catch {
      return res.status(500).json({ message: "Error deleting image" });
    }
  }
  } catch {
    return res.status(500).json({ message: "Error deleting Hero" });
  }
  
  try {
    await ref.child(heroId).remove();
    return res.status(200).json({ message: "Hero deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting hero" });
  }
} 

module.exports = {
  getHeroDetails,
  getHeroes,
  addHero,
  updateHero,
  deleteHero,
}