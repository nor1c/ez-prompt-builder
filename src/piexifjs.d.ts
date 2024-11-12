declare module "piexifjs" {
  export function remove(dataUrl: string): string;
  export function insert(exifStr: string, dataUrl: string): string;
  export function dump(exifObj: object): string;
  export function load(dataUrl: string): object;
}