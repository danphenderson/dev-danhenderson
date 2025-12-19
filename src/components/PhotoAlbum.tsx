import {ImageList, ImageListItem} from "@mui/material";

interface ImageData {
  img: string;
  title: string;
  rows?: number;
  cols?: number;
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
  const correctPath = image.startsWith("./") ? image.substring(1) : image;
  return {
    src: `${correctPath}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${correctPath}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}
export function QuiltedImageList({ImageData}: {ImageData: ImageData[]}) {
  return (
    <ImageList >
      {ImageData.map((item) => (
        <ImageListItem
          key={item.img}
          cols={item.cols || 1}
          rows={item.rows || 1}
        >
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
