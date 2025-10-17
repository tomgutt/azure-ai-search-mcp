import { searchClient } from "../azure-ai-search/azure-search-client.js";

export interface TextSearchParams {
  query: string;
  top?: number;
}

export interface SearchResult {
  documents: any[];
  count: number;
}

// Helper to remove sensitive fields
function cleanDocument(doc: any): any {
  const { content_vector, content, ...cleanedDoc } = doc;
  return cleanedDoc;
}

export async function textSearchTool(params: TextSearchParams): Promise<SearchResult> {
  const { query, top = 10 } = params;

  try {
    // Perform simple text search
    const searchOptions: any = {
      top,
      queryType: "simple",
      select: [],
    };

    const searchResults = await searchClient.search(query, searchOptions);
    
    const documents: any[] = [];
    for await (const result of searchResults.results) {
      documents.push(cleanDocument(result.document));
    }

    return {
      documents,
      count: documents.length
    };
  } catch (error: any) {
    throw new Error(`Text search failed: ${error.message}`);
  }
}

