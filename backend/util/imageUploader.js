async function uploadImage (imageData) {
  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
      body: imageData
    });
    
    const data = (await response.json()).data

    return {
      id: data.id,
      deleteHash: data.deletehash,
      url: data.link,
    };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function deleteImage (image) {
  const response = await fetch(`https://api.imgur.com/3/image/${image.deleteHash}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
  });
}

module.exports = {
  uploadImage,
  deleteImage,
};