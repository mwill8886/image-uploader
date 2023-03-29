import { NextApiHandler } from 'next';
import path from 'path';
import fs from 'fs';
import { getAllImages } from './index';

// needed in NextJS for the file upload body
export const config = {
  api: {
    bodyParser: false,
  },
};

//
// Remove image
//
const deleteImageByName = async (imageName: string): Promise<void> => {
  const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

  return new Promise((resolve, reject) => {
    // TODO: check if image exists
    fs.unlink(imagePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//
// API Handler
//
const handler: NextApiHandler = async (req, res) => {
  //
  // DELETE - Remove image
  //
  if (req.method === 'DELETE' && req.query.imageId) {
    try {
      await deleteImageByName(req.query.imageId as string);
      const images = await getAllImages();
      return res.status(200).json({ status: 'success', data: images });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: 'failed', message: 'Failed to remove image.' });
    }
  }

  //
  // Not Allowed
  //
  return res.status(405).end();
};

export default handler;
