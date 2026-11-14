ALTER TABLE `clientes` ADD `user_id` text REFERENCES user(id);--> statement-breakpoint
CREATE UNIQUE INDEX `clientes_user_id_unique` ON `clientes` (`user_id`);