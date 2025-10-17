import { searchClient } from "../azure-ai-search/azure-search-client.js";

export interface FetchDocumentParams {
  documentId: string;
}

// Helper to remove sensitive fields
function cleanDocument(doc: any): any {
  const { content_vector, content, ...cleanedDoc } = doc;
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

