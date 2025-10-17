import { searchClient, getExcludeFieldsForSearch } from "../azure-ai-search/azure-search-client.js";

export interface HybridSearchParams {
  query: string;
  top?: number;
}

export interface SearchResult {
  documents: any[];
  count: number;
}

// Helper to remove configured fields from search results
function cleanDocument(doc: any): any {
  const excludeFields = getExcludeFieldsForSearch();
  const cleanedDoc = { ...doc };
  for (const field of excludeFields) {
    delete cleanedDoc[field];
  }
  return cleanedDoc;
}

export async function hybridSearchTool(params: HybridSearchParams): Promise<SearchResult> {
  const { query, top = 30 } = params;

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

