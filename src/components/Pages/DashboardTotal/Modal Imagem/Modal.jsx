import { useState } from "react";
import ImgPadrao from '../../../../assets/user.png';
import style from './Modal.module.css';

export default function UserProfileModal() {
  const defaultImage = ImgPadrao; // Substitua pela imagem padrão
  const [userImage, setUserImage] = useState(defaultImage);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageClick = () => {
    if (userImage === defaultImage) {
      document.getElementById("fileInput").click();
    } else {
      setPreviewImage(userImage);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
  };

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent}>
        {/* Foto do usuário */}
        <div className={style.imageContainer}>
          <img
            src={userImage}
            alt="Foto do usuário"
            className={style.userImage}
            onClick={handleImageClick}
          />
          <input
            type="file"
            id="fileInput"
            className={style.inputContainer}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Modal para ampliar a imagem */}
      {previewImage && (
        <div className={style.modalOverlay} onClick={() => setPreviewImage(null)}>
          <div className={style.modalImage}>
            <img src={previewImage} alt="Imagem ampliada" />
          </div>
        </div>
      )}
    </div>
  );
}