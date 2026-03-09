import DownloadIcon from "@mui/icons-material/Download";
import { Button, ImageList, ImageListItem } from "@mui/material";
import { alpha } from "@mui/material/styles";

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

function getDownloadFilename(image: string) {
  const lastSegment = image.split("/").pop() ?? image;
  const filename = lastSegment.split("?")[0];
  return filename && filename.length > 0 ? filename : "photo.jpg";
}

export function QuiltedImageList({
  ImageData,
  albumLabel,
}: {
  ImageData: ImageData[];
  albumLabel?: string;
}) {
  return (
    <ImageList aria-label={albumLabel ? `${albumLabel} photo gallery` : undefined}>
      {ImageData.map((item, index) => {
        const normalizedTitle = item.title.trim();
        const hasMeaningfulTitle =
          normalizedTitle.length > 0 && normalizedTitle.toLowerCase() !== "missing";
        const altText = hasMeaningfulTitle
          ? normalizedTitle
          : `${albumLabel ?? "Photo"} ${index + 1}`;

        return (
         <ImageListItem
           key={item.img}
           cols={item.cols || 1}
           rows={item.rows || 1}
           sx={{
             position: "relative",
             overflow: "hidden",
             "&:hover .photo-download-action, &:focus-within .photo-download-action": {
               opacity: 1,
               transform: "translateY(0)",
               pointerEvents: "auto",
             },
           }}
         >
           <img
             {...srcset(item.img, 121, item.rows, item.cols)}
             alt={altText}
             loading="lazy"
             decoding="async"
           />
           <Button
             className="photo-download-action"
             component="a"
             href={item.img}
             download={getDownloadFilename(item.img)}
             variant="outlined"
             size="small"
             startIcon={<DownloadIcon fontSize="small" />}
             aria-label={`Download ${altText}`}
             sx={(theme) => ({
               position: "absolute",
               right: 12,
               bottom: 12,
               opacity: 0,
               transform: "translateY(6px)",
               pointerEvents: "none",
               backdropFilter: "blur(10px)",
               backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "light" ? 0.82 : 0.72),
               borderColor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.48 : 0.62),
               color: theme.palette.text.primary,
               boxShadow: theme.palette.mode === "light"
                 ? "0 8px 18px rgba(15, 34, 56, 0.18)"
                 : "0 10px 20px rgba(0, 0, 0, 0.32)",
               transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
               "&:hover": {
                 backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "light" ? 0.94 : 0.84),
               },
               "@media (hover: none)": {
                 opacity: 1,
                 transform: "translateY(0)",
                 pointerEvents: "auto",
               },
             })}
           >
             Download
           </Button>
         </ImageListItem>
        );
      })}
    </ImageList>
  );
}
