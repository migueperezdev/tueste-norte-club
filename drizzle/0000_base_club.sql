CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`plan_id` integer NOT NULL,
	`fecha_alta` integer NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `planes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clientes_email_unique` ON `clientes` (`email`);--> statement-breakpoint
CREATE TABLE `pedidos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cliente_id` integer NOT NULL,
	`cafe` text NOT NULL,
	`mes` text NOT NULL,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "pedidos_estado_valido" CHECK("pedidos"."estado" IN ('pendiente', 'tostando', 'enviado', 'entregado'))
);
--> statement-breakpoint
CREATE TABLE `planes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`precio_mensual` real NOT NULL,
	`gramos_mes` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `planes_nombre_unique` ON `planes` (`nombre`);