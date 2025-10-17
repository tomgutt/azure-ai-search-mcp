import { semanticSearchTool } from "./tools/semanticSearch.js";
import { hybridSearchTool } from "./tools/hybridSearch.js";
import { textSearchTool } from "./tools/textSearch.js";
import { fetchDocumentTool } from "./tools/fetchDocument.js";
import { filteredSearchTool } from "./tools/filteredSearch.js";

async function main() {
  console.log("=== Azure AI Search MCP Server Test ===\n");

  try {
    // Test 1: Semantic Search
    console.log("1. Testing Semantic Search:");
    console.log("   Query: 'machine learning'");
    const semanticResult = await semanticSearchTool({ 
      query: "machine learning",
      top: 3
    });
    console.log(`   Found ${semanticResult.count} documents`);
    console.log(`   Results:`, JSON.stringify(semanticResult.documents, null, 2));
    console.log("\n");

    // Test 2: Hybrid Search
    console.log("2. Testing Hybrid Search:");
    console.log("   Query: 'artificial intelligence'");
    const hybridResult = await hybridSearchTool({ 
      query: "artificial intelligence",
      top: 3
    });
    console.log(`   Found ${hybridResult.count} documents`);
    console.log(`   Results:`, JSON.stringify(hybridResult.documents, null, 2));
    console.log("\n");

    // Test 3: Text Search
    console.log("3. Testing Text Search:");
    console.log("   Query: 'data'");
    const textResult = await textSearchTool({ 
      query: "data",
      top: 3
    });
    console.log(`   Found ${textResult.count} documents`);
    console.log(`   Results:`, JSON.stringify(textResult.documents, null, 2));
    console.log("\n");

    // Test 4: Fetch Document (if we have results from previous searches)
    if (semanticResult.documents.length > 0) {
      // Try to get document ID from first result
      const firstDoc = semanticResult.documents[0];
      const docId = firstDoc.id || firstDoc.documentId || firstDoc.key;
      
      if (docId) {
        console.log("4. Testing Fetch Document:");
        console.log(`   Document ID: ${docId}`);
        const fetchResult = await fetchDocumentTool({ documentId: String(docId) });
        console.log(`   Result:`, JSON.stringify(fetchResult, null, 2));
        console.log("\n");
      } else {
        console.log("4. Skipping Fetch Document test (no ID field found)");
        console.log("\n");
      }
    }

    // Test 5: Filtered Search (optional - depends on index schema)
    console.log("5. Testing Filtered Search:");
    console.log("   Query: 'technology'");
    console.log("   Filter: Example filter (adjust based on your schema)");
    try {
      // This is an example - adjust the filter based on your actual index schema
      const filteredResult = await filteredSearchTool({ 
        query: "technology",
        filter: "search.score() gt 0",  // Generic filter that should work with any index
        top: 3
      });
      console.log(`   Found ${filteredResult.count} documents`);
      console.log(`   Results:`, JSON.stringify(filteredResult.documents, null, 2));
    } catch (error: any) {
      console.log(`   Note: Filtered search may fail if the filter doesn't match your schema`);
      console.log(`   Error: ${error.message}`);
    }
    console.log("\n");

    console.log("=== All tests completed ===");

  } catch (error: any) {
    console.error("Test failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

main();
