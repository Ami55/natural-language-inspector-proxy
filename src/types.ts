export enum EntityCategory {
  PERSON = "PERSON",
  ORGANIZATION = "ORGANIZATION",
  ORG = "ORGANIZATION",
  LOCATION = "LOCATION",
  GPE = "LOCATION",
  CONSUMER_GOOD = "CONSUMER_GOOD",
  PRODUCT = "CONSUMER_GOOD",
  EVENT = "EVENT",
  PRICE = "PRICE",
  NUMBER = "NUMBER",
  DATE = "DATE",
  WORK_OF_ART = "WORK_OF_ART",
  OTHER = "OTHER"
}

export interface Token {
  id: number;
  text: string;
  pos: string; // e.g., "PROPN", "VERB", "NOUN", "ADP", "DET", "ADJ", "NUM", "PUNCT"
  posDescription?: string;
}

export interface NERStepEntity {
  id: number;
  text: string;
  category: string;
  confidence: number;
  startIndex: number; // token index start
  endIndex: number;   // token index end
  explanation?: string;
}

export interface CloudNLPEntity {
  id: number;
  text: string;
  type: "ORGANIZATION" | "LOCATION" | "PERSON" | "PRICE" | "NUMBER" | "CONSUMER_GOOD" | "EVENT" | "DATE" | "WORK_OF_ART" | "OTHER";
  salience: number; // 0 to 1
  sentiment: {
    score: number; // -1 to 1
    magnitude: number; // 0 to 1
  };
  metadata?: {
    wikipedia_url?: string;
    mid?: string;
  };
}

export interface CloudNLPResult {
  annotated_text: string;
  entities: CloudNLPEntity[];
  overall_sentiment: {
    score: number;
    magnitude: number;
  };
}

export interface NGramItem {
  gram: string;
  count: number;
  percentage: number;
}

export interface NGramStats {
  totalTokens: number;
  totalNGrams: number;
  uniqueNGrams: number;
  lexicalDiversity: number; // TTR
}

export interface FullAnalysisResult {
  // Google Cloud NLP Explorer structure
  cloudNLP: CloudNLPResult;
  // Step-by-step NER Engine structure
  nerPipeline: {
    tokens: Token[];
    entities: NERStepEntity[];
    markdownReport: string;
  };
}
