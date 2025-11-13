export interface Lead {
  businessName: string;
  industry: string;
  location: string;
  contact: string;
  reason: string;
}

export interface Strategy {
  title: string;
  description: string;
}

export interface ApiResponse {
  leads: Lead[];
  strategies: Strategy[];
}
