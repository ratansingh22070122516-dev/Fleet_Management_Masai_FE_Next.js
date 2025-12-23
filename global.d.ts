import { IStaticMethods } from "flyonui/flyonui";

declare global {
  interface Window {
    // Optional third-party libraries
    _: any;
    $: typeof import("jquery");
    jQuery: typeof import("jquery");
    DataTable: any;
    Dropzone: any;
    noUiSlider: any;

    HSStaticMethods: IStaticMethods;
  }
}

export {};