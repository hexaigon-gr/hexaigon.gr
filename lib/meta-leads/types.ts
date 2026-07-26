/** Shapes sent by Meta's `leadgen` webhook and returned by the Graph API lead node. */

export interface LeadgenValue {
  leadgen_id: string;
  page_id: string;
  form_id: string;
  ad_id?: string;
  adgroup_id?: string;
  created_time?: number;
}

export interface MetaWebhookPayload {
  object?: string;
  entry?: {
    id?: string;
    time?: number;
    changes?: { field?: string; value?: LeadgenValue }[];
  }[];
}

export interface LeadFieldData {
  name: string;
  values: string[];
}

/** `GET /{leadgen_id}` — everything except `field_data` depends on the requested fields. */
export interface GraphLead {
  id: string;
  created_time?: string;
  field_data?: LeadFieldData[];
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  form_id?: string;
  is_organic?: boolean;
  platform?: string;
}
