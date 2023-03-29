import { NextApiHandler, NextApiRequest } from 'next';
import formidable, { File } from 'formidable';
import path from 'path';
import fs from 'fs';
import { v4 } from 'uuid';
import { ImageObjectType } from '@/types';

// needed in NextJS for the file upload body
export const config = {
  api: {
    bodyParser: false,
  },
};

// set images dir
const imageDir = path.join(process.cwd(), 'public', 'images');

//
// Add image method
//
const saveImageLocally = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  // check for images directory
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }

  // configure file options
  const options: formidable.Options = {};
  options.multiples = false;
  options.uploadDir = imageDir;
  options.filename = (name, ext, path, form) => {
    // TODO: instead of adding a uuid, append the same filename with the count -> filename(2).jpg
    return v4() + '_' + path.originalFilename;
  };
  const form = formidable(options);

  // TODO: server side file type validation then store
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      // formidable is writing to the imageDir immediately on parse
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });
};

//
// Get all images method
//
export const getAllImages = (): Promise<Array<ImageObjectType | undefined>> => {
  return new Promise((resolve) => {
    // get the image directory contents
    const dirent = fs.readdirSync(imageDir, { withFileTypes: true });

    // check each file for type and format the response
    const files: Array<ImageObjectType | undefined> = dirent.map((content) => {
      if (content.isFile() && /\.(png|jpe?g|gif)$/i.test(content.name)) {
        // const filePath = path.join(imageDir, content.name);
        return {
          name: content.name,
          src: `/images/${content.name}`,
        };
      }
    });

    resolve(files);
  });
};

//
// API Handler
//
const handler: NextApiHandler = async (req, res) => {
  //
  // POST - Add image
  //
  if (req.method === 'POST') {
    try {
      await saveImageLocally(req);
      const images = await getAllImages();
      return res.status(200).json({ status: 'success', data: images });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: 'failed', message: 'Failed to upload image.' });
    }
  }

  //
  // Get - Get all images
  //
  if (req.method === 'GET') {
    try {
      const images = await getAllImages();
      return res.status(200).json({ status: 'success', data: images });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: 'failed', message: 'Failed to get images.' });
    }
  }

  //
  // Not Allowed
  //
  return res.status(405).end();
};

export default handler;
