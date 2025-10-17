import { SearchClient, SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";

// Get environment variables (will be validated on first use)
function getEnvVars() {
  const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const apiKey = process.env.AZURE_SEARCH_API_KEY;
  const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

  if (!endpoint || !apiKey || !indexName) {
    throw new Error(
      "Missing required environment variables: AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_API_KEY, AZURE_SEARCH_INDEX_NAME"
    );
  }

  return { endpoint, apiKey, indexName };
}

// Get fields to exclude from search results (configurable via env var)
export function getExcludeFieldsForSearch(): string[] {
  const excludeFields = process.env.AZURE_SEARCH_EXCLUDE_FIELDS;
  if (!excludeFields) {
    // Default exclusions if not specified
    return ['content', 'content_vector'];
  }
  return excludeFields.split(',').map(f => f.trim());
}

// Get fields to exclude from fetch document (always excludes sensitive content fields)
export function getExcludeFieldsForFetch(): string[] {
  return ['content', 'content_vector'];
}

// Lazy initialization
let _searchClient: SearchClient<any> | null = null;
let _indexClient: SearchIndexClient | null = null;
let _indexName: string | null = null;

// Export getter for Search Client (lazy init)
export function getSearchClient(): SearchClient<any> {
  if (!_searchClient) {
    const { endpoint, apiKey, indexName } = getEnvVars();
    const credential = new AzureKeyCredential(apiKey);
    _searchClient = new SearchClient(endpoint, indexName, credential);
  }
  return _searchClient;
}

// Export getter for Index Client (lazy init)
export function getIndexClient(): SearchIndexClient {
  if (!_indexClient) {
    const { endpoint, apiKey } = getEnvVars();
    const credential = new AzureKeyCredential(apiKey);
    _indexClient = new SearchIndexClient(endpoint, credential);
  }
  return _indexClient;
}

// Export getter for index name (lazy init)
export function getIndexName(): string {
  if (!_indexName) {
    _indexName = getEnvVars().indexName;
  }
  return _indexName;
}

// Legacy exports for backward compatibility (will initialize on access)
export const searchClient = new Proxy({} as SearchClient<any>, {
  get(_target, prop) {
    return (getSearchClient() as any)[prop];
  }
});

export const indexClient = new Proxy({} as SearchIndexClient, {
  get(_target, prop) {
    return (getIndexClient() as any)[prop];
  }
});

export const INDEX_NAME = new Proxy({}, {
  get(_target, prop) {
    return (getIndexName() as any)[prop];
  }
}) as any as string;
