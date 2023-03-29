# Project

This is just a base NextJS app that has a file uploader UI on the home route. The project just uploads the images into the `/public/images` directory. The instructions asked that the project starts with just the `install` command and `start` command, so the `package.json` has been updated and swapped the default NextJS scripts.

## Getting Started

First, install all the packages
```bash 
npm install
```

Then, run the development server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

Time spent: approximately 6pm - 10:30pm (3/28/23)

Todos:
- add null state
- move nested local state to context or redux
- add drag and drop uploader
- check if image exists and update the name with a count -> filename(2).png
- more robust client side validation
- server side validation
- more user feedback -> toasts?
