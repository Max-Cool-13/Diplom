"""Add master role to userrole enum

Revision ID: e5bfea0c460c
Revises: bb16f701fe2d
Create Date: 2025-05-26 20:46:24.836635

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5bfea0c460c'
down_revision: Union[str, None] = 'bb16f701fe2d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("ALTER TYPE userrole ADD VALUE 'master';")
    pass


def downgrade():
    """Downgrade schema."""
    pass
