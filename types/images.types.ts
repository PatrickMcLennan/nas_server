export enum ImageExtensions {
  png = `png`,
  jpg = `jpg`,
  jpeg = `jpeg`,
}

export type ImageDTO = {
  url: string;
  name: string;
  ext: typeof ImageExtensions;
};
