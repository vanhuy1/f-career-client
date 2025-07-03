declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      logging?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      [key: string]: unknown;
    };
    pagebreak?: {
      mode?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  interface Html2PdfInstance {
    from(element: HTMLElement | string): Html2PdfInstance;
    set(options: Html2PdfOptions): Html2PdfInstance;
    outputPdf(type?: string): Promise<Blob>;
    save(): Promise<void>;
    toPdf(): Html2PdfInstance;
    output(type?: string, options?: unknown): Promise<unknown>;
    then(callback: (instance: Html2PdfInstance) => void): Html2PdfInstance;
    get(property: string): unknown;
    [key: string]: unknown;
  }

  function html2pdf(): Html2PdfInstance;

  export default html2pdf;
}
