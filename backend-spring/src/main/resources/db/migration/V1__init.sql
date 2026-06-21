CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       name VARCHAR(255),
                       password_hash VARCHAR(255),
                       avatar_url TEXT,
                       provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL',
                       provider_id VARCHAR(255),
                       role VARCHAR(50) NOT NULL DEFAULT 'USER',
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY,
                                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token_hash VARCHAR(255) NOT NULL,
                                expires_at TIMESTAMPTZ NOT NULL,
                                revoked BOOLEAN NOT NULL DEFAULT FALSE,
                                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
                          id UUID PRIMARY KEY,
                          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          title VARCHAR(255) NOT NULL,
                          description TEXT,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE documents (
                           id UUID PRIMARY KEY,
                           project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                           user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                           original_filename VARCHAR(500) NOT NULL,
                           stored_path TEXT NOT NULL,
                           content_type VARCHAR(255),
                           file_size BIGINT,
                           page_count INT,
                           status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED',
                           failure_reason TEXT,
                           created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                           updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE document_chunks (
                                 id UUID PRIMARY KEY,
                                 document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                                 project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                                 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                 chunk_index INT NOT NULL,
                                 page_number INT,
                                 content TEXT NOT NULL,
                                 token_count INT,
                                 embedding vector(1536),
                                 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_project_id ON document_chunks(project_id);

CREATE INDEX idx_document_chunks_embedding
    ON document_chunks
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

CREATE TABLE chat_sessions (
                               id UUID PRIMARY KEY,
                               project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                               user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               title VARCHAR(255) NOT NULL,
                               created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
                               id UUID PRIMARY KEY,
                               session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
                               role VARCHAR(50) NOT NULL,
                               content TEXT NOT NULL,
                               citations JSONB,
                               created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_usage_events (
                                 id UUID PRIMARY KEY,
                                 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                 event_type VARCHAR(100) NOT NULL,
                                 model VARCHAR(100),
                                 input_tokens INT DEFAULT 0,
                                 output_tokens INT DEFAULT 0,
                                 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);