CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet_address` text NOT NULL,
	`chain_id` integer DEFAULT 1 NOT NULL,
	`ens` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_login_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_wallet_address_unique` ON `users` (`wallet_address`);--> statement-breakpoint
CREATE TABLE `nonces` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`nonce` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`revoked_at` text,
	`is_revoked` integer DEFAULT false NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_token_hash_unique` ON `refresh_tokens` (`token_hash`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`wallet_address` text,
	`action` text NOT NULL,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`contract_type` text NOT NULL,
	`title` text NOT NULL,
	`symbol` text,
	`initial_supply` integer,
	`decimals` integer DEFAULT 18,
	`features` text,
	`description` text,
	`address` text,
	`abi` text,
	`network` text,
	`status` text DEFAULT 'draft',
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contracts_address_unique` ON `contracts` (`address`);