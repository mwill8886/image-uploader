import React, { useState, useEffect } from 'react';
import { Header, ImageThumbnail } from '@/components';
import { Box, Container, styled, Dialog } from '@mui/material';
import { ImageObjectType } from '@/types';

//
// Styles
//
const ComponentWrapper = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const BodyWrapper = styled('div')(() => ({
  flex: '1',
  overflowY: 'auto',
}));

const GalleryContainer = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  paddingTop: '64px',
  justifyContent: 'center',
}));

//
// Component
//

export default function Uploader() {
  // TODO: add a null state
  // TODO: move nested local state to context or redux
  // TODO: add a drag and drop uploader - use a dialog

  const [images, setImages] = useState<Array<ImageObjectType>>([]);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (imagePath: string) => {
    setViewImage(imagePath);
    setOpen(true);
  };
  const handleClose = () => {
    setViewImage(null);
    setOpen(false);
  };

  const getAllImages = async () => {
    const imagesResponse = await fetch('/api/images', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => json.data);

    setImages(imagesResponse);
  };

  // Fetch all the images on load
  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <>
      <ComponentWrapper>
        {/* Header Section */}
        <Header
          images={images}
          setViewImage={handleOpen}
          updateImages={setImages}
        />
        {/* Gallery Section */}
        <BodyWrapper>
          <Container>
            <GalleryContainer>
              {images.map((image, index) => {
                return (
                  <ImageThumbnail
                    key={`thumbnail-${image.name}`}
                    name={image.name}
                    src={image.src}
                    setViewImage={handleOpen}
                    updateImages={setImages}
                  />
                );
              })}
            </GalleryContainer>
          </Container>
        </BodyWrapper>
      </ComponentWrapper>
      {/* View image dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth={false}>
        <Box p="24px">
          {viewImage && (
            <img src={viewImage} alt="full image" style={{ width: '100%' }} />
          )}
        </Box>
      </Dialog>
    </>
  );
}
