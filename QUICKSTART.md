# Quick Start Guide - Azure AI Search MCP Server

## 5-Minute Setup

### Step 1: Configure Environment

Create a `.env` file in the project root:

```bash
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_API_KEY=your-admin-or-query-key
AZURE_SEARCH_INDEX_NAME=your-index-name
```

### Step 2: Install & Build

```bash
npm install
npm run build
```

### Step 3: Test with Inspector

```bash
npm run inspector
```

This opens the MCP Inspector where you can test all tools interactively.

## Using the Tools

### 1. Semantic Search
**Best for**: Understanding context and meaning

```json
{
  "query": "machine learning algorithms for classification",
  "top": 5
}
```

### 2. Hybrid Search
**Best for**: Balanced results with keyword + semantic

```json
{
  "query": "artificial intelligence trends",
  "top": 10
}
```

### 3. Text Search
**Best for**: Exact keyword matching

```json
{
  "query": "neural networks",
  "top": 20
}
```

### 4. Filtered Search
**Best for**: Narrowing results by specific criteria

```json
{
  "query": "technology",
  "filter": "category eq 'AI' and year ge 2020",
  "top": 10
}
```

**Common Filter Examples:**
- `category eq 'Technology'` - Exact match
- `price lt 100` - Less than
- `year ge 2020` - Greater than or equal
- `category eq 'AI' and price lt 1000` - Multiple conditions

### 5. Fetch Document
**Best for**: Getting a specific document

```json
{
  "documentId": "doc-12345"
}
```

## Integration with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "azure-ai-search": {
      "command": "node",
      "args": ["/Users/i529243/Documents/Coding/MCP/azure-ai-search-mcp/build/index.js"],
      "env": {
        "AZURE_SEARCH_ENDPOINT": "https://your-service.search.windows.net",
        "AZURE_SEARCH_API_KEY": "your-api-key",
        "AZURE_SEARCH_INDEX_NAME": "your-index"
      }
    }
  }
}
```

Restart Claude Desktop and you'll see the tools available!

## Viewing Index Schema

Use the resource feature to see your index structure:

**Resource URI**: `azure-search://index/{your-index-name}/schema`

This shows:
- All field names and types
- Field attributes (searchable, filterable, etc.)
- Semantic search configurations

## Common Issues

### "Missing required environment variables"
- Ensure all three env vars are set: ENDPOINT, API_KEY, INDEX_NAME

### "Could not retrieve semantic configuration"
- Your index may not have semantic search configured
- Semantic search will still work, just without advanced features
- Configure in Azure Portal > Your Index > Semantic Configurations

### "Document not found"
- The document ID doesn't exist
- Use a search tool first to find valid IDs

## Pro Tips

1. **Start with Semantic Search**: It's the most powerful for natural language queries
2. **Use Hybrid for Balance**: When you want both keywords and context
3. **Use Text Search for Exact Matches**: When you know the exact terms
4. **Use Filtered Search**: To narrow down by categories, dates, prices, etc.
5. **Check the Schema Resource**: To see what fields are available for filtering

## Example Workflow

1. **Explore**: Use semantic search to find relevant documents
   ```
   "find documents about machine learning in healthcare"
   ```

2. **Refine**: Use filtered search to narrow down
   ```
   query: "machine learning"
   filter: "category eq 'Healthcare' and year ge 2022"
   ```

3. **Get Details**: Fetch specific documents by ID
   ```
   documentId: "doc-from-search-results"
   ```

## Running Tests

```bash
# Set environment variables first
export AZURE_SEARCH_ENDPOINT="..."
export AZURE_SEARCH_API_KEY="..."
export AZURE_SEARCH_INDEX_NAME="..."

# Run test suite
npm run test
```

## Publishing to NPM

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Build
npm run build

# Test locally
npm run inspector

# Publish
npm login
npm publish
```

## Need Help?

- Check `README.md` for detailed documentation
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- Review Azure AI Search docs: https://docs.microsoft.com/azure/search/

Enjoy searching! 🔍

