import { searchClient, getExcludeFieldsForSearch } from "../azure-ai-search/azure-search-client.js";

export interface FilteredSearchParams {
  query: string;
  filter: string;
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

export async function filteredSearchTool(params: FilteredSearchParams): Promise<SearchResult> {
  const { query, filter, top = 10 } = params;

  try {
    // Perform search with OData filter
    const searchOptions: any = {
      top,
      filter,
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
    throw new Error(`Filtered search failed: ${error.message}`);
  }
}

