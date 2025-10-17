import { searchClient, indexClient, getIndexName, getExcludeFieldsForSearch } from "../azure-ai-search/azure-search-client.js";

export interface SemanticSearchParams {
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

export async function semanticSearchTool(params: SemanticSearchParams): Promise<SearchResult> {
  const { query, top = 10 } = params;

  try {
    // Try to get semantic configuration, but it's optional if vectorizer is configured
    let semanticConfigName: string | undefined;
    try {
      const index = await indexClient.getIndex(getIndexName());
      if (index.semanticSearch?.configurations && index.semanticSearch.configurations.length > 0) {
        semanticConfigName = index.semanticSearch.configurations[0].name;
      }
    } catch (error) {
      // Semantic configuration not required if vectorizer is configured
    }

    // Perform semantic search
    const searchOptions: any = {
      top,
      select: [],
    };

    // Only set semantic config if available, otherwise rely on vectorizer
    if (semanticConfigName) {
      searchOptions.queryType = "semantic";
      searchOptions.semanticConfiguration = semanticConfigName;
    } else {
      // Use simple search which works with vectorizer
      searchOptions.queryType = "simple";
    }

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
    throw new Error(`Semantic search failed: ${error.message}`);
  }
}

