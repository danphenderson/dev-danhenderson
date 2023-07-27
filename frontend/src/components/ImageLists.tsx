
import {ImageList, ImageListItem, ImageListItemBar} from "@mui/material";


interface ItemData {
  img: string;
  title: string;
  rows?: number;
  cols?: number;
}


const itemData = [
  {
    img: `${require("../images/photography/six-shooter-sunset.jpg")}`,
    title: "Six Shooter Sunset",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("../images/photography/alki-beach.jpg")}`,
    title: "Alki Beach",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("../images/photography/iccle-creek.jpg")}`,
    title:  "Iccle Creek",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("../images/photography/ancestrial-pueblo.jpg")}`,
    title: "Ancestral Pueblo View",
    rows: 1,
    cols: 1,
  },

  {
    img: `${require("../images/photography/crow.jpg")}`,
    title: "Migration",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("../images/photography/rim-rock.jpg")}`,
    title: "Rim Rock Lake",
    rows: 1,
    cols: 1,
  },
  {
    img: `${require("../images/photography/tieton-south-fork-1.jpg")}`,
    title:  "South Fork Tieton River",
    rows: 2,
    cols: 2,
  },
  {
    img: `${require("../images/photography/tieton-south-fork-2.jpg")}`,
    title: "Ancestral Pueblo View",
    rows: 1,
    cols: 1,
  },
];


function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}



export function QuiltedImageList() {
  return (
    <ImageList >
      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          cols={item.cols || 1}
          rows={item.rows || 1}
        >
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}


export function TitledImageList() {
  return (
  <ImageList variant="masonry" >
    {itemData.map((item) => (
      <ImageListItem key={item.img}>
        <img
          src={`${item.img}`}
          srcSet={`${item.img}`}
          alt={item.title}
          loading="lazy"
        />
        <ImageListItemBar position="below" title={item.title} />
      </ImageListItem>
    ))}
  </ImageList>
  );
}

    
    
