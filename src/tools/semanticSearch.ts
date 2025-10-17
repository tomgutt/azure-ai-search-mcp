import { searchClient, indexClient, INDEX_NAME } from "../azure-ai-search/azure-search-client.js";

export interface SemanticSearchParams {
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

export async function semanticSearchTool(params: SemanticSearchParams): Promise<SearchResult> {
  const { query, top = 10 } = params;

  try {
    // Get semantic configuration from index
    let semanticConfigName: string | undefined;
    try {
      const index = await indexClient.getIndex(INDEX_NAME);
      if (index.semanticSearch?.configurations && index.semanticSearch.configurations.length > 0) {
        semanticConfigName = index.semanticSearch.configurations[0].name;
      }
    } catch (error) {
      console.warn("Could not retrieve semantic configuration, attempting search without it");
    }

    // Perform semantic search
    const searchOptions: any = {
      top,
      queryType: "semantic",
      select: [],
    };

    if (semanticConfigName) {
      searchOptions.semanticConfiguration = semanticConfigName;
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

