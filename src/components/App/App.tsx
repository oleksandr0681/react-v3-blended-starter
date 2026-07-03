import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import { useState } from "react";
import type { Photo } from "../../types/photo";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import toast, { Toaster } from "react-hot-toast";
import { getPhotos } from "../../services/photos";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setPhotos([]);
      const fetchedPhotos = await getPhotos(query);
      if (fetchedPhotos.length === 0) {
        toast.error("Photos not found.");
        return;
      }
      setPhotos(fetchedPhotos);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (photo: Photo | null) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />
          {isLoading && <Loader />}
          {isError && <Text textAlign="center">Something went wrong.</Text>}
          {photos.length > 0 && (
            <PhotosGallery photos={photos} onSelect={handleSelect} />
          )}
          {selectedPhoto !== null && (
            <Modal onClose={closeModal}>
              <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
            </Modal>
          )}
          <Toaster />
        </Container>
      </Section>
    </>
  );
}
