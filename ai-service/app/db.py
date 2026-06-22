from collections.abc import Iterator

from psycopg_pool import ConnectionPool

from app.config import get_settings


_pool: ConnectionPool | None = None


def get_pool() -> ConnectionPool:
    global _pool
    if _pool is None:
        _pool = ConnectionPool(conninfo=get_settings().database_url, min_size=1, max_size=5, open=False)
        _pool.open()
    return _pool


def get_connection() -> Iterator:
    with get_pool().connection() as conn:
        yield conn


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None
