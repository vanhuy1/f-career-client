declare module 'html-to-image' {
  interface Options {
    /**
     * Width in pixels to be applied to node before rendering.
     */
    width?: number;
    /**
     * Height in pixels to be applied to node before rendering.
     */
    height?: number;
    /**
     * A string value for the background color, any valid CSS color value.
     */
    backgroundColor?: string;
    /**
     * Width in pixels to be applied to canvas on export.
     */
    canvasWidth?: number;
    /**
     * Height in pixels to be applied to canvas on export.
     */
    canvasHeight?: number;
    /**
     * An object whose properties to be copied to node's style before rendering.
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * A function taking DOM node as argument. Should return true if passed
     * node should be included in the output. Excluding node means excluding
     * it's children as well.
     */
    filter?: (domNode: Node) => boolean;
    /**
     * A number between 0 and 1 indicating image quality.
     */
    quality?: number;
    /**
     * Set to true to append the current time as a query string to URL
     * requests to enable cache busting.
     */
    cacheBust?: boolean;
    /**
     * A data URL for a placeholder image that will be used when fetching
     * an image fails. Defaults to undefined.
     */
    imagePlaceholder?: string;
    /**
     * The pixel ratio of the captured image. Default is 1.
     */
    pixelRatio?: number;
    /**
     * Whether to skip the auto-scaling of the canvas. Default is false.
     */
    skipAutoScale?: boolean;
    /**
     * Optional canvas object, if not provided a new one will be created.
     */
    canvas?: HTMLCanvasElement;
  }

  /**
   * Converts DOM node to canvas.
   */
  export function toCanvas(
    node: HTMLElement,
    options?: Options,
  ): Promise<HTMLCanvasElement>;

  /**
   * Converts DOM node to PNG image.
   */
  export function toPng(node: HTMLElement, options?: Options): Promise<string>;

  /**
   * Converts DOM node to JPEG image.
   */
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;

  /**
   * Converts DOM node to pixel data.
   */
  export function toPixelData(
    node: HTMLElement,
    options?: Options,
  ): Promise<Uint8ClampedArray>;

  /**
   * Converts DOM node to SVG image.
   */
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;

  /**
   * Converts DOM node to Blob.
   */
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
}
