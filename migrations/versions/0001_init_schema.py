from alembic import op
import sqlalchemy as sa

revision = "0001_init_schema"
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("user_id", sa.Text(), primary_key=True),
        sa.Column("telegram_id", sa.Text(), unique=True),
        sa.Column("username", sa.Text()),
        sa.Column("first_name", sa.Text()),
        sa.Column("vless_key", sa.Text()),
        sa.Column("subscription_expiry", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("balance", sa.Float(), nullable=False, server_default="0"),
        sa.Column("trial_used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("referred_by", sa.Text()),
        sa.Column("invited_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.BigInteger(), nullable=False, server_default=sa.text("(extract(epoch from now()))::bigint")),
        sa.Column("updated_at", sa.BigInteger(), nullable=False, server_default=sa.text("(extract(epoch from now()))::bigint")),
    )
    op.create_index("idx_users_telegram", "users", ["telegram_id"], unique=False)

    op.create_table(
        "payments",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Text(), nullable=False),
        sa.Column("telegram_id", sa.Text()),
        sa.Column("amount_rub", sa.Float()),
        sa.Column("amount_stars", sa.Integer()),
        sa.Column("method", sa.Text(), nullable=False),
        sa.Column("months", sa.Integer(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("payload", sa.Text()),
        sa.Column("created_at", sa.BigInteger(), nullable=False, server_default=sa.text("(extract(epoch from now()))::bigint")),
        sa.ForeignKeyConstraint(["user_id"], ["users.user_id"], ondelete="CASCADE"),
    )
    op.create_index("idx_payments_user", "payments", ["user_id"], unique=False)

    op.create_table(
        "keys_pool",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("vless_key", sa.Text(), nullable=False, unique=True),
        sa.Column("assigned_to", sa.Text()),
        sa.Column("created_at", sa.BigInteger(), nullable=False, server_default=sa.text("(extract(epoch from now()))::bigint")),
    )

def downgrade() -> None:
    op.drop_table("keys_pool")
    op.drop_index("idx_payments_user", table_name="payments")
    op.drop_table("payments")
    op.drop_index("idx_users_telegram", table_name="users")
    op.drop_table("users")
