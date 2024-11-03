const parseHeroForm = (req, res, next) => {
  let {
    nickname = "", 
    real_name = "",
    origin_description = "",
    superpowers = "",
    catch_phrase = "",
    deleted_images,
  } = req.body;
  
  if (typeof deleted_images === 'string') {
    deleted_images = deleted_images.split(',');
  }

  const images = req.files.map((img) => img.buffer.toString('base64'))
 
  req.formData = {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    new_images: images,
    deleted_images,
  };
   
  next();
}

module.exports = parseHeroForm