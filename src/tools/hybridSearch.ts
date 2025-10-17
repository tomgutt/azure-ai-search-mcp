import { searchClient } from "../azure-ai-search/azure-search-client.js";

export interface HybridSearchParams {
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

export async function hybridSearchTool(params: HybridSearchParams): Promise<SearchResult> {
  const { query, top = 10 } = params;

  try {
    // Perform hybrid search (combines vector and full-text search)
    const searchOptions: any = {
      top,
      queryType: "full",
      searchMode: "all",
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
    throw new Error(`Hybrid search failed: ${error.message}`);
  }
}

