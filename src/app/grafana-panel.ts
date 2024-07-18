export interface GrafanaPanel {
    panelId: string;
    panelTitle: string;
    panelType: string;
    panelUrl: string;
  }
  
  export class Panel implements GrafanaPanel {
    constructor(
      public panelId: string,
      public panelTitle: string,
      public panelType: string,
      public panelUrl: string
    ) {}
  }
  