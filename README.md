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

# Optional: Comma-separated list of fields to exclude from search results
# Default: content,content_vector,comments,custom_fields
AZURE_SEARCH_EXCLUDE_FIELDS=content,content_vector,comments,custom_fields
```

**Field Exclusion:**
- `AZURE_SEARCH_EXCLUDE_FIELDS`: Controls which fields are excluded from search tool results (semantic, hybrid, text, filtered)
- The `fetch_document` tool always only excludes `content` and `content_vector` fields
- If not set, defaults to: `content,content_vector`
- Customize to fit your needs (e.g., `content,content_vector` for minimal exclusion)

### Required Azure Resources

1. **Azure AI Search Service**: Create a search service in the Azure Portal
2. **Search Index**: Configure an index with your data
3. **API Key**: Get the admin or query key from the Azure Portal

**Optional for enhanced semantic search:**
- **Semantic configuration**: Enables Azure's semantic ranker (recommended but not required)
- **Vectorizer**: Enables vector-based semantic search (works without semantic configuration)

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
        "AZURE_SEARCH_INDEX_NAME": "your-index-name",
        "AZURE_SEARCH_EXCLUDE_FIELDS": "content,content_vector,comments,custom_fields"
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

Performs AI-powered semantic search that understands context and meaning. Works with or without semantic configuration - will use vectorizer if semantic configuration is not available.

**Parameters:**
- `query` (string, required): The search query
- `top` (number, optional): Maximum results to return (default: 10)

**Returns:** Document summaries without fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS` (default: `content`, `content_vector`, additional fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS`)

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

**Returns:** Document summaries without fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS` (default: `content`, `content_vector`, additional fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS`)

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

**Returns:** Document summaries without fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS` (default: `content`, `content_vector`, additional fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS`)

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

**Returns:** Document summaries without fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS` (default: `content`, `content_vector`, additional fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS`)

**Example:**
```json
{
  "query": "technology",
  "filter": "category eq 'AI' and year ge 2020",
  "top": 10
}
```

### 5. `fetch_document`

Retrieve a specific document by its unique ID. Returns the complete document with all fields.

**Parameters:**
- `documentId` (string, required): The document's unique identifier

**Returns:** Full document including `comments` and `custom_fields` (excludes only `content` and `content_vector`)

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

The test suite supports running all tests or testing individual tools with custom queries.

#### Run All Tests

```bash
npm run build  # First time only
npm run test   # Runs all 5 tools with default queries
```

#### Test Individual Tools

**Semantic Search** (AI-powered context understanding):
```bash
npm run test semantic "machine learning algorithms"
```

**Hybrid Search** (combines vector + text search):
```bash
npm run test hybrid "artificial intelligence trends"
```

**Text Search** (traditional keyword matching):
```bash
npm run test text "data science"
```

**Fetch Document** (retrieve by ID):
```bash
npm run test fetch doc-12345
# or auto-find a document
npm run test fetch
```

**Filtered Search** (with OData filters):
```bash
npm run test filtered "technology"
```

#### Get Help

```bash
npm run test help
```

#### Test Examples

```bash
# Test semantic search with a specific query
npm run test semantic "neural networks and deep learning"

# Test hybrid search for balanced results
npm run test hybrid "cloud computing security best practices"

# Test text search for exact keywords
npm run test text "azure cognitive search"

# Fetch a specific document
npm run test fetch "doc-abc-123"

# Test filtered search (adjust filter based on your schema)
npm run test filtered "AI research papers"
```

**Note**: Make sure your `.env` file is configured with valid Azure credentials before running tests.

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

1. **Client Initialization**: The server creates Azure Search clients using credentials from environment variables (lazy initialization)
2. **Tool Registration**: Each search tool is registered with the MCP server with appropriate schemas
3. **Resource Exposure**: Index schema is exposed as an MCP resource for introspection
4. **Query Execution**: Tools execute searches using the Azure Search SDK
5. **Response Filtering**:
   - **Search tools** return document summaries without fields specified in `AZURE_SEARCH_EXCLUDE_FIELDS` env var
   - **Fetch document** always returns full document (excludes only `content` and `content_vector`)
   - Field exclusion is configurable per deployment via environment variables

## Security Notes

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use environment variables or secure secret management
- **Access Control**: Use Azure RBAC and query keys (not admin keys) in production
- **Rate Limiting**: Be aware of Azure Search service tier limits
- **Field Exclusion**: Use `AZURE_SEARCH_EXCLUDE_FIELDS` to prevent sensitive data from being returned in search results
- **Data Privacy**: The `content` and `content_vector` fields are always excluded from all responses by default

## Troubleshooting

### "Missing required environment variables"

Ensure all three environment variables are set:
- `AZURE_SEARCH_ENDPOINT`
- `AZURE_SEARCH_API_KEY`
- `AZURE_SEARCH_INDEX_NAME`

### Semantic search configuration

Semantic search works with or without explicit semantic configuration:
- **With semantic configuration**: Uses Azure's semantic ranker for best results
- **Without semantic configuration**: Falls back to simple search, works with vectorizer if configured
- You don't need semantic configuration if you have a vectorizer configured in your index

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
