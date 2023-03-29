import React, { useState } from 'react';
import {
  Box,
  styled,
  IconButton,
  Dialog,
  Typography,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ImageObjectType } from '@/types';

//
// Styles
//
const ImageContainer = styled('div')(() => ({
  margin: '12px',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)',
  transition: 'all .2s ease-out',
  '& .button-delete': {
    pointerEvents: 'none',
    opacity: 0,
    transition: 'all .2s ease-out',
  },
  '&:hover': {
    transform: 'scale(1.10)',
    boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.25)',
    '& .button-delete': {
      pointerEvents: 'auto',
      opacity: 1,
    },
  },
}));

const ThumbnailImage = styled('img')(() => ({
  width: '200px',
  height: '200px',
  objectFit: 'contain',
}));

const NameContainer = styled('div')(() => ({
  maxWidth: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

//
// Models
//

interface IImageThumbnail {
  name: string;
  src: string;
  setViewImage: (imagePath: string) => void;
  updateImages: (images: Array<ImageObjectType>) => void;
}

//
// Component
//
export const ImageThumbnail: React.FC<IImageThumbnail> = (props) => {
  const { name, src, setViewImage, updateImages } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleView = () => {
    setViewImage(src);
  };

  const handleDelete = async () => {
    setLoading(true);

    // fetch the delete
    const imagesResponse = await fetch(`/api/images/${name}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => json.data);

    // update the gallery
    updateImages(imagesResponse);

    handleClose();
    setLoading(false);
  };

  return (
    <>
      <ImageContainer>
        <ThumbnailImage src={src} alt={`thumnail of ${name}`} />
        <Box>
          <NameContainer>{name}</NameContainer>
          <Box display="flex" justifyContent="flex-end">
            <IconButton
              className="button-delete"
              onClick={handleView}
              color="success"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              className="button-delete"
              onClick={handleOpen}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </ImageContainer>
      {/* Confirm delete dialog */}
      <Dialog open={open} onClose={handleClose}>
        <Box p="24px">
          <h2>Delete Image</h2>
          <Typography>
            Are you sure you would like to delete <strong>{name}</strong>?
          </Typography>
          <Box mt="24px" display="flex" justifyContent="space-between">
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              color="error"
              disabled={loading}
            >
              {loading ? 'Deleting' : 'Confirm Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
