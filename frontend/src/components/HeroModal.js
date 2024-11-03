import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import useHeroStore from '../stores/heroStore';

export function HeroModal() {
  const {
    heroFormData,
    isModalOpen,
    isEditing,
    closeHeroModal,
    toggleEditMode,
    setHeroFormData,
    postHero,
    deleteHero,
  } = useHeroStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroFormData(name, value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // Filter files < 10MB
    if (validFiles.length < files.length) {
      alert('Some files were too large and not added (max 10MB each).');
    }
    setHeroFormData('addedImages', [...heroFormData.addedImages, ...validFiles]);
  };

  const handleImageRemove = (image) => {
    if (image.id) {
      // If existing image, add to deletedImages
      setHeroFormData('deletedImages', [...heroFormData.deletedImages, image.id]);
      setHeroFormData(
        'images',
        heroFormData.images.filter((img) => img.id !== image.id)
      );
    } else {
      // If new image, remove from addedImages
      setHeroFormData(
        'addedImages',
        heroFormData.addedImages.filter((img) => img.name !== image.name)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await postHero(heroFormData);
    setIsLoading(false);
  }

  return (
    <Modal show={isModalOpen} onHide={closeHeroModal}>
      <Modal.Header closeButton>
        <Modal.Title>{heroFormData.id ? 'Hero Details' : 'Create Hero'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isEditing ? (
          <div>
            <h5>Nickname:</h5> <p>{heroFormData.nickname}</p>
            <h5>Real Name:</h5> <p>{heroFormData.realName}</p>
            <h5>Description:</h5> <p>{heroFormData.originDescription}</p>
            <h5>Superpowers:</h5> <p>{heroFormData.superpowers}</p>
            {heroFormData.images.length > 0 && (
              <div>
                <h5>Images:</h5>
                {heroFormData.images.map((image) => (
                  <img key={image.id} src={image.url} alt="hero" width="100" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Form encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                value={heroFormData.nickname}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Real Name</Form.Label>
              <Form.Control
                type="text"
                name="realName"
                value={heroFormData.realName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Origin Description</Form.Label>
              <Form.Control
                type="text"
                name="originDescription"
                value={heroFormData.originDescription}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Superpowers</Form.Label>
              <Form.Control
                type="text"
                name="superpowers"
                value={heroFormData.superpowers}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Images (Max 10MB each)</Form.Label>
              {heroFormData.images.map((image) => (
                <div key={image.id}>
                  <img src={image.url} alt="hero" width="100" />
                  <Button variant="danger" onClick={() => handleImageRemove(image)}>Delete</Button>
                </div>
              ))}
              {heroFormData.addedImages.map((image, index) => (
                <div key={index}>
                  <img src={URL.createObjectURL(image)} alt="new hero" width="100" />
                  <Button variant="danger" onClick={() => handleImageRemove(image)}>Delete</Button>
                </div>
              ))}
              <Form.Control
                type="file"
                name="images"
                accept=".jpg, .jpeg, .png"
                multiple
                onChange={handleImageUpload}
                required
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={closeHeroModal}>Cancel</Button>
            {heroFormData.id && <Button variant="danger" onClick={deleteHero}>Delete Hero</Button>}
            
            <Button disabled={isLoading} variant="primary" onClick={handleSubmit}>
              {heroFormData.id ? 'Save Changes' : 'Create Hero'}
            </Button>
          </>
        ) : (
          <>
          <Button variant="success" onClick={toggleEditMode}>Edit</Button>
          <Button variant="secondary" onClick={closeHeroModal}>Close</Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default HeroModal;