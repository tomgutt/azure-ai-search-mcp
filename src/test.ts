// IMPORTANT: Load environment variables BEFORE any imports
import { config } from "dotenv";
config();

// Now import the tools (which will have access to env vars)
import { semanticSearchTool } from "./tools/semanticSearch.js";
import { hybridSearchTool } from "./tools/hybridSearch.js";
import { textSearchTool } from "./tools/textSearch.js";
import { fetchDocumentTool } from "./tools/fetchDocument.js";
import { filteredSearchTool } from "./tools/filteredSearch.js";

// Get command-line arguments
const args = process.argv.slice(2);
const testName = args[0]?.toLowerCase();
const query = args[1] || "test query";
const documentId = args[1];

async function testSemanticSearch(searchQuery: string = "machine learning") {
  console.log("=== Testing Semantic Search ===");
  console.log(`Query: '${searchQuery}'`);
  const result = await semanticSearchTool({ query: searchQuery, top: 3 });
  console.log(`Found ${result.count} documents`);
  console.log(`Results:`, JSON.stringify(result.documents, null, 2));
  return result;
}

async function testHybridSearch(searchQuery: string = "artificial intelligence") {
  console.log("=== Testing Hybrid Search ===");
  console.log(`Query: '${searchQuery}'`);
  const result = await hybridSearchTool({ query: searchQuery, top: 3 });
  console.log(`Found ${result.count} documents`);
  console.log(`Results:`, JSON.stringify(result.documents, null, 2));
  return result;
}

async function testTextSearch(searchQuery: string = "data") {
  console.log("=== Testing Text Search ===");
  console.log(`Query: '${searchQuery}'`);
  const result = await textSearchTool({ query: searchQuery, top: 3 });
  console.log(`Found ${result.count} documents`);
  console.log(`Results:`, JSON.stringify(result.documents, null, 2));
  return result;
}

async function testFetchDocument(docId?: string) {
  console.log("=== Testing Fetch Document ===");
  
  if (!docId) {
    console.log("No document ID provided, finding one from search...");
    const searchResult = await semanticSearchTool({ query: "test", top: 1 });
    if (searchResult.documents.length > 0) {
      const firstDoc = searchResult.documents[0];
      docId = firstDoc.id || firstDoc.documentId || firstDoc.key;
    }
  }
  
  if (!docId) {
    console.log("Could not find a document ID to test with");
    return null;
  }
  
  console.log(`Document ID: ${docId}`);
  const result = await fetchDocumentTool({ documentId: String(docId) });
  console.log(`Result:`, JSON.stringify(result, null, 2));
  return result;
}

async function testFilteredSearch(searchQuery: string = "technology") {
  console.log("=== Testing Filtered Search ===");
  console.log(`Query: '${searchQuery}'`);
  console.log("Filter: search.score() gt 0 (generic filter)");
  
  try {
    const result = await filteredSearchTool({ 
      query: searchQuery,
      filter: "search.score() gt 0",
      top: 3
    });
    console.log(`Found ${result.count} documents`);
    console.log(`Results:`, JSON.stringify(result.documents, null, 2));
    return result;
  } catch (error: any) {
    console.log(`Note: Filtered search may fail if the filter doesn't match your schema`);
    console.log(`Error: ${error.message}`);
    return null;
  }
}

async function runAllTests() {
  console.log("=== Azure AI Search MCP Server - All Tests ===\n");

  try {
    // Test 1: Semantic Search
    console.log("1. Testing Semantic Search:");
    const semanticResult = await testSemanticSearch();
    console.log("\n");

    // Test 2: Hybrid Search
    console.log("2. Testing Hybrid Search:");
    await testHybridSearch();
    console.log("\n");

    // Test 3: Text Search
    console.log("3. Testing Text Search:");
    await testTextSearch();
    console.log("\n");

    // Test 4: Fetch Document
    console.log("4. Testing Fetch Document:");
    if (semanticResult.documents.length > 0) {
      const firstDoc = semanticResult.documents[0];
      const docId = firstDoc.id || firstDoc.documentId || firstDoc.key;
      await testFetchDocument(String(docId));
    } else {
      console.log("Skipping (no documents found in semantic search)");
    }
    console.log("\n");

    // Test 5: Filtered Search
    console.log("5. Testing Filtered Search:");
    await testFilteredSearch();
    console.log("\n");

    console.log("=== All tests completed ===");
  } catch (error: any) {
    console.error("Test failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

async function main() {
  try {
    // Check if a specific test was requested
    switch (testName) {
      case "semantic":
      case "semantic-search":
        await testSemanticSearch(query);
        break;
      
      case "hybrid":
      case "hybrid-search":
        await testHybridSearch(query);
        break;
      
      case "text":
      case "text-search":
        await testTextSearch(query);
        break;
      
      case "fetch":
      case "fetch-document":
        await testFetchDocument(documentId);
        break;
      
      case "filtered":
      case "filtered-search":
        await testFilteredSearch(query);
        break;
      
      case "help":
      case "--help":
      case "-h":
        console.log("Azure AI Search MCP Server - Test Suite\n");
        console.log("Usage: npm run test [test-name] [query/document-id]\n");
        console.log("Available tests:");
        console.log("  semantic [query]        - Test semantic search");
        console.log("  hybrid [query]          - Test hybrid search");
        console.log("  text [query]            - Test text search");
        console.log("  fetch [document-id]     - Test fetch document");
        console.log("  filtered [query]        - Test filtered search");
        console.log("  (no args)               - Run all tests\n");
        console.log("Examples:");
        console.log("  npm run test");
        console.log("  npm run test semantic \"machine learning\"");
        console.log("  npm run test hybrid \"AI trends\"");
        console.log("  npm run test fetch doc-12345");
        break;
      
      default:
        // No specific test requested, run all tests
        await runAllTests();
        break;
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

main();
