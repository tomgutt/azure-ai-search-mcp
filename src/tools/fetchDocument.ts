import { searchClient, getExcludeFieldsForFetch } from "../azure-ai-search/azure-search-client.js";

export interface FetchDocumentParams {
  documentId: string;
}

// Helper to remove only sensitive fields (keep comments and custom_fields for full document view)
function cleanDocument(doc: any): any {
  const excludeFields = getExcludeFieldsForFetch();
  const cleanedDoc = { ...doc };
  for (const field of excludeFields) {
    delete cleanedDoc[field];
  }
  return cleanedDoc;
}

export async function fetchDocumentTool(params: FetchDocumentParams): Promise<any> {
  const { documentId } = params;

  try {
    // Fetch document by ID
    const document = await searchClient.getDocument(documentId);
    
    return cleanDocument(document);
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw new Error(`Document with ID '${documentId}' not found`);
    }
    throw new Error(`Failed to fetch document: ${error.message}`);
  }
}

