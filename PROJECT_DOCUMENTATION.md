# 📚 DataSage Project Documentation

**Generated:** 2025-11-16
**Version:** 0.1.0 (Phase 1 - Backend Foundation)
**Developer:** Fedi Boussora

---

## 🎯 Project Overview

**DataSage** is an AI-powered data quality assistant that uses Claude API to provide intelligent insights about datasets. Users upload CSV/Excel files and receive:
- Automated data profiling (nulls, types, distributions)
- AI-generated quality insights and recommendations
- SQL query generation from natural language
- Error debugging assistance

**Tech Stack:**
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy
- **Frontend:** React + TypeScript + Vite + Tailwind CSS (Coming in Phase 2)
- **AI:** Anthropic Claude API (Claude 3.5 Sonnet)
- **DevOps:** Docker, Docker Compose, GitHub Actions

**Current Phase:** Phase 1 - Backend Foundation ✅ (mostly complete)

---

## 🏗️ Architecture Overview

### Service Layer Pattern
```
User Request
    ↓
API Endpoint (FastAPI)
    ↓
Service Layer (Business Logic)
    ├─→ DataProfiler Service (Pandas analysis)
    └─→ Claude Service (AI insights)
    ↓
Response (Pydantic Schema)
```

**Why this pattern?**
- **Separation of concerns:** API routes handle HTTP, services handle logic
- **Testability:** Can test business logic without spinning up the web server
- **Reusability:** Same service can be used from API, CLI, or scheduled jobs
- **Enterprise standard:** Used by Airbnb, Uber, Stripe, etc.

---

## 📂 Project Structure

```
project_1/
├── backend/
│   ├── app/
│   │   ├── api/                    # API endpoints (routes)
│   │   │   ├── analysis.py        # Data analysis endpoint
│   │   │   └── health.py          # Health check endpoint
│   │   ├── core/                   # Core configuration
│   │   │   └── config.py          # Settings (env vars, validation)
│   │   ├── models/                 # SQLAlchemy database models (TBD)
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   │   └── analysis.py        # Analysis data structures
│   │   ├── services/               # Business logic layer
│   │   │   ├── claude_service.py  # Claude API integration ⚠️ TODO
│   │   │   └── data_profiler.py   # Data profiling with Pandas
│   │   ├── prompts/                # Claude prompt templates (TBD)
│   │   └── main.py                # FastAPI app entry point
│   ├── tests/                      # Backend tests (TBD)
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example               # Environment variables template
│   └── .gitignore
├── frontend/                       # React app (Phase 2)
├── .claude/
│   └── commands/
│       ├── document.md            # Auto-documentation command
│       └── progress.md            # Progress tracker command
├── aboutme/
│   └── CV_eng.pdf                 # Your CV for context
├── CLAUDE.md                       # Guide for future Claude sessions
├── PROJECT_DOCUMENTATION.md        # This file
└── .gitignore
```

---

## 🔧 Components Built (Phase 1)

### 1. **Configuration Management** (`backend/app/core/config.py`)
- Uses Pydantic Settings for type-safe config
- Loads from environment variables
- Validates required fields at startup
- **Learning Point:** Prevents runtime errors from missing/invalid config

### 2. **Data Profiler Service** (`backend/app/services/data_profiler.py`)
**What it does:**
- Reads CSV/Excel files into Pandas DataFrames
- Generates comprehensive data profile:
  - Row/column counts
  - Data types
  - Null counts and percentages
  - Unique value counts
  - Sample values

**Key Methods:**
```python
DataProfiler.read_file(bytes, filename) → DataFrame
DataProfiler.profile_dataframe(df) → dict
```

### 3. **Claude Service** (`backend/app/services/claude_service.py`)
**Status:** ⚠️ Partially implemented - `analyze_data_profile()` needs completion

**Purpose:**
- Abstracts Claude API calls
- Handles prompt engineering
- Parses AI responses into structured data

**Methods:**
- `analyze_data_profile()` - ⚠️ **YOUR TASK** - Analyze data quality
- `generate_sql_query()` - Coming in Phase 2
- `debug_error()` - Coming in Phase 2

### 4. **Pydantic Schemas** (`backend/app/schemas/analysis.py`)
Defines data structures for API input/output:

**`ColumnProfile`** - Stats for a single column
```python
{
    "name": "age",
    "dtype": "int64",
    "null_count": 50,
    "null_percentage": 5.0,
    "unique_count": 45,
    "sample_values": [25, 30, 35, 40, 22]
}
```

**`DataProfileResponse`** - Complete analysis result
```python
{
    "id": "uuid",
    "file_name": "sales.csv",
    "row_count": 1000,
    "column_count": 5,
    "columns": [...],
    "ai_insights": "Your dataset shows...",
    "quality_score": 85.5,
    "recommendations": ["Handle missing values in 'price'"],
    "created_at": "2024-01-01T00:00:00Z"
}
```

**Learning Point:** Pydantic validates all data automatically - wrong types are rejected before reaching your code.

### 5. **API Endpoints**

#### Health Check (`GET /health`)
```bash
curl http://localhost:8000/health
```
Returns:
```json
{
    "status": "healthy",
    "version": "0.1.0",
    "environment": "development"
}
```

#### File Analysis (`POST /api/v1/analysis/analyze`)
```bash
curl -X POST http://localhost:8000/api/v1/analysis/analyze \
  -F "file=@data.csv"
```

**Flow:**
1. Validates file type and size
2. Reads file into DataFrame
3. Generates data profile (nulls, types, stats)
4. Sends profile to Claude for insights
5. Returns comprehensive analysis

### 6. **FastAPI Application** (`backend/app/main.py`)
**Features:**
- Auto-generated API docs at `/docs` (Swagger UI)
- CORS middleware for frontend communication
- Structured route organization
- Professional error handling

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your Claude API key:
# ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Get Claude API Key
1. Go to https://console.anthropic.com/
2. Sign up for free ($5 credit)
3. Create API key
4. Add to `.env` file

### 4. Run the Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Test It
- Visit http://localhost:8000/docs for interactive API docs
- Try health check: http://localhost:8000/health

---

## 📖 Learning Journey

### Concepts Introduced

#### 1. **FastAPI Framework**
- Modern Python web framework
- Automatic API documentation
- Type hints enable validation
- Async support for better performance

#### 2. **Pydantic for Data Validation**
- Type-safe data structures
- Automatic validation
- Clear error messages
- JSON serialization

#### 3. **Service Layer Architecture**
- Separates business logic from HTTP handling
- Makes code testable
- Enables code reuse
- Industry best practice

#### 4. **Environment-Based Configuration**
- Never hardcode secrets
- Different settings per environment (dev/prod)
- Type-safe with Pydantic Settings

#### 5. **Professional Project Structure**
- Clear separation: api, services, schemas, core
- Easy to navigate
- Scales well as project grows

### Design Decisions

**Q: Why FastAPI instead of Flask?**
- Auto-generated docs save hours
- Type hints catch bugs early
- Async support for Claude API calls
- Most modern Python framework (fastest growing)

**Q: Why separate services from API routes?**
- Can test Claude integration without HTTP
- Same service works for API, CLI, scheduled jobs
- Easier to understand and maintain

**Q: Why Pydantic schemas?**
- Validates all input automatically
- Self-documenting code
- Frontend knows exact data shape
- Prevents runtime errors

---

## 🎯 Current Status

### ✅ Completed
- [x] Project structure with best practices
- [x] Configuration management (Pydantic Settings)
- [x] Data profiler service (Pandas-based)
- [x] Pydantic schemas for requests/responses
- [x] Health check endpoint
- [x] File upload endpoint structure
- [x] CORS configuration for frontend
- [x] Documentation system (this file + slash commands)

### 🚧 In Progress
- [ ] **Claude service implementation** ⚠️ **CURRENT TASK**
  - `analyze_data_profile()` method needs implementation
  - This is the core AI functionality

### 📋 Next Up (Phase 1 Completion)
1. Implement Claude API integration
2. Test with sample CSV files
3. Add error handling for API failures
4. Create unit tests

### 📋 Future Phases
**Phase 2:** Frontend (React + TypeScript)
**Phase 3:** Database integration (PostgreSQL)
**Phase 4:** Authentication & user management
**Phase 5:** Deployment (Docker + AWS/Railway)

---

## 🔑 Key Code Examples

### Making a Claude API Call
```python
from anthropic import Anthropic

client = Anthropic(api_key="your-key")
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Analyze this data profile..."
    }]
)

result = message.content[0].text  # Claude's response
```

### Using the Data Profiler
```python
from app.services.data_profiler import DataProfiler

profiler = DataProfiler()

# Read file
df = profiler.read_file(file_bytes, "data.csv")

# Generate profile
profile = profiler.profile_dataframe(df)
# Returns: {"row_count": 1000, "column_count": 5, "columns": [...]}
```

### Pydantic Validation
```python
from app.schemas.analysis import DataProfileResponse

# This automatically validates all fields
response = DataProfileResponse(
    id="123",
    file_name="data.csv",
    row_count=1000,
    # ... if you forget a required field, Pydantic raises clear error
)
```

---

## 🚀 Quick Reference

### Common Commands
```bash
# Start dev server
uvicorn app.main:app --reload

# Run tests
pytest tests/ -v

# Check dependencies
pip list

# Update dependencies
pip install -r requirements.txt --upgrade
```

### Important Files to Know
- `backend/app/main.py` - Start here to understand app structure
- `backend/app/core/config.py` - All configuration
- `backend/app/services/claude_service.py` - ⚠️ **YOUR CURRENT TASK**
- `backend/app/api/analysis.py` - Main analysis endpoint

### Useful Links
- FastAPI docs: https://fastapi.tiangolo.com/
- Claude API docs: https://docs.anthropic.com/
- Pydantic docs: https://docs.pydantic.dev/

---

## 💡 Tips for Success

1. **Read error messages carefully** - FastAPI gives detailed validation errors
2. **Use /docs endpoint** - Test your API interactively without writing frontend code
3. **Check .env file** - Most issues come from missing environment variables
4. **Test with real CSV files** - Create small test files to verify functionality
5. **Run `/progress` command** - Track what you've learned each session

---

**Next Step:** Implement the `analyze_data_profile()` method in `backend/app/services/claude_service.py` to complete Phase 1! 🎯
