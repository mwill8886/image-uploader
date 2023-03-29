import React, { useState } from 'react';
import {
  Box,
  Container,
  Button,
  TextField,
  Autocomplete,
  styled,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ImageObjectType } from '@/types';

//
// Styles
//
const HeaderWrapper = styled('div')(() => ({
  padding: '12px',
  boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)',
}));

//
// Models
//
interface IHeader {
  images: Array<ImageObjectType>;
  setViewImage: (imagePath: string) => void;
  updateImages: (images: Array<ImageObjectType>) => void;
}

//
// Component
//
export const Header: React.FC<IHeader> = (props) => {
  const { images, setViewImage, updateImages } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e?.target?.files?.[0];
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);

      const imagesResponse = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => json.data);

      updateImages(imagesResponse);
    } catch (error: any) {
      alert(error.response?.data);
    }
    setLoading(false);
  };

  const handleSearch = (imageName: string) => {
    const imageSrc = images.find((image) => {
      return image.name === imageName;
    })?.src;

    if (imageSrc) {
      setViewImage(imageSrc);
    }
  };

  return (
    <>
      <HeaderWrapper>
        <Container>
          <Box display="flex" alignItems="center">
            <Box flex="1">
              <Autocomplete
                freeSolo
                options={images?.map((image) => image?.name)}
                onChange={(e, newValue) => {
                  if (newValue) {
                    handleSearch(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Images"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <Box ml="24px">
              <Button
                variant="contained"
                color="primary"
                component="label"
                disabled={loading}
              >
                {loading ? 'Uploading' : 'Upload'}
                <input
                  hidden
                  accept="image/jpeg, image/png, image/gif"
                  type="file"
                  onChange={handleUpload}
                  disabled={loading}
                />
              </Button>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
    </>
  );
};
