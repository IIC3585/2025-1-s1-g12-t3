
declare module 'htl' {
  interface HTL {
    html: (template: TemplateStringsArray, ...values: any[]) => HTMLElement;
    svg: (template: TemplateStringsArray, ...values: any[]) => SVGElement;
  }
  
  const htl: HTL;
  export = htl;
}