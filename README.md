# 🔮 DataSage

**AI-Powered Data Quality Assistant**

DataSage is an intelligent data analysis tool that leverages Claude AI to provide automated data profiling, quality insights, and recommendations for CSV and Excel files.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet%204.5-purple.svg)](https://www.anthropic.com/claude)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Current Features (Phase 1 ✅)

- **🤖 AI-Powered Analysis**: Leverages Claude Sonnet 4.5 for intelligent data quality insights
- **📊 Automated Data Profiling**: Comprehensive statistics including nulls, types, distributions
- **📁 Multiple File Formats**: Support for CSV and Excel files (.csv, .xlsx, .xls)
- **🎯 Quality Scoring**: AI-generated quality scores with actionable recommendations
- **📖 Auto-Generated Docs**: Interactive API documentation with Swagger UI
- **🔒 Secure**: Environment-based configuration, no hardcoded secrets
- **🧪 Mock Mode**: Test without consuming API credits

### Planned Features (Coming Soon)

- **🎨 React Frontend**: Modern UI with drag-and-drop file upload
- **💾 Database Integration**: PostgreSQL for storing analysis history
- **🔐 User Authentication**: JWT-based secure access
- **🔍 SQL Generation**: Natural language to SQL query translation
- **🐛 Error Debugging**: AI-assisted data error diagnosis
- **📈 Data Visualization**: Interactive charts and graphs
- **🐳 Docker Support**: Containerized deployment

---

## 🎬 Demo

### API in Action

```bash
# Health Check
curl http://localhost:8000/health

# Analyze a CSV file
curl -X POST http://localhost:8000/api/v1/analysis/analyze \
  -F "file=@your_data.csv"
```

### Sample Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "file_name": "sales_data.csv",
  "row_count": 1000,
  "column_count": 5,
  "columns": [
    {
      "name": "customer_id",
      "dtype": "int64",
      "null_count": 0,
      "null_percentage": 0.0,
      "unique_count": 856,
      "sample_values": [1001, 1002, 1003, 1004, 1005]
    }
  ],
  "ai_insights": "Your dataset shows good overall quality with 1000 records across 5 columns. Key observations: customer_id has high cardinality (856 unique values), suggesting good data diversity...",
  "quality_score": 87.5,
  "recommendations": [
    "Consider handling the 5% missing values in the 'email' column",
    "Standardize date formats in the 'purchase_date' column"
  ],
  "created_at": "2025-11-16T10:30:00Z"
}
```

### Interactive Swagger UI

Visit `http://localhost:8000/docs` for the interactive API documentation:

![Swagger UI](https://via.placeholder.com/800x400?text=Interactive+API+Documentation)
*Screenshot placeholder - Swagger UI with file upload interface*

---

## 🛠️ Tech Stack

### Backend (Implemented)
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern, high-performance web framework
- **[Pandas](https://pandas.pydata.org/)** - Data analysis and manipulation
- **[Pydantic](https://docs.pydantic.dev/)** - Data validation using Python type hints
- **[Anthropic Claude API](https://www.anthropic.com/api)** - Claude Sonnet 4.5 for AI analysis
- **[Python 3.9+](https://www.python.org/)** - Programming language

### Frontend (Planned - Phase 2)
- **React 18 + TypeScript** - UI framework with type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization

### Infrastructure (Planned - Phase 3+)
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Claude API key ([Get one here](https://console.anthropic.com/) - $5 free credit)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/datasage.git
   cd datasage
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Claude API key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   ```

4. **Run the development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Test the API**
   - Visit http://localhost:8000/docs for interactive documentation
   - Try the health check: http://localhost:8000/health

### Testing Without API Key

Want to test without an API key? Use the mock service:

In `backend/app/api/analysis.py`, line 20-21, change:
```python
# Comment out the real service
# claude_service = ClaudeService()

# Use the mock service instead
claude_service = MockClaudeService()
```

---

## 📚 API Documentation

### Endpoints

#### `GET /`
Root endpoint with API information.

#### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "environment": "development"
}
```

#### `POST /api/v1/analysis/analyze`
Upload and analyze a data file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (CSV or Excel file, max 10MB)

**Response:** `DataProfileResponse` (see [Demo section](#demo))

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📂 Project Structure

```
datasage/
├── backend/                    # FastAPI backend (Phase 1 - COMPLETE ✅)
│   ├── app/
│   │   ├── api/               # API route handlers
│   │   │   ├── analysis.py    # Data analysis endpoint
│   │   │   └── health.py      # Health check endpoint
│   │   ├── core/              # Core configuration
│   │   │   └── config.py      # Settings and environment vars
│   │   ├── schemas/           # Pydantic models
│   │   │   └── analysis.py    # Request/response schemas
│   │   ├── services/          # Business logic layer
│   │   │   ├── claude_service.py       # Claude API integration
│   │   │   ├── mock_claude_service.py  # Mock for testing
│   │   │   └── data_profiler.py        # Pandas data profiling
│   │   └── main.py            # FastAPI app entry point
│   ├── tests/                 # Unit and integration tests (Phase 2)
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment template
│   └── .gitignore            # Git ignore rules
├── frontend/                  # React frontend (Phase 2 - PLANNED)
├── .claude/                   # Claude Code commands
│   └── commands/
│       ├── document.md        # Auto-documentation
│       └── progress.md        # Progress tracking
├── CLAUDE.md                  # Guide for Claude Code sessions
├── PROJECT_DOCUMENTATION.md   # Detailed project docs
├── LEARNING_JOURNAL.md        # Development learning notes
├── README.md                  # This file
└── test_data.csv             # Sample test data
```

---

## 💻 Development

### Running Tests

```bash
cd backend
pytest tests/ -v
```

*Note: Test suite coming in Phase 2*

### Code Quality

```bash
# Format code with black
black app/

# Lint with flake8
flake8 app/

# Type checking with mypy
mypy app/
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes* | - | Claude API key from console.anthropic.com |
| `ENVIRONMENT` | No | `development` | Environment name (development/production) |
| `MAX_FILE_SIZE_MB` | No | `10` | Maximum upload file size in MB |
| `ALLOWED_FILE_TYPES` | No | `csv,xlsx,xls` | Comma-separated allowed file extensions |

*Required only when using the real Claude service (not mock)

---

## 🗺️ Roadmap

### ✅ Phase 1: Backend Foundation (COMPLETE)
- [x] FastAPI REST API setup
- [x] Claude Sonnet 4.5 integration
- [x] Data profiling with Pandas
- [x] Pydantic schemas for type safety
- [x] Environment-based configuration
- [x] Auto-generated API documentation
- [x] Mock service for testing

### 🔄 Phase 2: Frontend Development (IN PROGRESS)
- [ ] React + TypeScript setup with Vite
- [ ] File upload UI with drag-and-drop
- [ ] Data profile visualization
- [ ] AI insights display with formatting
- [ ] Responsive design with Tailwind CSS
- [ ] Error handling and loading states

### 📋 Phase 3: Database Integration
- [ ] PostgreSQL setup
- [ ] SQLAlchemy models
- [ ] Alembic migrations
- [ ] Store analysis history
- [ ] User data persistence

### 📋 Phase 4: Authentication & Users
- [ ] JWT authentication
- [ ] User registration/login
- [ ] User-specific analysis history
- [ ] API rate limiting

### 📋 Phase 5: Advanced AI Features
- [ ] Natural language to SQL generation
- [ ] Data error debugging assistance
- [ ] Custom prompt templates
- [ ] Multi-file analysis

### 📋 Phase 6: Deployment
- [ ] Docker containerization
- [ ] Docker Compose orchestration
- [ ] CI/CD with GitHub Actions
- [ ] Cloud deployment (AWS/Railway/Render)
- [ ] Production monitoring

---

## 🤝 Contributing

Contributions are welcome! This is an educational project, but feel free to:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Write docstrings for all functions and classes
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Anthropic](https://www.anthropic.com/)** - For the amazing Claude API
- **[FastAPI](https://fastapi.tiangolo.com/)** - For the excellent web framework
- **[Pandas](https://pandas.pydata.org/)** - For powerful data analysis tools

---

## 📞 Contact

**Fedi Boussora**

- GitHub: [@dramajohns](https://github.com/dramajohns)
- LinkedIn: [Fedi Boussora](https://www.linkedin.com/in/fedi-boussora/)
- Email: your.email@example.com

---

## 📊 Project Stats

![Phase 1 Complete](https://img.shields.io/badge/Phase%201-Complete-brightgreen)
![Lines of Code](https://img.shields.io/badge/lines%20of%20code-1613+-blue)
![Files](https://img.shields.io/badge/files-26-orange)
![Commits](https://img.shields.io/badge/commits-3-yellow)

