// Media shown in the product gallery. Only images exist today; the 360° spin
// viewer will be added as another kind (e.g. { kind: "spin"; frames: string[] })
// rendered alongside these, without changing how images work.
export type GalleryImage = {
  kind: "image"
  id: string
  url: string
}

export type GalleryItem = GalleryImage
