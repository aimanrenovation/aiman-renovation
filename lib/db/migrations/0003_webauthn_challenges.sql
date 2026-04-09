CREATE TABLE IF NOT EXISTS "webauthn_challenges" (
	"key" text PRIMARY KEY NOT NULL,
	"challenge" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
