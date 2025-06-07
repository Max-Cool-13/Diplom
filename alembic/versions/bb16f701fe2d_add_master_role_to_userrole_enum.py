"""Add master role to userrole enum

Revision ID: bb16f701fe2d
Revises: 5885e223fafa
Create Date: 2025-05-25 16:13:59.737431

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bb16f701fe2d'
down_revision: Union[str, None] = '5885e223fafa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("ALTER TYPE userrole ADD VALUE 'master';")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
