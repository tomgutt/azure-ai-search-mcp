import { SearchClient, SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";

// Validate environment variables
const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const apiKey = process.env.AZURE_SEARCH_API_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

if (!endpoint || !apiKey || !indexName) {
  throw new Error(
    "Missing required environment variables: AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_API_KEY, AZURE_SEARCH_INDEX_NAME"
  );
}

// Create Azure Key Credential
const credential = new AzureKeyCredential(apiKey);

// Export Search Client for querying documents
export const searchClient = new SearchClient(
  endpoint,
  indexName,
  credential
);

// Export Index Client for schema operations
export const indexClient = new SearchIndexClient(
  endpoint,
  credential
);

// Export index name for convenience
export const INDEX_NAME = indexName;

