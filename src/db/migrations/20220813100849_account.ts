import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("account", (table) => {
    table.increments("id").primary();
    table.string("accountNumber").notNullable().unique();
    table.string("balance").notNullable().defaultTo("0");
    table.timestamps(true, true, true);
    table.integer("userID").unsigned().unique().references("user.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("account");
}
