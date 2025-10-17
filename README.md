# Azure AI Search MCP Server

A Model Context Protocol (MCP) server that integrates Azure AI Search capabilities into agentic workflows. This server provides semantic search, hybrid search, text search, and document retrieval tools for AI agents.

## Features

- 🔍 **Semantic Search**: AI-powered search that understands context and meaning
- 🔀 **Hybrid Search**: Combines full-text and vector search for balanced results
- 📝 **Text Search**: Traditional keyword-based search
- 🔎 **Filtered Search**: Search with OData filter expressions
- 📄 **Document Fetch**: Retrieve specific documents by ID
- 📊 **Index Schema Resource**: Access to index field definitions and metadata

## Installation

### As an NPM Package

```bash
npm install azure-ai-search-mcp
```

### From Source

```bash
git clone https://github.com/tomgutt/azure-ai-search-mcp.git
cd azure-ai-search-mcp
npm install
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in your project root or set these environment variables:

```env
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_API_KEY=your-api-key-here
AZURE_SEARCH_INDEX_NAME=your-index-name
```

### Required Azure Resources

1. **Azure AI Search Service**: Create a search service in the Azure Portal
2. **Search Index**: Configure an index with your data
3. **API Key**: Get the admin or query key from the Azure Portal

For semantic search to work, ensure your index has a semantic configuration enabled.

## Usage

### With MCP Inspector

Test the server using the MCP Inspector:

```bash
npm run inspector
```

### With Claude Desktop

Add to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "azure-ai-search": {
      "command": "npx",
      "args": ["azure-ai-search-mcp"],
      "env": {
        "AZURE_SEARCH_ENDPOINT": "https://your-search-service.search.windows.net",
        "AZURE_SEARCH_API_KEY": "your-api-key-here",
        "AZURE_SEARCH_INDEX_NAME": "your-index-name"
      }
    }
  }
}
```

### With Other MCP Clients

Run the server via stdio:

```bash
export AZURE_SEARCH_ENDPOINT="https://your-search-service.search.windows.net"
export AZURE_SEARCH_API_KEY="your-api-key-here"
export AZURE_SEARCH_INDEX_NAME="your-index-name"
node build/index.js
```

## Available Tools

### 1. `semantic_search`

Performs AI-powered semantic search that understands context and meaning.

**Parameters:**
- `query` (string, required): The search query
- `top` (number, optional): Maximum results to return (default: 10)

**Example:**
```json
{
  "query": "machine learning algorithms",
  "top": 5
}
```

### 2. `hybrid_search`

Combines full-text and vector search for balanced results.

**Parameters:**
- `query` (string, required): The search query
- `top` (number, optional): Maximum results to return (default: 10)

**Example:**
```json
{
  "query": "artificial intelligence trends",
  "top": 10
}
```

### 3. `text_search`

Traditional keyword-based text search.

**Parameters:**
- `query` (string, required): The search query
- `top` (number, optional): Maximum results to return (default: 10)

**Example:**
```json
{
  "query": "data science",
  "top": 20
}
```

### 4. `filtered_search`

Search with OData filter expressions to narrow results.

**Parameters:**
- `query` (string, required): The search query
- `filter` (string, required): OData filter expression
- `top` (number, optional): Maximum results to return (default: 10)

**Example:**
```json
{
  "query": "technology",
  "filter": "category eq 'AI' and year ge 2020",
  "top": 10
}
```

### 5. `fetch_document`

Retrieve a specific document by its unique ID.

**Parameters:**
- `documentId` (string, required): The document's unique identifier

**Example:**
```json
{
  "documentId": "doc-12345"
}
```

## Resources

### Index Schema

Access the complete index schema including field definitions:

**URI**: `azure-search://index/{index-name}/schema`

Returns JSON with:
- Field names and types
- Field attributes (searchable, filterable, sortable, facetable)
- Semantic search configurations

## Development

### Running Tests

```bash
npm run build
npm run test
```

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Publishing to NPM

1. **Update version** in `package.json`

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Test locally**:
   ```bash
   npm run inspector
   ```

4. **Publish**:
   ```bash
   npm login
   npm publish
   ```

## Project Structure

```
azure-ai-search-mcp/
├── src/
│   ├── azure-ai-search/
│   │   └── azure-search-client.ts    # Azure SDK client setup
│   ├── tools/
│   │   ├── semanticSearch.ts         # Semantic search tool
│   │   ├── hybridSearch.ts           # Hybrid search tool
│   │   ├── textSearch.ts             # Text search tool
│   │   ├── fetchDocument.ts          # Document fetch tool
│   │   └── filteredSearch.ts         # Filtered search tool
│   ├── index.ts                      # MCP server implementation
│   └── test.ts                       # Test suite
├── build/                            # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **Client Initialization**: The server creates Azure Search clients using credentials from environment variables
2. **Tool Registration**: Each search tool is registered with the MCP server with appropriate schemas
3. **Resource Exposure**: Index schema is exposed as an MCP resource for introspection
4. **Query Execution**: Tools execute searches using the Azure Search SDK
5. **Response Cleaning**: Sensitive fields (`content_vector`, `content`) are removed from responses

## Security Notes

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use environment variables or secure secret management
- **Access Control**: Use Azure RBAC and query keys (not admin keys) in production
- **Rate Limiting**: Be aware of Azure Search service tier limits

## Troubleshooting

### "Missing required environment variables"

Ensure all three environment variables are set:
- `AZURE_SEARCH_ENDPOINT`
- `AZURE_SEARCH_API_KEY`
- `AZURE_SEARCH_INDEX_NAME`

### "Could not retrieve semantic configuration"

Your index may not have semantic search configured. The tool will still work but without semantic capabilities. Configure semantic search in the Azure Portal under your index settings.

### "Document with ID 'xxx' not found"

The document ID doesn't exist in your index. Use a search tool first to find valid document IDs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Tom Guttermann

## Links

- [Azure AI Search Documentation](https://docs.microsoft.com/azure/search/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub Repository](https://github.com/tomgutt/azure-ai-search-mcp)
