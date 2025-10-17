#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { semanticSearchTool } from "./tools/semanticSearch.js";
import { hybridSearchTool } from "./tools/hybridSearch.js";
import { textSearchTool } from "./tools/textSearch.js";
import { fetchDocumentTool } from "./tools/fetchDocument.js";
import { filteredSearchTool } from "./tools/filteredSearch.js";
import { indexClient, getIndexName } from "./azure-ai-search/azure-search-client.js";

async function main() {
  const server = new Server({
    name: "azure-ai-search-mcp",
    version: "1.0.0"
  }, {
    capabilities: {
      tools: {},
      resources: {}
    }
  });

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "semantic_search",
          description: "Perform a semantic search using Azure AI Search. This uses AI to understand the meaning and context of your query, returning the most semantically relevant results.",
          inputSchema: {
            type: "object",
            properties: {
              query: { 
                type: "string",
                description: "The search query text"
              },
              top: { 
                type: "number",
                description: "Maximum number of results to return (default: 10)",
                default: 10
              }
            },
            required: ["query"]
          }
        },
        {
          name: "hybrid_search",
          description: "Perform a hybrid search combining full-text and vector search. This provides a balanced approach using both keyword matching and semantic understanding.",
          inputSchema: {
            type: "object",
            properties: {
              query: { 
                type: "string",
                description: "The search query text"
              },
              top: { 
                type: "number",
                description: "Maximum number of results to return (default: 10)",
                default: 10
              }
            },
            required: ["query"]
          }
        },
        {
          name: "text_search",
          description: "Perform a simple text-based search using keyword matching. This is best for exact phrase matches and simple queries.",
          inputSchema: {
            type: "object",
            properties: {
              query: { 
                type: "string",
                description: "The search query text"
              },
              top: { 
                type: "number",
                description: "Maximum number of results to return (default: 10)",
                default: 10
              }
            },
            required: ["query"]
          }
        },
        {
          name: "filtered_search",
          description: "Perform a search with OData filter conditions. Use this to narrow results by specific field values (e.g., category eq 'Technology' or price lt 100).",
          inputSchema: {
            type: "object",
            properties: {
              query: { 
                type: "string",
                description: "The search query text"
              },
              filter: {
                type: "string",
                description: "OData filter expression (e.g., \"category eq 'Technology'\" or \"price lt 100\")"
              },
              top: { 
                type: "number",
                description: "Maximum number of results to return (default: 10)",
                default: 10
              }
            },
            required: ["query", "filter"]
          }
        },
        {
          name: "fetch_document",
          description: "Retrieve a specific document by its ID. Returns the complete document without content_vector and content fields.",
          inputSchema: {
            type: "object",
            properties: {
              documentId: { 
                type: "string",
                description: "The unique identifier of the document to retrieve"
              }
            },
            required: ["documentId"]
          }
        }
      ]
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name;
    const args = (req.params.arguments as any) ?? {};

    try {
      let result: any;

      switch (name) {
        case "semantic_search":
          result = await semanticSearchTool(args);
          break;
        case "hybrid_search":
          result = await hybridSearchTool(args);
          break;
        case "text_search":
          result = await textSearchTool(args);
          break;
        case "filtered_search":
          result = await filteredSearchTool(args);
          break;
        case "fetch_document":
          result = await fetchDocumentTool(args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify(result, null, 2) 
        }] 
      } as any;
    } catch (err: any) {
      return { 
        content: [{ 
          type: "text", 
          text: `Error: ${err.message || String(err)}` 
        }],
        isError: true
      } as any;
    }
  });

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const indexName = getIndexName();
    return {
      resources: [
        {
          uri: `azure-search://index/${indexName}/schema`,
          name: `Azure Search Index Schema: ${indexName}`,
          description: "Complete schema of the Azure Search index including field definitions, types, and attributes",
          mimeType: "application/json"
        }
      ]
    };
  });

  // Read resource content
  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const uri = req.params.uri;
    const indexName = getIndexName();

    if (uri === `azure-search://index/${indexName}/schema`) {
      try {
        const index = await indexClient.getIndex(indexName);
        
        const schema = {
          name: index.name,
          fields: index.fields.map(field => {
            const baseField: any = {
              name: field.name,
              type: field.type
            };
            
            // Add properties that exist on the field
            if ('key' in field) baseField.key = field.key;
            if ('searchable' in field) baseField.searchable = field.searchable;
            if ('filterable' in field) baseField.filterable = field.filterable;
            if ('sortable' in field) baseField.sortable = field.sortable;
            if ('facetable' in field) baseField.facetable = field.facetable;
            if ('retrievable' in field) baseField.retrievable = field.retrievable;
            
            return baseField;
          }),
          semanticSearch: index.semanticSearch ? {
            configurations: index.semanticSearch.configurations?.map(config => ({
              name: config.name,
              prioritizedFields: config.prioritizedFields
            }))
          } : null
        };

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(schema, null, 2)
            }
          ]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch index schema: ${error.message}`);
      }
    }

    throw new Error(`Unknown resource: ${uri}`);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Azure AI Search MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
